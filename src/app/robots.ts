import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";
import { defaultLocale } from "@/lib/i18n";

/**
 * Preview and development deploys are excluded from indexing entirely; only a
 * production build serves an allow rule (plan.md §3.4).
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteSettings(defaultLocale);
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/studio" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
