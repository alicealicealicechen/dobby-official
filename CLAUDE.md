# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Marketing site for Dobby AI (dobbyai.co): Next.js 16 App Router + React 19, Sanity CMS (Studio embedded at `/studio`), Tailwind v4, deployed on Vercel. Node version in `.nvmrc` (20).

## Commands

```bash
npm run dev     # http://localhost:3000, Studio at /studio
npm run build   # production build; also catches GROQ/type errors
npm run lint    # ESLint
```

There is no test suite. Verify changes with `npm run build` and by loading the page in both locales.

Pushing to `main` deploys production on Vercel. Commit locally; push only when asked.

## Architecture

All code lives under `src/` (the README's structure tree omits the `src/` prefix).

**Locale routing.** Locale is the first URL segment (`/zh`, `/en`; `zh` is default, `htmlLang` maps it to `zh-Hant`). No middleware: `src/app/(site)/[locale]/` is statically generated per locale. Unprefixed paths are redirected by an explicit list in `next.config.ts`; do not replace it with a catch-all redirect (it swallowed Next's dev endpoints and broke HMR). The Studio is a separate route group `(studio)` with its own root layout.

**Two sources of text.**
- Interface chrome (nav, buttons, form labels, 404) → dictionaries in `src/lib/i18n.ts`, edited by engineering.
- Marketing content (page copy, posts, plans, FAQs) → Sanity, with built-in fallbacks in `src/lib/content.ts` (site settings, posts, categories) and `src/lib/pages.ts` (home and product copy).

**Data flow.** Pages call accessors in `content.ts`/`pages.ts` → `sanityFetch()` in `src/lib/sanity.ts` → GROQ in `src/lib/queries.ts`. Key behaviours:
- `sanityFetch` returns `null` when Sanity is unconfigured or a query fails, and the accessor serves the fallback. The site always renders, so **content appearing on the page is not proof Sanity is connected**; a private dataset queried without `SANITY_API_TOKEN` returns empty results and looks identical.
- Merge CMS data onto fallbacks with `overlay()`, never a plain spread. GROQ returns `null` for blank fields and a spread would let those nulls win.
- Translation is document-level: every document has a `language` field and every query filters on it. New queries must too.
- Caching: pages set `revalidate = 60`; `sanityFetch` takes cache `tags` (Sanity document types). A Sanity webhook hits `src/app/api/revalidate/route.ts`, which purges the tag for the published `_type` (`KNOWN_TAGS` there must list any new type the site renders).
- Draft preview: Sanity's Presentation tool enables Next draft mode via `/api/draft-mode/enable`; `sanityFetch` then uses the uncached `draftClient`.
- `src/lib/sanity.env.ts` holds only the connection constants, because `sanity.config.ts` ships to the browser and cannot import `sanity.ts` (which reads `next/headers`).

**Schemas.** All Sanity content models are in `src/sanity/schemaTypes/index.ts`. The TypeScript types in `content.ts` mirror them by hand; renaming a field means updating schema, query, and type together.

**Contact form.** `src/app/api/contact/route.ts` verifies Cloudflare Turnstile (fails closed in production without `TURNSTILE_SECRET_KEY`) and sends via Resend. Email is the only sink; submissions are no longer stored in Sanity.

**SEO.** Pages implement `generateMetadata()` from the Sanity `seo` object; new routes also need adding to `src/app/sitemap.ts` and, where applicable, JSON-LD in `src/lib/schemas.ts`. `robots.ts` blocks non-production environments and `/studio`.

## Gotchas

- Do **not** run `scripts/seed.mjs` against `production`. It was a one-off migration and would overwrite marketing's edits. Move content between datasets with `npx sanity dataset export`/`import`.
- README drift: it mentions Framer Motion (not installed) and a Vercel deploy hook on publish (actually the tag-based `/api/revalidate` webhook).
- Chinese copy: "workspace" is 工作空間, never 工作區.
- `docs/marketing-guide.md` is the editor-facing guide for the marketing team; keep it accurate when changing Studio behaviour. `plan.md` is the (Chinese) implementation plan with phase checklists.
- Env vars are documented in `.env.example`; they must be set in Vercel for both Production and Preview.
