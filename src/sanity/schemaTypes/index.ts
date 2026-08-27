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

export const blogCategory = {
  name: "blog-category",
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
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blog-category" }] }],
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
      description:
        "H2 小標會自動成為文章目錄。段落、清單、粗體、連結、圖片、引言皆可用。",
      of: [
        {
          type: "block",
          styles: [
            { title: "內文", value: "normal" },
            { title: "小標 H2", value: "h2" },
            { title: "小標 H3", value: "h3" },
            { title: "引言", value: "blockquote" },
          ],
          lists: [
            { title: "項目符號", value: "bullet" },
            { title: "編號", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "粗體", value: "strong" },
              { title: "斜體", value: "em" },
              { title: "程式碼", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "連結",
                fields: [{ name: "href", type: "url", title: "網址" }],
              },
            ],
          },
        },
        {
          type: "image",
          fields: [
            { name: "alt", type: "string", title: "替代文字" },
            { name: "caption", type: "string", title: "圖說" },
          ],
        },
      ],
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

/* ------------------------------------------------------------------
   Marketing page content.

   Deliberately not the composable `page` builder: there are only two such
   pages and their layouts differ, so a generic block list would force every
   field to be vague. These mirror what each page actually renders, which
   makes the Studio form self-explanatory — marketing edits the words,
   engineering keeps the layout.
   ------------------------------------------------------------------ */

export const ctaLink = {
  name: "ctaLink",
  title: "次要連結",
  type: "object",
  fields: [
    { name: "label", type: "string", title: "文字" },
    {
      name: "to",
      type: "string",
      title: "前往",
      description: "站內路徑,不含語系前綴。",
      options: {
        list: [
          { title: "產品", value: "/product" },
          { title: "部落格", value: "/blog" },
          { title: "聯絡我們", value: "/contact" },
        ],
      },
    },
  ],
  preview: { select: { title: "label", subtitle: "to" } },
};

export const homePoint = {
  name: "homePoint",
  title: "賣點",
  type: "object",
  fields: [
    { name: "title", type: "string", title: "標題" },
    { name: "body", type: "text", rows: 2, title: "說明" },
  ],
  preview: { select: { title: "title", subtitle: "body" } },
};

export const productFeature = {
  name: "productFeature",
  title: "功能",
  type: "object",
  fields: [
    {
      name: "icon",
      type: "string",
      title: "圖示",
      options: {
        list: [
          { title: "上傳", value: "upload" },
          { title: "鎖頭", value: "lock" },
          { title: "編輯", value: "edit" },
          { title: "雙對話", value: "dualChat" },
          { title: "文件", value: "fileText" },
        ],
      },
    },
    { name: "title", type: "string", title: "標題" },
    { name: "body", type: "text", rows: 2, title: "說明" },
  ],
  preview: { select: { title: "title", subtitle: "body" } },
};

export const productPlan = {
  name: "productPlan",
  title: "方案",
  type: "object",
  fields: [
    { name: "name", type: "string", title: "方案名稱" },
    { name: "subtitle", type: "string", title: "副標" },
    { name: "description", type: "string", title: "一句話說明" },
    {
      name: "features",
      type: "array",
      of: [{ type: "string" }],
      title: "包含項目",
    },
  ],
  preview: { select: { title: "name", subtitle: "subtitle" } },
};

export const faqItem = {
  name: "faqItem",
  title: "問答",
  type: "object",
  fields: [
    { name: "q", type: "string", title: "問題" },
    { name: "a", type: "text", rows: 4, title: "回答" },
  ],
  preview: { select: { title: "q" } },
};

