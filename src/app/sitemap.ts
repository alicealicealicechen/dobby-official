import type { MetadataRoute } from "next";
import { getCategories, getPosts, getSiteSettings } from "@/lib/content";

/**
 * Built from the same accessors the pages use, so a new post is in the sitemap
 * the moment it is published — no separate list to keep in step (plan.md §3.3).
 * Posts flagged `noIndex` are dropped.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, posts, categories] = await Promise.all([
    getSiteSettings(),
    getPosts(),
    getCategories(),
  ]);

  const staticRoutes = ["", "/product", "/blog", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const postRoutes = posts
    .filter((post) => !post.seo?.noIndex)
    .map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  const categoryRoutes = categories.map((category) => ({
    url: `${site.url}/blog/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
