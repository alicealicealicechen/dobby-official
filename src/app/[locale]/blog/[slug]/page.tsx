import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ShareActions from "@/components/ShareActions";
import {
  getAuthor,
  getCategories,
  getPost,
  getPosts,
  getSiteSettings,
  resolveCategory,
} from "@/lib/content";
import { articleSchema } from "@/lib/schemas";
import { getDictionary, locales, path, toLocale } from "@/lib/i18n";

export const revalidate = 60;

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getPosts(locale);
      return posts.map((post) => ({ locale, slug: post.slug }));
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
  const post = await getPost(slug, locale);
  if (!post) return {};

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    alternates: {
      canonical: post.seo?.canonicalUrl ?? path(locale, `/blog/${slug}`),
    },
    robots: post.seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      ...(post.seo?.ogImage ? { images: [post.seo.ogImage] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const [site, post, posts, categories, author] = await Promise.all([
    getSiteSettings(locale),
    getPost(slug, locale),
    getPosts(locale),
    getCategories(locale),
    getAuthor(locale),
  ]);

  if (!post) notFound();

  const t = getDictionary(locale);
  const category = resolveCategory(categories, post.category);
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Breadcrumb
        baseUrl={site.url}
        items={[
          { label: t.breadcrumb.home, href: path(locale) },
          { label: t.breadcrumb.blog, href: path(locale, "/blog") },
          { label: post.title },
        ]}
      />

      <main>
        <article className="mx-auto max-w-[1200px] px-8 pt-8 pb-6">
          <Link
            href={path(locale, `/blog/category/${category.slug}`)}
            className="mb-3.5 inline-block text-[12.5px] font-semibold tracking-[0.03em]"
            style={{ color: category.color }}
          >
            {category.title}
          </Link>
          <h1 className="m-0 mb-5 max-w-[760px] text-[clamp(2rem,3.5vw,2.75rem)] font-bold tracking-[-0.02em] text-ink">
            {post.title}
          </h1>
          <div className="mb-8 flex flex-wrap items-center gap-4 text-[13.5px] text-muted">
            <span className="flex items-center gap-1.5">
              <Icon name="user" size={14} className="opacity-60" />
              {author?.name ?? site.name}
            </span>
            <span>·</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Icon name="clock" size={14} className="opacity-60" />
              {post.readTime}
            </span>
          </div>
          {/* Served from the Sanity asset CDN; posts without one skip the slot. */}
          {post.mainImage && (
            <Image
              src={post.mainImage.src}
              alt={post.mainImage.alt}
              width={1200}
              height={280}
              sizes="(max-width: 1200px) 100vw, 1136px"
              className="mb-10 block h-[280px] w-full rounded-2xl object-cover"
            />
          )}
        </article>

        <section className="mx-auto grid max-w-[1200px] items-start gap-14 px-8 pb-16 lg:grid-cols-[220px_1fr]">
          <nav
            aria-label={t.blog.toc}
            className="top-24 hidden flex-col gap-2.5 rounded-xl border border-line bg-card p-5 lg:sticky lg:flex"
          >
            <h2 className="m-0 mb-1 text-xs font-bold tracking-[0.03em] text-ink">
              {t.blog.toc}
            </h2>
            {post.body.map((block) => (
              <a
                key={block.id}
                href={`#${block.id}`}
                className="text-[13.5px] text-secondary hover:text-primary"
              >
                {block.heading}
              </a>
            ))}
          </nav>

          <div>
            <div className="max-w-[680px] text-[16px] leading-[1.9] text-ink-2">
              {post.body.map((block) => (
                <section key={block.id}>
                  <h2
                    id={block.id}
                    className="m-0 mb-4 scroll-mt-24 text-[22px] font-bold text-ink"
                  >
                    {block.heading}
                  </h2>
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-0 mb-7">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <ShareActions
              t={{
                copyLink: t.blog.copyLink,
                copied: t.blog.copied,
                shareLinkedIn: t.blog.shareLinkedIn,
              }}
            />
          </div>
        </section>

        {related.length > 0 && (
          <section className="mx-auto max-w-[1200px] px-8 pb-[72px]">
            <h2 className="m-0 mb-5 text-[20px] font-bold text-ink">
              {t.blog.related}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => {
                const itemCategory = resolveCategory(categories, item.category);
                return (
                  <Link
                    key={item.slug}
                    href={path(locale, `/blog/${item.slug}`)}
                    className="rounded-[14px] border border-line bg-card p-5"
                  >
                    <span
                      className="mb-2 block text-xs font-semibold"
                      style={{ color: itemCategory.color }}
                    >
                      {itemCategory.title}
                    </span>
                    <span className="block text-[15px] leading-[1.4] font-bold text-ink">
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <JsonLd schema={articleSchema(post, author, site)} />
    </>
  );
}
