import type { Json } from "@/lib/schemas";

/** Renders a schema object from lib/schemas.ts as the script tag Google expects. */
export default function JsonLd({ schema }: { schema: Json }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
