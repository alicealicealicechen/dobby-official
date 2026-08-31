import { notFound, permanentRedirect } from "next/navigation";
import { getRedirects, resolveRedirect } from "@/lib/content";

/**
 * Unmatched paths under a locale land here.
 *
 * Two jobs, in order. First the CMS redirect list is consulted, so marketing
 * can retire a URL without a deploy. Then, if nothing matches, the request
 * hands off to not-found.tsx and gets the designed 404 in the right language
 * instead of Next's unstyled fallback.
 *
 * Redirects live here rather than in next.config because that list is built
 * once at deploy time: an entry published in the Studio would do nothing until
 * someone happened to redeploy. Running in the catch-all also means a redirect
 * is only ever consulted after every real route has failed to match, so a
 * careless entry cannot shadow a live page — the page always wins.
 */
export const dynamicParams = true;

export default async function CatchAll({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale, rest } = await params;

  const target = resolveRedirect(
    await getRedirects(),
    locale,
    `/${rest.join("/")}`,
  );
  // 308 rather than 307: these are retired URLs, and the permanent form is what
  // passes the old page's search ranking on to the new one.
  if (target) permanentRedirect(target);

  notFound();
}
