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
  title: "Language",
  description: "zh or en. Translation is document-level: one document per language, sharing a slug.",
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
      description: "60 characters or fewer. Falls back to the page title when empty.",
      validation: (Rule: { max: (n: number) => unknown }) => Rule.max(60),
    },
    {
      name: "metaDescription",
      type: "text",
      rows: 3,
      title: "Meta description",
      description: "160 characters or fewer.",
      validation: (Rule: { max: (n: number) => unknown }) => Rule.max(160),
    },
    { name: "canonicalUrl", type: "url", title: "Canonical URL" },
    {
      name: "ogImage",
      type: "image",
      title: "Social share image",
      description: "1200×630. Falls back to the site-wide default when empty.",
    },
    { name: "noIndex", type: "boolean", title: "Hide from search engines", initialValue: false },
  ],
};

/**
 * A retired URL and where it now goes. Read at request time by the locale
 * catch-all, so publishing one takes effect without a deploy — and because the
 * catch-all only runs after every real route has missed, an entry here can
 * never shadow a page that exists.
 */
export const redirect = {
  name: "redirect",
  title: "Redirect",
  type: "object",
  fields: [
    {
      name: "from",
      type: "string",
      title: "Old URL",
      description:
        "The path being retired, starting with /. The locale prefix is optional: /old-page covers both languages, /zh/old-page only Chinese.",
      validation: (Rule: { required: () => { regex: (r: RegExp, o: object) => unknown } }) =>
        Rule.required().regex(/^\//, { name: "Must start with /" }),
    },
    {
      name: "to",
      type: "string",
      title: "New URL",
      description:
        "A site path (/product — the locale is added for you) or a full external URL (https://…).",
      validation: (Rule: { required: () => { regex: (r: RegExp, o: object) => unknown } }) =>
        Rule.required().regex(/^(\/[^\/]|https?:\/\/)/, {
          name: "Must be a site path starting with / or an https:// URL",
        }),
    },
  ],
  preview: { select: { title: "from", subtitle: "to" } },
};

export const blogCategory = {
  name: "blog-category",
  title: "Category",
  type: "document",
  fields: [
    language,
    { name: "title", type: "string", title: "Category name" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "title" } },
    { name: "description", type: "text", rows: 2, title: "Category description" },
    {
      name: "color",
      type: "string",
      title: "Accent colour",
      description: "Stripe colour on post cards. A CSS colour, or a token such as var(--orange-600).",
    },
    { name: "order", type: "number", title: "Order" },
  ],
  preview: { select: { title: "title", subtitle: "language" } },
};

