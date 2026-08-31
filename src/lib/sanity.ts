import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2024-10-01";

/**
 * The Sanity project is created in Phase 0 of the implementation plan. Until
 * `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, every query short-circuits to null and
 * the accessors in `content.ts` serve the seed content instead — so the site
 * builds and renders before the CMS exists, and switches over with no code
 * change once the env vars land.
 */
export const isSanityConfigured = Boolean(projectId);

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

  try {
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
