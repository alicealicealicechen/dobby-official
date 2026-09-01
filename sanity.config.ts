import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineLocations, presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./src/lib/sanity.env";

/**
 * Studio config for the embedded editor at /studio.
 *
 * `projectId` falls back to a placeholder so the module can be imported (and
 * the route type-checked and built) before Phase 0 sets the env vars. The page
 * itself refuses to mount the Studio until a real id is present — see
 * `isSanityConfigured`.
 */

/**
 * Which page each document appears on, so Presentation can open the right URL
 * and the editor is told where a document is used.
 *
 * Documents are per language, so the locale comes off the document rather than
 * from a hardcoded prefix — otherwise editing the English home page would open
 * a preview of the Chinese one.
 */
const locations = {
  homePage: defineLocations({
    select: { language: "language" },
    resolve: (doc) => ({
      locations: [{ title: "Home page", href: `/${doc?.language ?? "zh"}` }],
    }),
  }),
  productPage: defineLocations({
    select: { language: "language" },
    resolve: (doc) => ({
      locations: [
        { title: "Product page", href: `/${doc?.language ?? "zh"}/product` },
      ],
    }),
  }),
  post: defineLocations({
    select: { language: "language", slug: "slug.current", title: "title" },
    resolve: (doc) =>
      doc?.slug
        ? {
            locations: [
              {
                title: doc.title ?? "Post",
                href: `/${doc.language ?? "zh"}/blog/${doc.slug}`,
              },
              { title: "Blog index", href: `/${doc.language ?? "zh"}/blog` },
            ],
          }
        : { locations: [] },
  }),
  "blog-category": defineLocations({
    select: { language: "language", slug: "slug.current", title: "title" },
    resolve: (doc) =>
      doc?.slug
        ? {
            locations: [
              {
                title: doc.title ?? "Category",
                href: `/${doc.language ?? "zh"}/blog/category/${doc.slug}`,
              },
            ],
          }
        : { locations: [] },
  }),
};

export default defineConfig({
  name: "dobby",
  title: "Dobby AI",
  basePath: "/studio",
  projectId: projectId ?? "missing-project-id",
  dataset,
  apiVersion,
  schema: { types: schemaTypes },
  plugins: [
    presentationTool({
      // Same origin as the Studio, so the site loads in the preview iframe
      // under the `frame-ancestors 'self'` policy set in next.config.
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
      resolve: { locations },
    }),
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
