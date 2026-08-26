import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Icon from "@/components/Icon";
import {
  getAuthor,
  getCategories,
  getPosts,
  getSiteSettings,
  resolveCategory,
} from "@/lib/content";

export const revalidate = 60;

/**
 * The design project has no author template, so this follows the category page
 * layout — the closest pattern in the system — to stay consistent.
 */
export async function generateStaticParams() {
  const author = await getAuthor();
  return author ? [{ slug: author.slug }] : [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return {};

  return {
    title: `${author.name} · 部落格`,
    description: author.bio,
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, author, posts, categories] = await Promise.all([
    getSiteSettings(),
    getAuthor(slug),
    getPosts(),
    getCategories(),
  ]);

  if (!author) notFound();

  return (
    <>
      <Header nav={site.nav} active="blog" />
      <Breadcrumb
        baseUrl={site.url}
        items={[
          { label: "首頁", href: "/" },
          { label: "部落格", href: "/blog" },
          { label: author.name },
        ]}
      />

      <main>
        <section className="mx-auto max-w-[1200px] px-8 pt-10 pb-2">
          <p className="mb-2.5 text-[12.5px] font-semibold tracking-[0.03em] text-orange-700">
            作者
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
            共 {posts.length} 篇文章
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-8 pb-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const category = resolveCategory(categories, post.category);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
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

      <Footer />
    </>
  );
}
