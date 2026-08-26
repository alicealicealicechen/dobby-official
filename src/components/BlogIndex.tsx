"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Icon from "./Icon";
import Logo from "./Logo";
import type { Category, Post } from "@/lib/content";
import { path, type Locale } from "@/lib/i18n";

const PER_PAGE = 3;

export type BlogIndexLabels = {
  eyebrow: string;
  title: string;
  lede: string;
  searchPlaceholder: string;
  searchLabel: string;
  featured: string;
  /** Contains a `{q}` placeholder — dictionary functions cannot cross the
      server/client boundary, so the template is interpolated here. */
  noResults: string;
  pagination: string;
};

export default function BlogIndex({
  posts,
  categories,
  authorName,
  locale,
  t,
}: {
  posts: Post[];
  categories: Category[];
  authorName: string;
  locale: Locale;
  t: BlogIndexLabels;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const byslug = useMemo(
    () => new Map(categories.map((c) => [c.slug, c])),
    [categories],
  );
  const label = (slug: string) => byslug.get(slug)?.title ?? slug;
  const colour = (slug: string) =>
    byslug.get(slug)?.color ?? "var(--orange-600)";

  const query = search.trim();
  const showFeatured = !query && page === 1;
  const featured = posts[0];
  const pool = showFeatured ? posts.slice(1) : posts;

  const filtered = query
    ? pool.filter((p) =>
        [p.title, p.excerpt, label(p.category)].some((field) =>
          field.includes(query),
        ),
      )
    : pool;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (current - 1) * PER_PAGE,
    current * PER_PAGE,
  );

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-8 pt-12 pb-2">
        <p className="mb-4 font-mono text-[12.5px] font-bold tracking-[0.14em] text-primary uppercase">
          {t.eyebrow}
        </p>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="m-0 mb-2.5 text-[clamp(2.2rem,4vw,3rem)] font-extrabold tracking-[-0.02em] text-ink">
              {t.title}
            </h1>
            <p className="m-0 text-[16px] text-secondary">
              {t.lede}
            </p>
          </div>
          <div className="relative w-[280px] max-w-full">
            <Icon
              name="search"
              size={16}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted opacity-60"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchLabel}
              className="h-[42px] w-full rounded-full border border-line bg-card pr-4 pl-10 text-sm text-ink placeholder:text-muted"
            />
          </div>
        </div>
      </section>

      {showFeatured && featured && (
        <section className="mx-auto max-w-[1200px] px-8 pb-10">
          <Link
            href={path(locale, `/blog/${featured.slug}`)}
            className="grid overflow-hidden rounded-[20px] border border-line bg-card shadow-md lg:grid-cols-[1.1fr_1fr]"
          >
            <div className="flex min-h-[280px] items-center justify-center bg-sage-700 p-8">
              <Logo variant="mark" invert className="h-16 opacity-35" />
            </div>
            <div className="flex flex-col justify-center p-[clamp(28px,4vw,44px)]">
              <p className="mb-3.5 font-mono text-[11.5px] font-bold tracking-[0.06em] text-primary">
                {t.featured} · {label(featured.category)}
              </p>
              <h2 className="m-0 mb-3.5 text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.35] font-bold tracking-[-0.01em] text-ink">
                {featured.title}
              </h2>
              <p className="m-0 mb-5 text-[14.5px] leading-[1.7] text-secondary">
                {featured.excerpt}
              </p>
              <p className="m-0 flex items-center gap-2.5 text-[13px] text-muted">
                <span>{authorName}</span>
                <span>·</span>
                <span>{featured.publishedAt}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </p>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-[1200px] px-8 pb-4">
        {pageItems.length === 0 ? (
          <p className="py-12 text-center text-[15px] text-muted">
            {t.noResults.replace("{q}", query)}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((post) => (
              <Link
                key={post.slug}
                href={path(locale, `/blog/${post.slug}`)}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm"
              >
                <span
                  aria-hidden
                  className="h-1 w-full"
                  style={{ background: colour(post.category) }}
                />
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  <span
                    className="text-xs font-bold tracking-[0.03em]"
                    style={{ color: colour(post.category) }}
                  >
                    {label(post.category)}
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
            ))}
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <nav
          aria-label={t.pagination}
          className="mx-auto flex max-w-[1200px] justify-center gap-2 px-8 pt-2 pb-[72px]"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
            const isCurrent = n === current;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={isCurrent ? "page" : undefined}
                className={`h-[38px] w-[38px] cursor-pointer rounded-lg border text-sm font-semibold transition-colors duration-150 ease-standard ${
                  isCurrent
                    ? "border-primary bg-primary text-on-primary"
                    : "border-line bg-card text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {n}
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}
