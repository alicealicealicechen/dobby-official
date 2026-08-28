import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * On-demand revalidation for Sanity publishes.
 *
 * Sanity fires this on publish and the matching cache tags are purged
 * immediately, so an edit is live in seconds instead of waiting out the 60s
 * ISR window. Tags are per document type, so publishing a post does not
 * invalidate the product page.
 *
 * A Vercel deploy hook would also work, but it rebuilds the whole site for a
 * one-word change — a minute or more, and a build every time marketing saves.
 *
 * Setup: Sanity → API → Webhooks → Create
 *   URL      https://<domain>/api/revalidate
 *   Dataset  production
 *   Trigger  Create, Update, Delete
 *   Filter   _type in ["post","blog-category","homePage","productPage","siteSettings"]
 *   Projection {"_type": _type}
 *   Secret   same value as SANITY_REVALIDATE_SECRET
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Only types the site actually queries; anything else is ignored. */
const KNOWN_TAGS = new Set([
  "post",
  "blog-category",
  "homePage",
  "productPage",
  "siteSettings",
]);

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  // Fail closed. Without the secret any caller could force cache purges, so an
  // unconfigured deployment refuses rather than accepting unsigned requests.
  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set");
    return Response.json({ error: "not_configured" }, { status: 500 });
  }

  let body: { _type?: string } | null;
  let isValidSignature: boolean | null;
  try {
    ({ body, isValidSignature } = await parseBody<{ _type?: string }>(
      request,
      secret,
    ));
  } catch (error) {
    console.error("[revalidate] could not parse webhook:", error);
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  if (!isValidSignature) {
    return Response.json({ error: "invalid_signature" }, { status: 401 });
  }

  const type = body?._type;
  if (!type || !KNOWN_TAGS.has(type)) {
    // Not an error: the webhook may cover types this site does not render.
    return Response.json({ ok: true, skipped: type ?? "unknown" });
  }

  // Next 16 requires a cache-life profile; "max" purges immediately and lets
  // the next request repopulate from Sanity.
  revalidateTag(type, "max");
  console.log(`[revalidate] purged tag: ${type}`);

  return Response.json({ ok: true, revalidated: type, now: Date.now() });
}
