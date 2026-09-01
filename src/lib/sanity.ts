import { draftMode } from "next/headers";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./sanity.env";

// Re-exported so server modules keep one import site for everything Sanity.
export { apiVersion, dataset, isSanityConfigured, projectId } from "./sanity.env";

/**
 * Server-only. Next replaces non-NEXT_PUBLIC_ vars with undefined in client
 * bundles, so this never reaches the browser — and every query in this app runs
 * during SSG/ISR anyway.
 *
 * A private dataset returns an empty result set rather than an error when the
 * request is unauthenticated, which reads exactly like "the CMS is empty". The
 * token avoids that whether the dataset is private or public.
 */
const token = process.env.SANITY_API_TOKEN;

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // The CDN cannot serve authenticated reads of a private dataset.
      useCdn: !token,
      perspective: "published",
      token,
    })
  : null;

/**
 * Same project, but reading unpublished drafts.
 *
 * Only ever reached when draft mode is on, which only happens for an editor
 * who arrived from the Studio. Everyone else keeps the published, CDN-cached
 * client — the cost of an uncached authenticated read is paid by the person
 * who asked for a preview and by nobody else.
 */
export const draftClient = client?.withConfig({
  perspective: "drafts",
  useCdn: false,
  token,
});

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  /**
   * Document types this query depends on. Publishing in the Studio fires a
   * webhook that purges exactly these tags, so a post going live does not
   * rebuild the product page. Without tags the only recovery is waiting out
   * the 60s window.
   */
  tags: string[] = [],
): Promise<T | null> {
  if (!client) return null;

  // Reading the flag cannot throw here, but it can be called outside a request
  // (a script importing this module), where there is no draft mode to read.
  let previewing = false;
  try {
    previewing = (await draftMode()).isEnabled;
  } catch {
    previewing = false;
  }

  try {
    if (previewing && draftClient) {
      // Deliberately uncached. A preview that served a cached draft would show
      // the editor their previous save and look exactly like a broken publish.
      return await draftClient.fetch<T>(query, params, { cache: "no-store" });
    }
    // SSG + ISR, per the rendering contract in the README.
    return await client.fetch<T>(query, params, {
      next: { revalidate: 60, tags },
    });
  } catch (error) {
    console.error("[sanity] query failed; falling back to seed content", error);
    return null;
  }
}

/**
 * Lays a partial CMS document over the structural fallback.
 *
 * A plain spread will not do. GROQ returns `null` for every field the editor
 * left blank, and in a spread those nulls win — so a siteSettings document
 * filled in with just a name would blank the footer address and crash the
 * render on `address.map`. Only meaningful values are allowed to override,
 * which is what "overrides field by field" was always supposed to mean.
 */
export function overlay<T extends object>(
  base: T,
  remote: Partial<T> | null | undefined,
): T {
  if (!remote) return base;
  const merged = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(remote)) {
    const blank =
      value == null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);
    if (!blank) merged[key] = value;
  }
  return merged as T;
}

/**
 * Non-null client for the draft-mode route, which cannot run at all without a
 * project. Throwing here beats exporting `null` and having the route fail
 * later with a message that says nothing about the missing configuration.
 */
export const previewClient = (() => {
  if (!client) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
  return client.withConfig({ token, useCdn: false });
})();