export const homePage = {
  name: "homePage",
  title: "首頁",
  type: "document",
  fields: [
    language,
    { name: "heroEyebrow", type: "string", title: "主視覺 · 小標" },
    { name: "heroTitleLead", type: "string", title: "主視覺 · 標題第一行" },
    { name: "heroTitleRest", type: "string", title: "主視覺 · 標題第二行" },
    {
      name: "heroHighlight",
      type: "string",
      title: "主視覺 · 強調字",
      description: "接在第二行之後,以品牌色顯示。",
    },
    { name: "heroLede", type: "text", rows: 3, title: "主視覺 · 說明" },
    { name: "bandTitle", type: "string", title: "深色橫幅 · 標題" },
    { name: "bandBody", type: "text", rows: 4, title: "深色橫幅 · 說明" },
    {
      name: "bandImage",
      type: "image",
      title: "深色橫幅 · 圖片",
      fields: [{ name: "alt", type: "string", title: "替代文字" }],
    },
    { name: "pointsTitle", type: "string", title: "賣點區 · 標題" },
    {
      name: "points",
      type: "array",
      of: [{ type: "homePoint" }],
      title: "賣點",
    },
    { name: "ctaEyebrow", type: "string", title: "CTA · 小標" },
    { name: "ctaTitle", type: "string", title: "CTA · 標題" },
    { name: "ctaLede", type: "text", rows: 2, title: "CTA · 說明" },
    { name: "ctaPrimary", type: "string", title: "CTA · 主按鈕文字" },
    {
      name: "ctaSecondary",
      type: "array",
      of: [{ type: "ctaLink" }],
      title: "CTA · 次要連結",
    },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: { select: { title: "heroTitleLead", subtitle: "language" } },
};

export const productPage = {
  name: "productPage",
  title: "產品頁",
  type: "document",
  fields: [
    language,
    { name: "heroTitle", type: "string", title: "主視覺 · 標題" },
    { name: "heroLede", type: "text", rows: 3, title: "主視覺 · 說明" },
    { name: "overviewTitle", type: "string", title: "功能總覽 · 標題" },
    {
      name: "overviewImage",
      type: "image",
      title: "功能總覽 · 截圖",
      fields: [{ name: "alt", type: "string", title: "替代文字" }],
    },
    {
      name: "features",
      type: "array",
      of: [{ type: "productFeature" }],
      title: "功能",
    },
    { name: "plansTitle", type: "string", title: "方案區 · 標題" },
    { name: "plans", type: "array", of: [{ type: "productPlan" }], title: "方案" },
    { name: "faqTitle", type: "string", title: "常見問題 · 標題" },
    { name: "faqs", type: "array", of: [{ type: "faqItem" }], title: "問答" },
    { name: "closingTitle", type: "string", title: "結尾 · 標題" },
    { name: "closingCta", type: "string", title: "結尾 · 按鈕文字" },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: { select: { title: "heroTitle", subtitle: "language" } },
};

/**
 * A contact-form submission. Written by the public API route so an enquiry
 * survives even when the email provider is down — see app/api/contact.
 * Never edited by hand; `status` is the only field marketing changes.
 */
export const contactSubmission = {
  name: "contactSubmission",
  title: "聯絡表單訊息",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "姓名", readOnly: true },
    { name: "email", type: "string", title: "Email", readOnly: true },
    { name: "message", type: "text", rows: 6, title: "需求說明", readOnly: true },
    { name: "submittedAt", type: "datetime", title: "送出時間", readOnly: true },
    {
      name: "locale",
      type: "string",
      title: "來源語系",
      readOnly: true,
      options: { list: ["zh", "en"] },
    },
    {
      name: "status",
      type: "string",
      title: "處理狀態",
      initialValue: "new",
      options: {
        list: [
          { title: "未處理", value: "new" },
          { title: "已回覆", value: "replied" },
          { title: "已關閉", value: "closed" },
        ],
        layout: "radio",
      },
    },
    {
      name: "emailDelivered",
      type: "boolean",
      title: "通知信已寄出",
      readOnly: true,
      description: "false 代表寄信失敗,這筆只存在 Sanity,請主動聯繫。",
    },
  ],
  orderings: [
    {
      title: "最新的在前",
      name: "newestFirst",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "email", status: "status" },
    prepare: ({ title, subtitle, status }: Record<string, string>) => ({
      title: `${status === "new" ? "● " : ""}${title ?? "(無姓名)"}`,
      subtitle,
    }),
  },
};

export const siteSettings = {
  name: "siteSettings",
  title: "全站設定",
  type: "document",
  fields: [
    language,
    { name: "siteName", type: "string", title: "網站名稱" },
    {
      name: "authorName",
      type: "string",
      title: "文章署名",
      description: "所有文章共用的作者名稱(部落格沒有獨立作者型別)。",
    },
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
  pageSection,
  redirect,
  ctaLink,
  homePoint,
  productFeature,
  productPlan,
  faqItem,
  blogCategory,
  post,
  page,
  homePage,
  productPage,
  contactSubmission,
  siteSettings,
];
