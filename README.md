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
| `SANITY_API_READ_TOKEN` | Token for draft preview | Sanity dashboard → API → Tokens |

All variables must also be set in Vercel → Project Settings → Environment Variables.

## Project Structure

```
├── app/
│   ├── [slug]/              # Generic CMS-driven pages
│   ├── blog/
│   │   ├── [slug]/          # Blog posts
│   │   └── category/[slug]/ # Category pages
│   ├── studio/              # Embedded Sanity Studio
│   ├── api/draft/           # Draft mode for content preview
│   ├── sitemap.ts           # Auto-generated sitemap from Sanity
│   └── robots.ts            # Blocks preview envs, allows production
├── components/              # React components
├── lib/
│   ├── sanity.ts            # Sanity client
│   └── schemas.ts           # JSON-LD schema generators
├── sanity/
│   └── schemaTypes/         # Sanity content models (page, post, blog-category, seo…)
└── public/                  # Static assets
```

## Content Editing (for Marketers)

1. Log in at `/studio` (or `yourcompany.sanity.studio`)
2. Create or edit a page/post — fill in content **and the SEO fields** (meta title, description, OG image)
3. Click **Preview** to see the draft on the real site
4. Click **Publish** — the site rebuilds automatically and goes live in ~1–3 minutes

> **Save** = draft only (not live). **Publish** = triggers deployment.
> If content doesn't appear after publishing, wait 60s (ISR cache) before escalating.

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

**Published content not showing** — ISR cache; wait up to 60s, or check the Vercel deploy hook fired (Vercel → Deployments).

**Build fails with Sanity errors** — usually a GROQ query referencing a renamed field. Check the schema in `sanity/schemaTypes/` matches your queries.

**Preview not working** — verify `SANITY_API_READ_TOKEN` is set in both `.env.local` and Vercel.

## Links

- [Production site](https://yoursite.com)
- [Sanity Studio](https://yoursite.com/studio)
- [Vercel dashboard](https://vercel.com)
- [Implementation plan](./docs/website-implementation-plan.md)