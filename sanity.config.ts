import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { apiVersion, dataset, projectId } from "./src/lib/sanity";

/**
 * Studio config for the embedded editor at /studio.
 *
 * `projectId` falls back to a placeholder so the module can be imported (and
 * the route type-checked and built) before Phase 0 sets the env vars. The page
 * itself refuses to mount the Studio until a real id is present — see
 * `isSanityConfigured`.
 */
export default defineConfig({
  name: "dobby",
  title: "Dobby AI",
  basePath: "/studio",
  projectId: projectId ?? "missing-project-id",
  dataset,
  apiVersion,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
