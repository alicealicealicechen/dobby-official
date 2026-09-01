/**
 * Sanity connection values, and nothing else.
 *
 * Split out from `sanity.ts` because that module reads `next/headers` for draft
 * mode, which cannot be imported into a client bundle — and `sanity.config.ts`,
 * which the Studio ships to the browser, needs these three values. Keeping the
 * constants here lets the config import them without dragging server-only code
 * along with them.
 */

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
