/**
 * Sanity content models — the counterpart to the GROQ projections in
 * `lib/queries.ts`. Field names here and there must stay in step; a rename on
 * one side is the usual cause of a build-time query error.
 *
 * Written as plain objects so the marketing site can ship before the Studio is
 * installed. Once `sanity` is a dependency (plan Phase 1), wrap each export in
 * `defineType`/`defineField` for editor-side type inference — the shapes below
 * are already what those helpers expect.
 *
 * Phase 1 is a workshop with marketing, not a solo call: treat this as the
 * starting draft for that meeting rather than the final model.
 *
 * Two rules the Studio enforces at load time: every object type needs at least
 * one field, and an object nested in an array needs its own unique name.
 * Reusable blocks are therefore registered as named top-level types rather
 * than declared inline.
 */

const language = {
  name: "language",
  type: "string",
  title: "語言",
  description: "zh 或 en。文件級翻譯:每個語言各一份文件,共用 slug。",
  options: { list: ["zh", "en"] },
  validation: (Rule: { required: () => unknown }) => Rule.required(),
};

export const seo = {
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      type: "string",
      title: "Meta title",
      description: "建議 60 字元以內;留白則自動用頁面標題。",
      validation: (Rule: { max: (n: number) => unknown }) => Rule.max(60),
    },
    {
      name: "metaDescription",
      type: "text",
      rows: 3,
      title: "Meta description",
      description: "建議 160 字元以內。",
      validation: (Rule: { max: (n: number) => unknown }) => Rule.max(160),
    },
    { name: "canonicalUrl", type: "url", title: "Canonical URL" },
    {
      name: "ogImage",
      type: "image",
      title: "社群分享圖",
      description: "1200×630。留白則使用全站預設圖。",
    },
    { name: "noIndex", type: "boolean", title: "禁止索引", initialValue: false },
  ],
};

/** One heading plus its paragraphs — drives both the article body and its TOC. */
export const postSection = {
  name: "postSection",
  title: "章節",
  type: "object",
  fields: [
    { name: "heading", type: "string", title: "小標" },
    {
      name: "paragraphs",
      type: "array",
      of: [{ type: "text" }],
      title: "段落",
    },
  ],
  preview: { select: { title: "heading" } },
};

/**
 * A composable marketing block; `variant` picks the layout that renders it.
 * The real block list comes out of the Phase 1 workshop — this is a draft.
 */
export const pageSection = {
  name: "pageSection",
  title: "頁面區塊",
  type: "object",
  fields: [
    {
      name: "variant",
      type: "string",
      title: "區塊型式",
      options: {
        list: [
          { title: "主視覺 Hero", value: "hero" },
          { title: "深色橫幅 Band", value: "band" },
          { title: "編號清單 Points", value: "points" },
          { title: "方案 Plans", value: "plans" },
          { title: "常見問題 FAQ", value: "faq" },
          { title: "行動呼籲 CTA", value: "cta" },
        ],
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    { name: "eyebrow", type: "string", title: "小標" },
    { name: "heading", type: "string", title: "標題" },
    { name: "body", type: "text", rows: 3, title: "說明" },
    { name: "image", type: "image", title: "圖片" },
  ],
  preview: { select: { title: "heading", subtitle: "variant" } },
};

export const redirect = {
  name: "redirect",
  title: "轉址",
  type: "object",
  fields: [
    { name: "from", type: "string", title: "來源路徑" },
    { name: "to", type: "string", title: "目標路徑" },
  ],
  preview: { select: { title: "from", subtitle: "to" } },
};

export const category = {
  name: "category",
  title: "分類",
  type: "document",
  fields: [
    language,
    { name: "title", type: "string", title: "分類名稱" },
    { name: "slug", type: "slug", title: "網址", options: { source: "title" } },
    { name: "description", type: "text", rows: 2, title: "分類描述" },
    {
      name: "color",
      type: "string",
      title: "代表色",
      description: "文章卡片色帶用。CSS 色值或 var(--orange-600) 這類 token。",
    },
    { name: "order", type: "number", title: "排序" },
  ],
  preview: { select: { title: "title", subtitle: "language" } },
};

export const author = {
  name: "author",
  title: "作者",
  type: "document",
  fields: [
    language,
    { name: "name", type: "string", title: "姓名" },
    { name: "slug", type: "slug", title: "網址", options: { source: "name" } },
    { name: "avatar", type: "image", title: "頭像" },
    { name: "bio", type: "text", rows: 3, title: "簡介" },
  ],
  preview: { select: { title: "name", subtitle: "language" } },
};

export const post = {
  name: "post",
  title: "文章",
  type: "document",
  fields: [
    language,
    { name: "title", type: "string", title: "標題" },
    { name: "slug", type: "slug", title: "網址", options: { source: "title" } },
    { name: "excerpt", type: "text", rows: 2, title: "摘要" },
    {
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      title: "作者",
    },
    {
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      title: "分類",
    },
    { name: "publishedAt", type: "datetime", title: "發佈時間" },
    { name: "readTime", type: "string", title: "閱讀時間" },
    {
      name: "mainImage",
      type: "image",
      title: "主圖",
      fields: [{ name: "alt", type: "string", title: "替代文字" }],
    },
    {
      name: "body",
      type: "array",
      title: "內文",
      of: [{ type: "postSection" }],
    },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: { select: { title: "title", subtitle: "language" } },
};

export const page = {
  name: "page",
  title: "頁面",
  type: "document",
  fields: [
    language,
    { name: "title", type: "string", title: "頁面名稱" },
    { name: "slug", type: "slug", title: "網址", options: { source: "title" } },
    {
      name: "sections",
      type: "array",
      title: "頁面區塊",
      of: [{ type: "pageSection" }],
    },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: { select: { title: "title", subtitle: "language" } },
};

export const siteSettings = {
  name: "siteSettings",
  title: "全站設定",
  type: "document",
  fields: [
    language,
    { name: "siteName", type: "string", title: "網站名稱" },
    { name: "tagline", type: "string", title: "標語" },
    { name: "description", type: "text", rows: 3, title: "網站描述" },
    { name: "url", type: "url", title: "正式網址" },
    { name: "email", type: "string", title: "聯絡信箱" },
    {
      name: "address",
      type: "array",
      of: [{ type: "string" }],
      title: "地址(每行一筆)",
    },
    { name: "linkedin", type: "url", title: "LinkedIn" },
    { name: "defaultOgImage", type: "image", title: "預設分享圖" },
    // Nav labels and legal links are interface chrome, not editorial content —
    // they live in lib/i18n.ts so marketing cannot break routing.
    {
      name: "redirects",
      type: "array",
      title: "301 轉址",
      of: [{ type: "redirect" }],
    },
  ],
  preview: { select: { title: "siteName", subtitle: "language" } },
};

export const schemaTypes = [
  // Objects first — the documents below reference them by name.
  seo,
  postSection,
  pageSection,
  redirect,
  category,
  author,
  post,
  page,
  siteSettings,
];