export const post = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    language,
    { name: "title", type: "string", title: "Title" },
    { name: "slug", type: "slug", title: "Slug", options: { source: "title" } },
    { name: "excerpt", type: "text", rows: 2, title: "Excerpt" },
    {
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blog-category" }] }],
      title: "Categories",
    },
    { name: "publishedAt", type: "datetime", title: "Published at" },
    { name: "readTime", type: "string", title: "Read time" },
    {
      name: "mainImage",
      type: "image",
      title: "Main image",
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    },
    {
      name: "body",
      type: "array",
      title: "Body",
      description:
        "H2 subheadings become the article table of contents automatically. Paragraphs, lists, bold, links, images and quotes are all available.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal text", value: "normal" },
            { title: "Subheading H2", value: "h2" },
            { title: "Subheading H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
        {
          type: "image",
          fields: [
            { name: "alt", type: "string", title: "Alt text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
    },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: { select: { title: "title", subtitle: "language" } },
};

/* ------------------------------------------------------------------
   Marketing page content.

   One type per page rather than a generic block builder: there are only two
   such pages and their layouts differ, so a shared block list would force
   every field to be vague. These mirror what each page actually renders,
   which makes the Studio form self-explanatory — marketing edits the words,
   engineering keeps the layout.

   A generic `page` type lived here once. It was removed because nothing
   rendered it — a document could be published and listed in the sitemap while
   every visit 404'd. Reinstate it together with its route, never before.
   ------------------------------------------------------------------ */

export const ctaLink = {
  name: "ctaLink",
  title: "Secondary link",
  type: "object",
  fields: [
    { name: "label", type: "string", title: "Label" },
    {
      name: "to",
      type: "string",
      title: "Goes to",
      description: "Site path, without the locale prefix.",
      options: {
        list: [
          { title: "Product", value: "/product" },
          { title: "Blog", value: "/blog" },
          { title: "Contact", value: "/contact" },
        ],
      },
    },
  ],
  preview: { select: { title: "label", subtitle: "to" } },
};

export const homePoint = {
  name: "homePoint",
  title: "Selling point",
  type: "object",
  fields: [
    { name: "title", type: "string", title: "Heading" },
    { name: "body", type: "text", rows: 2, title: "Body" },
  ],
  preview: { select: { title: "title", subtitle: "body" } },
};

export const productFeature = {
  name: "productFeature",
  title: "Feature",
  type: "object",
  fields: [
    {
      name: "icon",
      type: "string",
      title: "Icon",
      options: {
        list: [
          { title: "Upload", value: "upload" },
          { title: "Lock", value: "lock" },
          { title: "Edit", value: "edit" },
          { title: "Dual chat", value: "dualChat" },
          { title: "Document", value: "fileText" },
        ],
      },
    },
    { name: "title", type: "string", title: "Heading" },
    { name: "body", type: "text", rows: 2, title: "Body" },
  ],
  preview: { select: { title: "title", subtitle: "body" } },
};

export const productPlan = {
  name: "productPlan",
  title: "Plan",
  type: "object",
  fields: [
    { name: "name", type: "string", title: "Plan name" },
    { name: "subtitle", type: "string", title: "Subtitle" },
    { name: "description", type: "string", title: "One-line summary" },
    {
      name: "features",
      type: "array",
      of: [{ type: "string" }],
      title: "Included",
    },
  ],
  preview: { select: { title: "name", subtitle: "subtitle" } },
};

export const faqItem = {
  name: "faqItem",
  title: "Question and answer",
  type: "object",
  fields: [
    { name: "q", type: "string", title: "Question" },
    { name: "a", type: "text", rows: 4, title: "Answer" },
  ],
  preview: { select: { title: "q" } },
};

export const homePage = {
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    language,
    { name: "heroEyebrow", type: "string", title: "Hero · Eyebrow" },
    { name: "heroTitleLead", type: "string", title: "Hero · Heading line 1" },
    { name: "heroTitleRest", type: "string", title: "Hero · Heading line 2" },
    {
      name: "heroHighlight",
      type: "string",
      title: "Hero · Highlight",
      description: "Follows line 2, shown in the brand colour.",
    },
    { name: "heroLede", type: "text", rows: 3, title: "Hero · Intro" },
    { name: "bandTitle", type: "string", title: "Dark band · Heading" },
    { name: "bandBody", type: "text", rows: 4, title: "Dark band · Body" },
    {
      name: "bandImage",
      type: "image",
      title: "Dark band · Image",
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    },
    { name: "pointsTitle", type: "string", title: "Selling points · Heading" },
    {
      name: "points",
      type: "array",
      of: [{ type: "homePoint" }],
      title: "Selling point",
    },
    { name: "ctaEyebrow", type: "string", title: "CTA · Eyebrow" },
    { name: "ctaTitle", type: "string", title: "CTA · Heading" },
    { name: "ctaLede", type: "text", rows: 2, title: "CTA · Body" },
    { name: "ctaPrimary", type: "string", title: "CTA · Primary button" },
    {
      name: "ctaSecondary",
      type: "array",
      of: [{ type: "ctaLink" }],
      title: "CTA · Secondary links",
    },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: { select: { title: "heroTitleLead", subtitle: "language" } },
};

export const productPage = {
  name: "productPage",
  title: "Product page",
  type: "document",
  fields: [
    language,
    { name: "heroTitle", type: "string", title: "Hero · Heading" },
    { name: "heroLede", type: "text", rows: 3, title: "Hero · Intro" },
    { name: "overviewTitle", type: "string", title: "Overview · Heading" },
    {
      name: "overviewImage",
      type: "image",
      title: "Overview · Screenshot",
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    },
    {
      name: "features",
      type: "array",
      of: [{ type: "productFeature" }],
      title: "Features",
    },
    { name: "plansTitle", type: "string", title: "Plans · Heading" },
    { name: "plans", type: "array", of: [{ type: "productPlan" }], title: "Plans" },
    { name: "faqTitle", type: "string", title: "FAQ · Heading" },
    { name: "faqs", type: "array", of: [{ type: "faqItem" }], title: "Question and answer" },
    { name: "closingTitle", type: "string", title: "Closing · Heading" },
    { name: "closingCta", type: "string", title: "Closing · Button label" },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: { select: { title: "heroTitle", subtitle: "language" } },
};

export const siteSettings = {
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    language,
    { name: "siteName", type: "string", title: "Site name" },
    {
      name: "authorName",
      type: "string",
      title: "Post byline",
      description: "Byline shared by every post — the blog has no separate author type.",
    },
    { name: "tagline", type: "string", title: "Tagline" },
    { name: "description", type: "text", rows: 3, title: "Site description" },
    { name: "url", type: "url", title: "Production URL" },
    { name: "email", type: "string", title: "Contact email" },
    {
      name: "address",
      type: "array",
      of: [{ type: "string" }],
      title: "Address (one line per entry)",
    },
    { name: "linkedin", type: "url", title: "LinkedIn" },
    { name: "defaultOgImage", type: "image", title: "Default share image" },
    // Nav labels and legal links are interface chrome, not editorial content —
    // they live in lib/i18n.ts so marketing cannot break routing.
    {
      name: "redirects",
      type: "array",
      title: "Redirects",
      of: [{ type: "redirect" }],
    },
  ],
  preview: { select: { title: "siteName", subtitle: "language" } },
};

export const schemaTypes = [
  // Objects first — the documents below reference them by name.
  seo,
  redirect,
  ctaLink,
  homePoint,
  productFeature,
  productPlan,
  faqItem,
  blogCategory,
  post,
  homePage,
  productPage,
  siteSettings,
];
