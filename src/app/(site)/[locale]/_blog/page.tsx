import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import BlogIndex from "@/components/BlogIndex";
import {
  getCategories,
  getPosts,
  getSiteSettings,
} from "@/lib/content";
import { getDictionary, path, toLocale } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const t = getDictionary(locale).blog;

  return {
    title: t.title,
    description: t.lede,
    alternates: { canonical: path(locale, "/blog") },
  };
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const [site, posts, categories] = await Promise.all([
    getSiteSettings(locale),
    getPosts(locale),
    getCategories(locale),
  ]);
  const t = getDictionary(locale);

  return (
    <>
      <Breadcrumb
        baseUrl={site.url}
        items={[
          { label: t.breadcrumb.home, href: path(locale) },
          { label: t.breadcrumb.blog },
        ]}
      />
      <main>
        <BlogIndex
          posts={posts}
          categories={categories}
          authorName={site.authorName}
          locale={locale}
          t={{
            eyebrow: t.blog.eyebrow,
            title: t.blog.title,
            lede: t.blog.lede,
            searchPlaceholder: t.blog.searchPlaceholder,
            searchLabel: t.blog.searchLabel,
            featured: t.blog.featured,
            noResults: t.blog.noResults("{q}"),
            empty: t.blog.empty,
            pagination: t.blog.pagination,
          }}
        />
      </main>
    </>
  );
}
