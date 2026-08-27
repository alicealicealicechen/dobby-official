import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/lib/sanity";

/**
 * Contact form handler.
 *
 * Delivers to two places on purpose: an email to the team, and a document in
 * Sanity. They fail independently, so an enquiry survives a provider outage or
 * an expired API key. The request only fails if *both* sinks fail — otherwise
 * the visitor is told it worked, because it did.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.CONTACT_TO_EMAIL ?? "support@dobbyai.co";
// Resend's sandbox sender works without verifying a domain. Swap for an
// address on dobbyai.co once SPF/DKIM are set up — deliverability is better.
const FROM = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
// Drop CONTACT_SUBJECT_PREFIX (or set it empty) when this goes live.
const SUBJECT_PREFIX = process.env.CONTACT_SUBJECT_PREFIX ?? "[TEST] ";

const MAX_LENGTHS = { name: 100, email: 200, message: 5000 };

/**
 * Verifies a Cloudflare Turnstile token.
 *
 * Fails *closed* in production: if the secret is missing there, every
 * submission is rejected rather than quietly waved through. A misconfigured
 * captcha that silently passes everything is worse than no captcha, because
 * nobody notices. Locally it is skipped so the form works without credentials.
 */
async function verifyCaptcha(
  token: string,
  ip: string,
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] TURNSTILE_SECRET_KEY missing in production");
      return { ok: false, reason: "captcha_misconfigured" };
    }
    return { ok: true };
  }

  if (!token) return { ok: false, reason: "captcha_missing" };

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    },
  );

  const data = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };
  if (!data.success) {
    console.warn("[contact] captcha rejected:", data["error-codes"]);
    return { ok: false, reason: "captcha_failed" };
  }
  return { ok: true };
}

/**
 * Naive per-IP throttle. On serverless each instance keeps its own map, so this
 * slows a naive script rather than stopping a determined one; the honeypot does
 * the heavier lifting. Move to a shared store if abuse becomes real.
 */
const RATE_LIMIT = { windowMs: 60_000, max: 3 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT.windowMs,
  );

  // Only accepted attempts count. Recording rejected ones too would mean each
  // retry pushed the window forward, so anyone who hit the limit — including
  // someone retrying after a delivery error — could never get back in.
  if (recent.length >= RATE_LIMIT.max) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear(); // crude bound on memory
  return false;
}

async function sendEmail(fields: {
  name: string;
  email: string;
  message: string;
  locale: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: fields.email,
      subject: `${SUBJECT_PREFIX}網站聯絡表單 — ${fields.name}`,
      text: [
        `姓名: ${fields.name}`,
        `Email: ${fields.email}`,
        `語系: ${fields.locale}`,
        "",
        fields.message,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

async function saveToSanity(
  fields: { name: string; email: string; message: string; locale: string },
  emailDelivered: boolean,
): Promise<void> {
  const token = process.env.SANITY_API_TOKEN;
  if (!projectId || !token) {
    throw new Error("Sanity write is not configured");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  await client.create({
    _type: "contactSubmission",
    ...fields,
    submittedAt: new Date().toISOString(),
    status: "new",
    emailDelivered,
  });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: a field hidden from people. Anything filling it is a bot, and it
  // gets a 200 so the bot has no signal to retry with.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const locale = body.locale === "en" ? "en" : "zh";

  if (!name || !email || !message) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    message.length > MAX_LENGTHS.message
  ) {
    return Response.json({ error: "too_long" }, { status: 400 });
  }

  const captcha = await verifyCaptcha(
    String(body.turnstileToken ?? ""),
    ip,
  );
  if (!captcha.ok) {
    return Response.json({ error: captcha.reason }, { status: 403 });
  }

  const fields = { name, email, message, locale };

  // Email first, so the Sanity document can record whether it went out.
  let emailDelivered = true;
  try {
    await sendEmail(fields);
  } catch (error) {
    emailDelivered = false;
    console.error("[contact] email failed:", error);
  }

  let stored = true;
  try {
    await saveToSanity(fields, emailDelivered);
  } catch (error) {
    stored = false;
    console.error("[contact] sanity write failed:", error);
  }

  // One sink is enough for the enquiry to be safe.
  if (!emailDelivered && !stored) {
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true, emailDelivered, stored });
}
