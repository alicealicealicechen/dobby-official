import type { MetadataRoute } from "next";
import { getCategories, getPosts, getSiteSettings } from "@/lib/content";
import { locales, path } from "@/lib/i18n";

/**
 * Built from the same accessors the pages use, so a new post is in the sitemap
 * the moment it is published — no separate list to keep in step (plan.md §3.3).
 * Posts flagged `noIndex` are dropped.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const perLocale = await Promise.all(
    locales.map(async (locale) => {
      const [site, posts, categories] = await Promise.all([
        getSiteSettings(locale),
        getPosts(locale),
        getCategories(locale),
      ]);

      const staticRoutes = ["/", "/product", "/blog", "/contact"].map((to) => ({
        url: `${site.url}${path(locale, to)}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: to === "/" ? 1 : 0.8,
      }));

      const postRoutes = posts
        .filter((post) => !post.seo?.noIndex)
        .map((post) => ({
          url: `${site.url}${path(locale, `/blog/${post.slug}`)}`,
          lastModified: new Date(post.publishedAt),
          changeFrequency: "yearly" as const,
          priority: 0.6,
        }));

      const categoryRoutes = categories.map((category) => ({
        url: `${site.url}${path(locale, `/blog/category/${category.slug}`)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));

      return [...staticRoutes, ...postRoutes, ...categoryRoutes];
    }),
  );

  return perLocale.flat();
}
