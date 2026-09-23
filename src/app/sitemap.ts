import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";
import { locales, path } from "@/lib/i18n";

/**
 * Static routes per locale. The blog is hidden for now; when it returns, add
 * its post and category routes back from getPosts/getCategories (see git
 * history), dropping posts flagged `noIndex`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLocale = await Promise.all(
    locales.map(async (locale) => {
      const site = await getSiteSettings(locale);

      return ["/", "/product", "/contact"].map((to) => ({
        url: `${site.url}${path(locale, to)}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: to === "/" ? 1 : 0.8,
      }));
    }),
  );

  return perLocale.flat();
}
