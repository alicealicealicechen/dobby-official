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

const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T | null> {
  if (!client) return null;

  try {
    // SSG + ISR, per the rendering contract in the README.
    return await client.fetch<T>(query, params, {
      next: { revalidate: 60 },
    });
  } catch (error) {
    console.error("[sanity] query failed; falling back to seed content", error);
    return null;
  }
}
