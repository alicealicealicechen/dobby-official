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
 */

export const seo = {
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      type: "string",
      title: "Meta title",
      description: "建議 60 字元以內；留白則自動用頁面標題。",
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

export const category = {
  name: "category",
  title: "分類",
  type: "document",
  fields: [
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
};

export const author = {
  name: "author",
  title: "作者",
  type: "document",
  fields: [
    { name: "name", type: "string", title: "姓名" },
    { name: "slug", type: "slug", title: "網址", options: { source: "name" } },
    { name: "avatar", type: "image", title: "頭像" },
    { name: "bio", type: "text", rows: 3, title: "簡介" },
  ],
};

export const post = {
  name: "post",
  title: "文章",
  type: "document",
  fields: [
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
      of: [
        {
          type: "object",
          name: "section",
          title: "章節",
          fields: [
            { name: "heading", type: "string", title: "小標" },
            {
              name: "paragraphs",
              type: "array",
              of: [{ type: "text" }],
              title: "段落",
            },
          ],
        },
      ],
    },
    { name: "seo", type: "seo", title: "SEO" },
  ],
};

export const page = {
  name: "page",
  title: "頁面",
  type: "document",
  fields: [
    { name: "title", type: "string", title: "頁面名稱" },
    { name: "slug", type: "slug", title: "網址", options: { source: "title" } },
    {
      name: "sections",
      type: "array",
      title: "頁面區塊",
      description: "可組合的區塊：hero、band、points、plans、faq、cta。",
      of: [{ type: "object", name: "section", fields: [] }],
    },
    { name: "seo", type: "seo", title: "SEO" },
  ],
};

export const siteSettings = {
  name: "siteSettings",
  title: "全站設定",
  type: "document",
  fields: [
    { name: "siteName", type: "string", title: "網站名稱" },
    { name: "tagline", type: "string", title: "標語" },
    { name: "description", type: "text", rows: 3, title: "網站描述" },
    { name: "url", type: "url", title: "正式網址" },
    { name: "email", type: "string", title: "聯絡信箱" },
    {
      name: "address",
      type: "array",
      of: [{ type: "string" }],
      title: "地址（每行一筆）",
    },
    { name: "linkedin", type: "url", title: "LinkedIn" },
    { name: "defaultOgImage", type: "image", title: "預設分享圖" },
    {
      name: "nav",
      type: "array",
      title: "主導覽",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", type: "string", title: "識別碼" },
            { name: "label", type: "string", title: "顯示文字" },
            { name: "href", type: "string", title: "連結" },
          ],
        },
      ],
    },
    {
      name: "footerLegal",
      type: "array",
      title: "頁尾法律連結",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "顯示文字" },
            { name: "href", type: "string", title: "連結" },
          ],
        },
      ],
    },
    {
      name: "redirects",
      type: "array",
      title: "301 轉址",
      of: [
        {
          type: "object",
          fields: [
            { name: "from", type: "string", title: "來源路徑" },
            { name: "to", type: "string", title: "目標路徑" },
          ],
        },
      ],
    },
  ],
};

export const schemaTypes = [
  seo,
  category,
  author,
  post,
  page,
  siteSettings,
];
