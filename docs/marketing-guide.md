# Dobby AI Website — Editor's Guide

For the marketing team. No technical knowledge needed, and nothing you can click will break the site.

---

## Before you start

**Editor:** https://dobbyai.co/studio

Sign in with your Google account. If it says you don't have access, ask the site administrator to add you to the project.

The editor is called **Sanity Studio**. Content types are listed on the left, the document you're editing is in the middle. What you change here goes live on the website once you publish it.

---

## The three rules that matter

### 1. Chinese and English are separate documents

The site is bilingual. **Every kind of content exists twice** in the editor, each tagged with its language:

```
Home page
 ├── Home page (zh)   ← editing this changes only the Chinese site
 └── Home page (en)   ← the English site is a different document
```

**Editing one does not touch the other.** This is the thing people forget most often.

Every document has a **Language** field at the top, set to either `zh` or `en`. It decides which site the document appears on. **Never change it on a document that already exists** — see the last section for why.

### 2. Nothing is live until you press Publish

While you edit, a **Publish** button sits in the bottom right.

- Haven't pressed it → your changes are a draft, **the website is unchanged**
- Pressed it → live

Drafts are safe. Edit slowly, leave halfway through, come back tomorrow — the public site stays exactly as it was.

### 3. Give it about a minute

The site updates roughly a minute after you publish.

Not seeing your change straight away is normal — **wait a moment and refresh**. If it's still missing after three minutes, open the page in a private window; you're probably looking at your own browser's cache.

---

## What you can edit

| In the editor | On the website |
|---|---|
| **Home page** | dobbyai.co landing page |
| **Product page** | the Product / Services page |
| **Post** | each blog article |
| **Category** | the blog's category labels |
| **Site settings** | footer details, default share image, redirects |

Navigation labels, page layout and button placement are **not** in the editor — those need an engineer. The editor owns the words and the pictures.

---

## Getting started: your first blog post

The blog is currently empty. The first time through, follow this order — **step 1 cannot be skipped**.

### Step 1 — Create a category first

A post has to belong to a category, so the category must already exist.

Click **Category** on the left, then **+** to create one:

| Field | What to put |
|---|---|
| **Language** | `zh` or `en` |
| **Category name** | e.g. "Product news" |
| **Slug** | press **Generate**, or type lowercase English yourself (e.g. `product-news`) |
| **Category description** | a sentence or two, shown at the top of the category page |
| **Accent colour** | leave empty to use the default brand colour |
| **Order** | a number. Lower sorts first: 1, 2, 3 |

Press **Publish**.

Then **create it a second time** for the other language: same steps, with the other **Language** value and a translated **Category name**.

> **Use the same Slug in both languages** (`product-news` in each). That's what lets a reader switch language and stay on the same category instead of being sent back to the home page.

### Step 2 — Write the post

Click **Post** on the left, then **+**:

| Field | Notes |
|---|---|
| **Language** | `zh` or `en` |
| **Title** | the headline |
| **Slug** | press **Generate**. A Chinese title can produce an unreadable slug — type lowercase English with hyphens instead, e.g. `why-on-premise-ai` |
| **Excerpt** | two or three sentences. Used on the article card and as the Google search description |
| **Categories** | **Add item**, then pick the category you just made. More than one is fine |
| **Published at** | the article list sorts by this, **newest first** |
| **Read time** | typed in by hand, e.g. "5 min read" |
| **Main image** | the banner at the top of the article (sizes below) |
| **Body** | the article itself |
| **SEO** | safe to leave empty, see below |

Press **Publish**.

### Step 3 — Keep the slugs matching

The Chinese and English versions of the same article need **the same value in Slug**:

```
Chinese   Language zh   Slug  why-on-premise-ai
English   Language en   Slug  why-on-premise-ai   ← identical
```

That's what makes the language switcher land on the translation instead of the home page.

Writing only one language is fine — the article simply won't exist on the other site. Nothing breaks.

---

## Using the body editor

| Format | Use it for |
|---|---|
| **Normal text** | ordinary paragraphs |
| **Subheading H2** | section headings |
| **Subheading H3** | sub-sections |
| **Quote** | pull quotes |
| Bulleted / Numbered | lists |
| **Bold**, *Italic*, `Code` | select the text, then use the toolbar |
| Link | select text → link icon → paste the URL |
| Image | click **+** to insert; a caption is optional |

### H2 headings become the table of contents

The contents list beside an article is **generated from your H2 headings**. You never maintain it by hand.

Which means: to put a section in the contents, make it an H2. To keep it out, use H3 or bold instead.

---

## Editing the home page

Fields are ordered the way the page is, top to bottom.

**Hero — the large block at the top**

| Field | Where it lands |
|---|---|
| Hero · Eyebrow | the small line above the headline |
| Hero · Heading line 1 | first line of the big headline |
| Hero · Heading line 2 | second line |
| Hero · Highlight | follows line 2, **shown in the brand orange** |
| Hero · Intro | the paragraph under the headline |

**Dark band**

Heading, Body and Image. Leaving the image empty falls back to the built-in one.

**Selling points**

A **Selling points · Heading**, then a list of points, each with its own Heading and Body. **Add item** to add one; drag to reorder.

**CTA — the closing call to action**

Eyebrow, Heading, Body and Primary button. **CTA · Secondary links** has a **Goes to** dropdown limited to Product, Blog and Contact — that restriction exists so a link can't point at a page that doesn't exist.

---

## Editing the product page

Also in page order:

