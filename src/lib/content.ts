/**
 * Content layer.
 *
 * Types mirror the Sanity content model in `sanity/schemaTypes`. Accessors take
 * a locale and query Sanity through `lib/sanity.ts`, falling back to the seed
 * content below when the CMS is not configured yet.
 *
 * Translation is document-level: in Sanity each post/category exists once per
 * language with a `language` field, and every query filters on it. The seed
 * data mirrors that by keying each collection on locale.
 */

import { sanityFetch } from "./sanity";
import {
  categoriesQuery,
  categoryQuery,
  postQuery,
  postsByCategoryQuery,
  postsQuery,
  siteSettingsQuery,
} from "./queries";
import type { Locale } from "./i18n";
import type { PortableTextBlock } from "@portabletext/types";

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export type Category = {
  title: string;
  slug: string;
  description?: string;
  /** Accent used for the card band and category label. */
  color: string;
};

/**
 * Seed content is authored in this shape because it is far easier to read and
 * edit than raw Portable Text. `toPortableText` converts it at the accessor
 * boundary, so the rendering path is identical whether a post comes from here
 * or from Sanity.
 */
type SeedSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

function textBlock(
  key: string,
  style: "h2" | "normal",
  text: string,
): PortableTextBlock {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
  };
}

function toPortableText(sections: SeedSection[]): PortableTextBlock[] {
  return sections.flatMap((section) => [
    textBlock(`${section.id}-h`, "h2", section.heading),
    ...section.paragraphs.map((text, i) =>
      textBlock(`${section.id}-p${i}`, "normal", text),
    ),
  ]);
}

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  /** Served from the Sanity asset CDN; absent until the post has one. */
  mainImage?: { src: string; alt: string };
  body: PortableTextBlock[];
  seo?: Seo;
};

export type SiteSettings = {
  name: string;
  /** Byline shown on every post — the blog has no per-author documents. */
  authorName: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  address: string[];
  linkedin: string;
};

/**
 * Structural fallback, not editorial content: the footer and `metadataBase`
 * cannot render without these. A `siteSettings` document in Sanity overrides
 * them field by field, so publishing one is still a live test.
 */
const SITE: Record<Locale, SiteSettings> = {
  zh: {
    name: "Dobby AI",
    authorName: "Dobby AI 團隊",
    tagline: "地端企業級 AI 平台",
    description:
      "地端企業級 AI 平台，為高複雜、關鍵基礎設施場域設計，讓 AI 成為真正融入團隊的工作夥伴。",
    url: "https://dobbyai.co",
    email: "sales@dobbyai.co",
    address: [
      "3F.-3, No. 262, Sec. 2, Beixin Rd.,",
      "Xindian Dist., New Taipei City, Taiwan",
    ],
    linkedin: "https://www.linkedin.com/company/dobbyai-co",
  },
  en: {
    name: "Dobby AI",
    authorName: "Dobby AI Team",
    tagline: "On-premise enterprise AI platform",
    description:
      "An on-premise enterprise AI platform built for complex, critical-infrastructure environments — so AI can genuinely join the team.",
    url: "https://dobbyai.co",
    email: "sales@dobbyai.co",
    address: [
      "3F.-3, No. 262, Sec. 2, Beixin Rd.,",
      "Xindian Dist., New Taipei City, Taiwan",
    ],
    linkedin: "https://www.linkedin.com/company/dobbyai-co",
  },
};

/**
 * Blog content comes from Sanity only — these are deliberately empty so that
 * anything appearing on the blog is provably real CMS data. Create a
 * `blog-category` and a `post` in the Studio (remember the `language` field)
 * and they show up here.
 */
const CATEGORIES: Record<Locale, Category[]> = { zh: [], en: [] };

type SeedPost = Omit<Post, "body"> & { body: SeedSection[] };

const POSTS: Record<Locale, SeedPost[]> = { zh: [], en: [] };

/* ------------------------------------------------------------------
   Accessors — Sanity first, seed content as the fallback.
   ------------------------------------------------------------------ */

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  const remote = await sanityFetch<SiteSettings>(siteSettingsQuery, { locale }, ["siteSettings"]);
  return remote?.name ? { ...SITE[locale], ...remote } : SITE[locale];
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  const remote = await sanityFetch<Category[]>(categoriesQuery, { locale }, ["blog-category"]);
  return remote?.length ? remote : CATEGORIES[locale];
}

export async function getCategory(
  slug: string,
  locale: Locale,
): Promise<Category | null> {
  const remote = await sanityFetch<Category>(categoryQuery, { slug, locale }, ["blog-category"]);
  return remote ?? CATEGORIES[locale].find((c) => c.slug === slug) ?? null;
}

function hydrate(post: SeedPost): Post {
  return { ...post, body: toPortableText(post.body) };
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  const remote = await sanityFetch<Post[]>(postsQuery, { locale }, ["post"]);
  if (remote?.length) return remote;
  return [...POSTS[locale]]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(hydrate);
}

export async function getPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const remote = await sanityFetch<Post>(postQuery, { slug, locale }, ["post"]);
  if (remote) return remote;
  const seed = POSTS[locale].find((p) => p.slug === slug);
  return seed ? hydrate(seed) : null;
}

export async function getPostsByCategory(
  slug: string,
  locale: Locale,
): Promise<Post[]> {
  const remote = await sanityFetch<Post[]>(
    postsByCategoryQuery,
    { slug, locale },
    ["post", "blog-category"],
  );
  if (remote?.length) return remote;
  const posts = await getPosts(locale);
  return posts.filter((p) => p.category === slug);
}

/**
 * Resolves a post's category record. Returns a neutral placeholder rather than
 * undefined when the list is empty or the slug is unknown, so a post whose
 * category has not been created yet still renders.
 */
const UNCATEGORISED: Category = {
  title: "",
  slug: "",
  color: "var(--neutral-600)",
};

export function resolveCategory(
  categories: Category[],
  slug: string,
): Category {
  return (
    categories.find((c) => c.slug === slug) ?? categories[0] ?? UNCATEGORISED
  );
}
