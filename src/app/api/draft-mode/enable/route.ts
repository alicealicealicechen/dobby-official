import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { previewClient } from "@/lib/sanity";

/**
 * Turns on draft mode so the site renders unpublished edits.
 *
 * Only reachable with a secret that Presentation mints in the dataset and the
 * helper verifies against it, so the cookie cannot be set by guessing a URL —
 * without that check this endpoint would publish every draft to anyone who
 * found it.
 *
 * Presentation calls this itself when an editor opens the preview pane; the
 * URL is not something anyone types.
 */
export const { GET } = defineEnableDraftMode({ client: previewClient });
