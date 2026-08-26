/**
 * i18n core.
 *
 * Locale lives in the URL as the first segment (`/zh/...`, `/en/...`) so every
 * page stays statically generated — no middleware, no cookie sniffing.
 *
 * This dictionary holds interface chrome only. Everything a marketer edits
 * (page copy, posts, plans, FAQs) is content and comes from `content.ts` /
 * `pages.ts`, which is where Sanity's document-level translation will plug in.
 */

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

/** BCP-47 tags for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = {
  zh: "zh-Hant",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Next types route params as plain strings. `dynamicParams = false` already
 * guarantees only real locales reach a page, so this narrows without a cast.
 */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** Prefixes a locale-less path: `path("en", "/product")` → `/en/product`. */
export function path(locale: Locale, to = "/"): string {
  return to === "/" ? `/${locale}` : `/${locale}${to}`;
}

const dictionaries = {
  zh: {
    nav: { home: "首頁", product: "產品", blog: "部落格", contact: "聯絡我們" },
    breadcrumb: {
      home: "首頁",
      product: "產品 / 服務",
      blog: "部落格",
      contact: "聯絡我們",
    },
    footer: {
      sitemap: "網站地圖",
      contact: "聯絡資訊",
      legal: "法律",
      privacy: "隱私權政策",
      terms: "服務條款",
    },
    blog: {
      eyebrow: "Blog",
      title: "部落格",
      lede: "地端 AI 導入的實務觀點與案例分享",
      searchPlaceholder: "搜尋文章…",
      searchLabel: "搜尋文章",
      featured: "精選文章",
      noResults: (q: string) => `找不到符合「${q}」的文章。`,
      emptyCategory: "這個分類目前還沒有文章。",
      pagination: "分頁",
      toc: "目錄",
      copyLink: "複製連結",
      copied: "已複製連結",
      shareLinkedIn: "分享至 LinkedIn",
      related: "相關文章",
      category: "分類",
      author: "作者",
      postCount: (n: number) => `共 ${n} 篇文章`,
      allPosts: "← 查看所有文章",
    },
    contact: {
      title: "聯絡我們",
      lede: "讓我們一起評估，如何在你的環境中安全地導入 AI",
      name: "姓名",
      namePlaceholder: "您的姓名",
      email: "Email",
      emailPlaceholder: "you@company.com",
      message: "需求說明",
      messagePlaceholder: "請簡述您的場域與需求",
      submit: "送出",
      successTitle: "已收到您的訊息",
      successBody: "我們會在 1-2 個工作天內與您聯繫。",
      address: "地址",
    },
    notFound: {
      title: "找不到這個頁面",
      body: "您要找的頁面可能已經移動或不存在，請確認網址，或回到首頁重新開始。",
      cta: "返回首頁",
    },
    localeSwitcher: { label: "切換語言" },
  },

  en: {
    nav: { home: "Home", product: "Product", blog: "Blog", contact: "Contact" },
    breadcrumb: {
      home: "Home",
      product: "Product",
      blog: "Blog",
      contact: "Contact",
    },
    footer: {
      sitemap: "Sitemap",
      contact: "Contact",
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms of service",
    },
    blog: {
      eyebrow: "Blog",
      title: "Blog",
      lede: "Field notes and case studies on deploying AI on-premise",
      searchPlaceholder: "Search articles…",
      searchLabel: "Search articles",
      featured: "Featured",
      noResults: (q: string) => `No articles match “${q}”.`,
      emptyCategory: "No articles in this category yet.",
      pagination: "Pagination",
      toc: "Contents",
      copyLink: "Copy link",
      copied: "Link copied",
      shareLinkedIn: "Share on LinkedIn",
      related: "Related articles",
      category: "Category",
      author: "Author",
      postCount: (n: number) => `${n} article${n === 1 ? "" : "s"}`,
      allPosts: "← All articles",
    },
    contact: {
      title: "Contact us",
      lede: "Let's work out how to bring AI into your environment safely",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.com",
      message: "What do you need?",
      messagePlaceholder: "Tell us about your environment and requirements",
      submit: "Send",
      successTitle: "Message received",
      successBody: "We'll be in touch within 1–2 business days.",
      address: "Address",
    },
    notFound: {
      title: "Page not found",
      body: "The page you're looking for may have moved or no longer exists. Check the URL, or head back to the homepage.",
      cta: "Back to home",
    },
    localeSwitcher: { label: "Switch language" },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type NavItem = { key: string; label: string; href: string };

/** Main navigation, already locale-prefixed. */
export function getNav(locale: Locale): NavItem[] {
  const { nav } = dictionaries[locale];
  return [
    { key: "home", label: nav.home, href: path(locale) },
    { key: "product", label: nav.product, href: path(locale, "/product") },
    { key: "blog", label: nav.blog, href: path(locale, "/blog") },
    { key: "contact", label: nav.contact, href: path(locale, "/contact") },
  ];
}
