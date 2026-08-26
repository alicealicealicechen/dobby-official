import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import {
  getCategories,
  getCategory,
  getPostsByCategory,
  getSiteSettings,
} from "@/lib/content";
import { getDictionary, locales, path, toLocale } from "@/lib/i18n";

export const revalidate = 60;

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const categories = await getCategories(locale);
      return categories.map((category) => ({ locale, slug: category.slug }));
    }),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const category = await getCategory(slug, locale);
  if (!category) return {};

  return {
    title: `${category.title} · ${getDictionary(locale).blog.title}`,
    description: category.description,
    alternates: { canonical: path(locale, `/blog/category/${slug}`) },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const [site, category, posts] = await Promise.all([
    getSiteSettings(locale),
    getCategory(slug, locale),
    getPostsByCategory(slug, locale),
  ]);

  if (!category) notFound();

  const t = getDictionary(locale);

  return (
    <>
      <Breadcrumb
        baseUrl={site.url}
        items={[
          { label: t.breadcrumb.home, href: path(locale) },
          { label: t.breadcrumb.blog, href: path(locale, "/blog") },
          { label: category.title },
        ]}
      />

      <main>
        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 pt-10 pb-2">
          <p className="mb-2.5 text-[12.5px] font-semibold tracking-[0.03em] text-orange-700">
            {t.blog.category}
          </p>
          <h1 className="m-0 mb-3 text-[clamp(2rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em] text-ink">
            {category.title}
          </h1>
          <p className="m-0 mb-8 text-[15px] text-secondary">
            {category.description ? `${category.description} ` : ""}
            {t.blog.postCount(posts.length)}
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 pb-16">
          {posts.length === 0 ? (
            <p className="py-12 text-center text-[15px] text-muted">
              {t.blog.emptyCategory}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={path(locale, `/blog/${post.slug}`)}
                  className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card"
                >
                  <div
                    className="flex h-[120px] items-center justify-center"
                    style={{ background: category.color }}
                  >
                    <Icon
                      name="fileText"
                      size={28}
                      className="text-white opacity-55"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <span className="text-xs font-semibold text-orange-700">
                      {category.title}
                    </span>
                    <h2 className="m-0 text-[16.5px] leading-[1.4] font-bold text-ink">
                      {post.title}
                    </h2>
                    <p className="m-0 flex-1 text-[13.5px] leading-[1.65] text-secondary">
                      {post.excerpt}
                    </p>
                    <p className="m-0 mt-2 text-[12.5px] text-muted">
                      {post.publishedAt} · {post.readTime}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <p className="mt-8">
            <Link href={path(locale, "/blog")} className="text-sm font-semibold">
              {t.blog.allPosts}
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
