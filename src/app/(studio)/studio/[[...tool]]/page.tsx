import Studio from "./Studio";
import { isSanityConfigured, projectId } from "@/lib/sanity";

// The Studio is a client-side app; nothing here should be prerendered per-path.
export const dynamic = "force-static";

export default function StudioPage() {
  // Mounting the Studio without a project id throws an opaque runtime error, so
  // say what is missing instead (plan.md Phase 0).
  if (!isSanityConfigured) {
    return (
      <main
        style={{
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          maxWidth: 560,
          margin: "0 auto",
          padding: "80px 24px",
          lineHeight: 1.7,
          color: "#2c2c2c",
        }}
      >
        <h1 style={{ fontSize: 24, margin: "0 0 12px" }}>
          Studio is not configured yet
        </h1>
        <p style={{ margin: "0 0 16px", color: "#484747" }}>
          Set these in <code>.env.local</code> (and in Vercel), then restart the
          dev server:
        </p>
        <pre
          style={{
            background: "#f3f2ea",
            border: "1px solid #d4d2cb",
            borderRadius: 8,
            padding: 16,
            fontSize: 13,
            overflowX: "auto",
          }}
        >
{`NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-editor-token`}
        </pre>
        <p style={{ margin: "16px 0 0", color: "#757575", fontSize: 14 }}>
          Current value: <code>{String(projectId)}</code>. Until it is set the
          public site renders its built-in seed content.
        </p>
      </main>
    );
  }

  return <Studio />;
}