- **Hero** — Heading and Intro
- **Overview** — Heading plus a product screenshot
- **Features** — each has an **Icon**, **Heading** and **Body**. Icon is a dropdown (Upload / Lock / Edit / Dual chat / Document); you can only pick from it
- **Plans** — each has a Plan name, Subtitle, One-line summary, and an **Included** list
- **FAQ** — question-and-answer pairs, add or remove freely
- **Closing** — Heading and Button label

---

## Image sizes

Check the size before uploading, or the image will look blurry or get cropped.

| Where it's used | Upload at | Cropped? |
|---|---|---|
| **Main image** — on a Post | 2400 × 560 | **Cropped to a banner** — keep the subject centred |
| **Images inside an article** | 1360 wide or more | No, aspect ratio preserved |
| **Dark band · Image** — Home page | 2288 wide or more | No |
| **Overview · Screenshot** — Product page | 2728 × 1532 (16:9) | No |
| **Social share image** — SEO section | 1200 × 630 | No |

These are twice the display width so the image stays sharp on high-resolution screens.

**Always fill in Alt text.** Every image field has one. Describe what the image shows — screen readers rely on it, and Google reads it too.

---

## The SEO section

Every content type has an **SEO** block at the bottom. **All of it can be left empty** — the page title and excerpt are used automatically, and that is usually the right answer.

When you do want to override:

| Field | Notes |
|---|---|
| **Meta title** | the headline in Google results. 60 characters or fewer |
| **Meta description** | the description underneath. 160 characters or fewer |
| **Canonical URL** | **leave empty** unless this article is also published on another site |
| **Social share image** | what LinkedIn and Facebook show, 1200 × 630 |
| **Hide from search engines** | keeps the page out of Google. **Normally leave this off** |

---

## Where enquiries go

Contact form submissions are **emailed to sales@dobbyai.co only**. They are not stored in the editor and you won't find them there.

That's deliberate: the content database becomes publicly readable once the current plan expires, and customer names, addresses and enquiries have no business sitting somewhere public.

**So manage enquiries from the inbox.** It is the only list — replying, tagging and assigning all happen there.

If a customer says the form won't submit, tell the site administrator: that means the mail service is failing. The form shows an error with the email address when that happens, so the customer can write in instead.

---

## Site settings

Footer details and site-wide defaults. **One document per language**, like everything else.

Site name, Tagline, Site description, Contact email, Address (one line per entry), LinkedIn, Default share image.

**Post byline** is the author name shared by every article — the blog has no separate author records, so all posts carry the same name.

**Empty fields fall back to sensible defaults**, so you don't have to fill it all in at once. Set only what you want to change.

### Redirects

Also under Site settings. Use these when **a URL has changed but old links are still out there** — links people shared, old Google results, a short URL printed on a business card.

Click **Add item** and fill in two fields:

| Field | What to put |
|---|---|
| **Old URL** | the path being retired, e.g. `/pricing` |
| **New URL** | where it should go, e.g. `/product` |

**The language prefix is optional — both of these are valid:**

```
/pricing        → /product      applies to both sites, each staying in its own language
/zh/pricing     → /zh/product   Chinese site only
```

Capitalisation and trailing slashes are ignored, so `/Pricing/` and `/pricing` are the same entry.

New URL can also be a full external address (`https://…`) — a partner's page, for instance.

**Two things stop you breaking anything here.** A redirect is only consulted once no real page has matched, so even if you typed `/product` (a page that exists), the real page always wins. And like everything else it goes live a minute after publishing, with no engineering involved.

---

## Working across two languages

Whoever writes the Chinese, two things need to stay in step.

**Slugs must match** between a document and its translation. Everything else can differ freely — headline, images, even length.

**Established translations should stay consistent.** Some product terms are already settled on this site; check an existing page before inventing a new rendering of one.

If only one language gets updated, the other simply keeps showing what it had. It does not go blank and nothing breaks — the two sites are independent.

---

## When something looks wrong

**I published but the site hasn't changed**
Check you actually pressed **Publish** (bottom right). If you did, wait a minute and try a private window.

**My post isn't in the list**
Three things to check: the Language field, whether it is published, and whether **Hide from search engines** got switched on in the SEO section — those posts are left out of listings.

**Switching language sends me to the home page**
The two documents have different **Slug** values. Make them identical.

**I can't find my category when editing a post**
Categories must be published before a post can reference them. Check whether it is still a draft.

**I deleted something by mistake**
Sanity keeps history. Open the document → the three dots in the top right → **Review changes** — you can see every edit and roll back. If that does not recover it, ask engineering.

---

## Please don't

**Vision** — the tab at the top left is a database query tool for engineers. Clicking it breaks nothing, but there is nothing there for you.

**The Language field on an existing document** — do not switch a `zh` document to `en`. That removes it from the Chinese site and creates a duplicate on the English one. To make a translation, **create a new document** instead.

---

## Quick reference

| I want to | Go to |
|---|---|
| Change the home page headline | Home page → Hero · Heading line 1 |
| Swap the home page image | Home page → Dark band · Image |
| Add a product feature | Product page → Features → Add item |
| Edit a plan | Product page → Plans |
| Add an FAQ | Product page → FAQ → Add item |
| Publish an article | Category (first) → Post |
| Change the footer address | Site settings → Address |
| Point an old URL at a new page | Site settings → Redirects |
| Read customer enquiries | the support@dobbyai.co inbox, not the editor |

---

**Three things to remember: the two languages are edited separately, nothing is live until you press Publish, and it takes about a minute.** Everything else is safe to explore — drafts never touch the public site.
