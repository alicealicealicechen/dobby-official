/**
 * Contact form handler.
 *
 * Email is the only sink. This used to also write each enquiry to Sanity so
 * that one could survive the other failing, but the dataset returns to a public
 * ACL when the trial ends, and public means every name, address and message is
 * readable by anyone holding the project id — which ships in the client bundle
 * by design. Paying to keep a private copy of what is already in the inbox is
 * not worth it.
 *
 * So delivery is single-path, and the failure is made visible: a Resend outage
 * returns 502 and the form shows the team address, which is better than a
 * silent loss but worse than the old redundancy. If enquiries ever need a
 * durable second home, put it somewhere private by default.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.CONTACT_TO_EMAIL ?? "support@dobbyai.co";
// Resend's sandbox sender works without verifying a domain. Swap for an
// address on dobbyai.co once SPF/DKIM are set up — deliverability is better.
const FROM = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
// Empty in production. Set CONTACT_SUBJECT_PREFIX on Preview deployments so
// their mail is obviously not a real enquiry — production must default to no
// prefix, or an unset variable silently tags live enquiries as tests.
const SUBJECT_PREFIX = process.env.CONTACT_SUBJECT_PREFIX ?? "";

const MAX_LENGTHS = { name: 100, email: 200, message: 5000 };

// `name` is interpolated into the Subject header and `email` into Reply-To.
// A control character in either is a header-injection attempt or corrupt input,
// so they are rejected outright rather than stripped — silently mangling
// someone's name is worse than telling them the field is invalid.
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

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
  if (CONTROL_CHARS.test(name) || CONTROL_CHARS.test(email)) {
    return Response.json({ error: "invalid_characters" }, { status: 400 });
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

  try {
    await sendEmail(fields);
  } catch (error) {
    // Logged with no enquiry content: the request body is the sensitive part
    // and platform logs are not the place for it.
    console.error("[contact] email failed:", error);
    return Response.json({ error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
