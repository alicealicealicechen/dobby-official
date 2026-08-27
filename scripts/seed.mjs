/**
 * One-off content seed: pushes the copy in src/lib/pages.ts into Sanity so the
 * Studio opens with the current site already in it, rather than making someone
 * retype it.
 *
 * Documents use fixed _ids (homePage-zh, productPage-en, …) so re-running
 * overwrites rather than duplicating. Images are uploaded once and reused by
 * asset id.
 *
 *   node scripts/seed.mjs            # dry run, prints what it would write
 *   node scripts/seed.mjs --write    # actually writes
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Minimal .env.local reader — this script runs outside Next.
const env = Object.fromEntries(
  readFileSync(resolve(root, ".env.local"), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [k, ...rest] = l.split("=");
      return [k.trim(), rest.join("=").trim().replace(/^["']|["']$/g, "")];
    }),
);

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_TOKEN;
const write = process.argv.includes("--write");

if (!projectId || !dataset || !token) {
  console.error("Missing projectId / dataset / token in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const { HOME, PRODUCT } = await import(resolve(root, "scripts/.content.mjs"));

async function uploadImage(path, alt) {
  const asset = await client.assets.upload("image", readFileSync(resolve(root, path)), {
    filename: path.split("/").pop(),
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt };
}

const keyed = (items) =>
  items.map((item, i) => ({ ...item, _key: `k${i}` }));

const docs = [];
for (const locale of ["zh", "en"]) {
  const h = HOME[locale];
  const p = PRODUCT[locale];
  docs.push({
    _id: `homePage-${locale}`,
    _type: "homePage",
    language: locale,
    heroEyebrow: h.hero.eyebrow,
    heroTitleLead: h.hero.titleLead,
    heroTitleRest: h.hero.titleRest,
    heroHighlight: h.hero.highlight,
    heroLede: h.hero.lede,
    bandTitle: h.band.title,
    bandBody: h.band.body,
    pointsTitle: h.pointsTitle,
    points: keyed(h.points.map(({ title, body }) => ({ _type: "homePoint", title, body }))),
    ctaEyebrow: h.cta.eyebrow,
    ctaTitle: h.cta.title,
    ctaLede: h.cta.lede,
    ctaPrimary: h.cta.primary,
    ctaSecondary: keyed(h.cta.secondary.map((l) => ({ _type: "ctaLink", ...l }))),
    __image: { field: "bandImage", path: "src/assets/home_page.jpg", alt: h.band.imageAlt },
  });
  docs.push({
    _id: `productPage-${locale}`,
    _type: "productPage",
    language: locale,
    heroTitle: p.hero.title,
    heroLede: p.hero.lede,
    overviewTitle: p.overview.title,
    features: keyed(p.overview.features.map((f) => ({ _type: "productFeature", ...f }))),
    plansTitle: p.plansTitle,
    plans: keyed(p.plans.map((pl) => ({ _type: "productPlan", ...pl }))),
    faqTitle: p.faqTitle,
    faqs: keyed(p.faqs.map((f) => ({ _type: "faqItem", ...f }))),
    closingTitle: p.closing.title,
    closingCta: p.closing.cta,
    __image: { field: "overviewImage", path: "src/assets/product_screenshot.png", alt: p.overview.imageAlt },
  });
}

if (!write) {
  console.log(`DRY RUN — ${dataset} would receive ${docs.length} documents:`);
  for (const d of docs) console.log(`  ${d._id.padEnd(18)} ${d._type}`);
  console.log("\nRe-run with --write to apply.");
  process.exit(0);
}

// Upload each distinct image once, then reuse the asset across locales.
const cache = new Map();
const tx = client.transaction();
for (const doc of docs) {
  const { __image, ...rest } = doc;
  if (__image) {
    if (!cache.has(__image.path)) {
      process.stdout.write(`uploading ${__image.path} … `);
      cache.set(__image.path, await uploadImage(__image.path, __image.alt));
      console.log("done");
    }
    rest[__image.field] = { ...cache.get(__image.path), alt: __image.alt };
  }
  tx.createOrReplace(rest);
}
await tx.commit();
console.log(`\nWrote ${docs.length} documents to "${dataset}".`);
