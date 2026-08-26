import { groq } from "next-sanity";

/**
 * Every query filters on `language` — Sanity translates at document level, so
 * a zh post and its en counterpart are two documents sharing a slug.
 */

/** Shared SEO projection — matches the `seo` object in sanity/schemaTypes. */
const SEO = groq`seo{metaTitle, metaDescription, canonicalUrl, noIndex, "ogImage": ogImage.asset->url}`;

const POST_FIELDS = groq`
  title,
  "slug": slug.current,
  excerpt,
  "category": categories[0]->slug.current,
  publishedAt,
  readTime,
  "mainImage": {"src": mainImage.asset->url, "alt": mainImage.alt},
  body[]{ "id": _key, heading, paragraphs },
  ${SEO}
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && language == $locale][0]{
    "name": siteName,
    tagline,
    description,
    url,
    email,
    address,
    linkedin
  }
`;

export const categoriesQuery = groq`
  *[_type == "category" && language == $locale] | order(order asc){
    title,
    "slug": slug.current,
    description,
    color
  }
`;

export const categoryQuery = groq`
  *[_type == "category" && slug.current == $slug && language == $locale][0]{
    title,
    "slug": slug.current,
    description,
    color
  }
`;

export const postsQuery = groq`
  *[_type == "post" && language == $locale && seo.noIndex != true] | order(publishedAt desc){
    ${POST_FIELDS}
  }
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug && language == $locale][0]{
    ${POST_FIELDS}
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && language == $locale && $slug in categories[]->slug.current] | order(publishedAt desc){
    ${POST_FIELDS}
  }
`;

export const authorQuery = groq`
  *[_type == "author" && slug.current == $slug && language == $locale][0]{
    name,
    "slug": slug.current,
    bio,
    "avatar": avatar.asset->url
  }
`;

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug && language == $locale][0]{
    title,
    "slug": slug.current,
    sections,
    ${SEO}
  }
`;

/** Every indexable route, for app/sitemap.ts. */
export const sitemapQuery = groq`{
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, language, "updatedAt": _updatedAt },
  "categories": *[_type == "category" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt },
  "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }
}`;
