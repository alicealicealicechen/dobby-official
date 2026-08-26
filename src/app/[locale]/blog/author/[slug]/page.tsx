import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import {
  getAuthor,
  getCategories,
  getPosts,
  getSiteSettings,
  resolveCategory,
} from "@/lib/content";
import { getDictionary, locales, path, toLocale } from "@/lib/i18n";

export const revalidate = 60;

/**
 * The design project has no author template, so this follows the category page
 * layout — the closest pattern in the system — to stay consistent.
 */
export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const author = await getAuthor(locale);
      return author ? [{ locale, slug: author.slug }] : [];
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
  const author = await getAuthor(locale, slug);
  if (!author) return {};

  return {
    title: `${author.name} · ${getDictionary(locale).blog.title}`,
    description: author.bio,
    alternates: { canonical: path(locale, `/blog/author/${slug}`) },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const [site, author, posts, categories] = await Promise.all([
    getSiteSettings(locale),
    getAuthor(locale, slug),
    getPosts(locale),
    getCategories(locale),
  ]);

  if (!author) notFound();

  const t = getDictionary(locale);

  return (
    <>
      <Breadcrumb
        baseUrl={site.url}
        items={[
          { label: t.breadcrumb.home, href: path(locale) },
          { label: t.breadcrumb.blog, href: path(locale, "/blog") },
          { label: author.name },
        ]}
      />

      <main>
        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 pt-10 pb-2">
          <p className="mb-2.5 text-[12.5px] font-semibold tracking-[0.03em] text-orange-700">
            {t.blog.author}
          </p>
          <h1 className="m-0 mb-3 text-[clamp(2rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em] text-ink">
            {author.name}
          </h1>
          {author.bio && (
            <p className="m-0 mb-2 max-w-[640px] text-[15px] leading-[1.7] text-secondary">
              {author.bio}
            </p>
          )}
          <p className="m-0 mb-8 text-[15px] text-muted">
            {t.blog.postCount(posts.length)}
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 pb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const category = resolveCategory(categories, post.category);
              return (
                <Link
                  key={post.slug}
                  href={path(locale, `/blog/${post.slug}`)}
                  className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm"
                >
                  <span
                    aria-hidden
                    className="h-1 w-full"
                    style={{ background: category.color }}
                  />
                  <div className="flex flex-1 flex-col gap-2.5 p-6">
                    <span
                      className="text-xs font-bold tracking-[0.03em]"
                      style={{ color: category.color }}
                    >
                      {category.title}
                    </span>
                    <h2 className="m-0 text-[17px] leading-[1.4] font-bold text-ink">
                      {post.title}
                    </h2>
                    <p className="m-0 flex-1 text-[13.5px] leading-[1.65] text-secondary">
                      {post.excerpt}
                    </p>
                    <p className="m-0 mt-2 flex items-center gap-2.5 border-t border-line pt-3.5 text-[12.5px] text-muted">
                      <span>{post.publishedAt}</span>
                      <span>·</span>
                      <Icon name="clock" size={12} className="opacity-60" />
                      <span>{post.readTime}</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
