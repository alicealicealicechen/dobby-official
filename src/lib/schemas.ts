/**
 * JSON-LD generators (plan.md §3.5). Keeping them here rather than inline in
 * pages means the shape of each schema is defined once and validated in one
 * place against the Rich Results Test.
 */

import type { Post, SiteSettings } from "./content";

export type Json = Record<string, unknown>;

export function organizationSchema(site: SiteSettings): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.join(" "),
      addressCountry: "TW",
    },
    sameAs: [site.linkedin],
  };
}

export function articleSchema(post: Post, site: SiteSettings): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    ...(post.mainImage ? { image: `${site.url}${post.mainImage.src}` } : {}),
    author: {
      "@type": "Organization",
      name: site.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}`,
    },
  };
}

export function breadcrumbSchema(
  items: { label: string; href?: string }[],
  baseUrl: string,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
