import { notFound } from "next/navigation";

/**
 * Unmatched paths under a locale land here and hand off to not-found.tsx, so a
 * mistyped URL gets the designed 404 in the right language instead of Next's
 * unstyled fallback. More specific routes always win over a catch-all, so this
 * never shadows a real page.
 */
export const dynamicParams = true;

export default function CatchAll(): never {
  notFound();
}
