# Company Website

Official marketing website built with **Next.js**, content managed via **Sanity**, deployed on **Vercel**.

## Architecture

```
Marketer → Sanity Studio → Sanity (content DB)
                              │ webhook on publish
                              ▼
Engineer → GitHub → Vercel build (Next.js pulls content from Sanity)
                              │
                              ▼
                    Global CDN → yoursite.com
```

- **Content updates**: Marketers publish in Sanity Studio → webhook triggers a Vercel rebuild automatically (~1–3 min to live). No engineer involvement.
- **Code updates**: Engineers push to GitHub → Vercel builds and deploys. PRs get automatic preview URLs.
- **Rendering**: SSG + ISR (`revalidate: 60`) for all content pages. No client-side-only rendering — SEO-critical.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| CMS | Sanity (headless) |
| Hosting | Vercel |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Analytics | GA4 via Google Tag Manager |

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm/yarn)
- Access to the Sanity project (ask a team admin)
- Access to the Vercel project (for env vars / deploys)

### Local Development

```bash
# 1. Clone and install
git clone <repo-url>
cd website
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in values (see Environment Variables below)

# 3. Run the dev server
npm run dev
```

Site runs at `http://localhost:3000`.
Sanity Studio runs at `http://localhost:3000/studio`.

### Environment Variables

| Variable | Description | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Sanity dashboard → project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` or `staging` | — |
| `SANITY_API_TOKEN` | Editor token — reads content from the private dataset and stores contact submissions | Sanity dashboard → API → Tokens |

All variables must also be set in Vercel → Project Settings → Environment
Variables, for **both** Production and Preview.

> ⚠️ **Both datasets are private.** An unauthenticated GROQ query against a
> private dataset returns an empty result set rather than an error — which is
> indistinguishable from "the CMS has no content". Every page then silently
> serves its built-in fallback: no crash, no error, just stale-looking content.
>
> So `SANITY_API_TOKEN` is not optional here. Either set it everywhere, or
> make the dataset public — reasonable for a marketing site, and one less
> variable to forget:
>
> ```bash
> npx sanity dataset visibility set production public
> ```

## Project Structure

```
├── app/
│   ├── (site)/[locale]/     # Public site — locale is zh or en
│   │   ├── product/
│   │   ├── contact/
│   │   ├── blog/
│   │   │   ├── [slug]/          # Blog posts
│   │   │   └── category/[slug]/ # Category pages
│   │   └── [...rest]/       # Catch-all → localised 404
│   ├── (studio)/studio/     # Embedded Sanity Studio
│   ├── sitemap.ts           # Both locales, from the same accessors as pages
│   └── robots.ts            # Blocks non-production envs and /studio
├── components/              # React components
├── lib/
│   ├── sanity.ts            # Sanity client (sends the read token)
│   ├── queries.ts           # GROQ, all filtered by `language`
│   ├── content.ts           # Site settings, posts, categories
│   ├── pages.ts             # Home and product page copy
│   ├── i18n.ts              # Locales + interface strings (not CMS content)
│   └── schemas.ts           # JSON-LD generators
├── sanity/
│   └── schemaTypes/         # Content models (homePage, productPage, post…)
├── scripts/seed.mjs         # One-off: pushes lib/pages.ts copy into a dataset
└── src/assets/              # Logo and imagery imported by next/image

Two route groups means two root layouts, so `/studio` sits outside the
`[locale]` tree and has no language prefix. Route groups do not affect URLs.
```

## Languages

The site is bilingual. Locale is the first URL segment — `/zh` and `/en` — so
every page stays statically generated with no middleware. `/` redirects to
`/zh`.

Two different things live in two different places:

| | Where | Who edits |
|---|---|---|
| Page copy, posts, plans, FAQs | Sanity | Marketing |
| Nav labels, buttons, form labels, 404 text | `lib/i18n.ts` | Engineering |

Interface strings stay in code because they are tied to routing and layout.

Translation is document-level: each post/page exists once per language with a
`language` field, and **every query filters on it**. A document with an empty
`language` is invisible to the site — this is the most common reason new content
"doesn't show up".

## Content Editing (for Marketers)

1. Log in at `/studio` (or `yourcompany.sanity.studio`)
2. Create or edit a page/post — fill in content **and the SEO fields** (meta title, description, OG image)
3. Click **Preview** to see the draft on the real site
4. Click **Publish** — the site rebuilds automatically and goes live in ~1–3 minutes

> **Save** = draft only (not live). **Publish** = triggers deployment.
> If content doesn't appear after publishing, wait 60s (ISR cache) before escalating.

## Going Live

`production` starts empty. **Do not run `scripts/seed.mjs` against it** — that
script reads the original hardcoded copy from `lib/pages.ts` and would overwrite
whatever marketing has since edited. It was a one-off migration and its job is
done.

Move the real content across instead, which brings image assets with it:

```bash
npx sanity dataset export staging staging.tar.gz
npx sanity dataset import staging.tar.gz production
```

Then point Vercel at it: `NEXT_PUBLIC_SANITY_DATASET=production`.

Verify by editing one word in the Studio, waiting 60s, and reloading. Seeing
content on the page is not proof — the fallback looks identical.

## Deployment

| Trigger | Result |
|---|---|
| Push to `main` | Production deploy |
| Open a PR | Preview deploy with unique URL |
| Publish in Sanity | Production rebuild via deploy hook |

Rollback: Vercel dashboard → Deployments → ⋯ → **Promote to Production** on any previous build.

## SEO Checklist (when adding a new page type)

- [ ] `generateMetadata()` reads from the Sanity `seo` object
- [ ] Add the route to `app/sitemap.ts`
- [ ] Add JSON-LD schema if applicable (`lib/schemas.ts`)
- [ ] Verify with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Check Lighthouse: Performance ≥ 90, SEO = 100

## Useful Commands

```bash
npm run dev          # Local dev server
npm run build        # Production build (catches Sanity query errors)
npm run lint         # ESLint
npx sanity deploy    # Deploy Sanity Studio (if hosted separately)
```

## Troubleshooting

**Published content not showing** — in order of likelihood:
1. The document has no `language` value (`zh` or `en`). Every query filters on
   it, so the document is invisible.
2. It is still a draft. Save stores a draft; only Publish goes live.
3. `SANITY_API_TOKEN` is missing in that environment — see the warning
   under Environment Variables. Symptom: the whole site quietly shows fallback
   content.
4. ISR cache; wait up to 60s, or check the deploy hook fired.

**Build fails with Sanity errors** — usually a GROQ query referencing a renamed field. Check the schema in `sanity/schemaTypes/` matches your queries.

**Preview not working** — verify `SANITY_API_TOKEN` is set in both `.env.local` and Vercel.

## Links

- [Production site](https://yoursite.com)
- [Sanity Studio](https://yoursite.com/studio)
- [Vercel dashboard](https://vercel.com)
- [Implementation plan](./docs/website-implementation-plan.md)