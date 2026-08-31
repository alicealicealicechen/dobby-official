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
  body[]{ ..., _type == "image" => { ..., "url": asset->url } },
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
    linkedin,
    authorName
  }
`;

export const categoriesQuery = groq`
  *[_type == "blog-category" && language == $locale] | order(order asc){
    title,
    "slug": slug.current,
    description,
    color
  }
`;

export const categoryQuery = groq`
  *[_type == "blog-category" && slug.current == $slug && language == $locale][0]{
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


export const homePageQuery = groq`
  *[_type == "homePage" && language == $locale][0]{
    "hero": {
      "eyebrow": heroEyebrow,
      "titleLead": heroTitleLead,
      "titleRest": heroTitleRest,
      "highlight": heroHighlight,
      "lede": heroLede
    },
    "band": {
      "title": bandTitle,
      "body": bandBody,
      "image": bandImage.asset->url,
      "imageAlt": bandImage.alt
    },
    pointsTitle,
    points[]{ title, body },
    "cta": {
      "eyebrow": ctaEyebrow,
      "title": ctaTitle,
      "lede": ctaLede,
      "primary": ctaPrimary,
      "secondary": ctaSecondary[]{ label, to }
    }
  }
`;

export const productPageQuery = groq`
  *[_type == "productPage" && language == $locale][0]{
    "hero": { "title": heroTitle, "lede": heroLede },
    "overview": {
      "title": overviewTitle,
      "image": overviewImage.asset->url,
      "imageAlt": overviewImage.alt,
      features[]{ icon, title, body }
    },
    plansTitle,
    plans[]{ name, subtitle, description, features },
    faqTitle,
    faqs[]{ q, a },
    "closing": { "title": closingTitle, "cta": closingCta }
  }
`;

