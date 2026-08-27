import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

/** Heading blocks double as anchors, so the table of contents can link to them. */
export function headingId(block: PortableTextBlock): string {
  return `s-${block._key}`;
}

/** The h2s that make up a post's table of contents. */
export function tableOfContents(body: PortableTextBlock[]) {
  return body
    .filter((block) => block._type === "block" && block.style === "h2")
    .map((block) => ({
      id: headingId(block),
      text: (block.children ?? [])
        .map((child) => ("text" in child ? String(child.text) : ""))
        .join(""),
    }))
    .filter((entry) => entry.text.trim().length > 0);
}

const components: PortableTextComponents = {
  block: {
    h2: ({ value, children }) => (
      <h2
        id={headingId(value)}
        className="m-0 mt-10 mb-4 scroll-mt-24 text-[22px] font-bold text-ink first:mt-0"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="m-0 mt-8 mb-3 text-[18px] font-bold text-ink">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-2 border-primary py-1 pl-5 text-secondary italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mt-0 mb-7">{children}</p>,
  },

  list: {
    bullet: ({ children }) => (
      <ul className="mt-0 mb-7 list-disc pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-0 mb-7 list-decimal pl-6">{children}</ol>
    ),
  },
  listItem: ({ children }) => <li className="mb-2">{children}</li>,

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="rounded border border-line bg-subtle px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = String(value?.href ?? "");
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="underline underline-offset-4"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.url) return null;
      return (
        <figure className="my-8">
          <Image
            src={value.url}
            alt={value.alt ?? ""}
            width={680}
            height={420}
            sizes="(max-width: 768px) 100vw, 680px"
            className="h-auto w-full rounded-xl border border-line"
          />
          {value.caption && (
            <figcaption className="mt-2 text-[13px] text-muted">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function PostBody({ body }: { body: PortableTextBlock[] }) {
  return (
    <div className="max-w-[680px] text-[16px] leading-[1.9] text-ink-2">
      <PortableText value={body} components={components} />
    </div>
  );
}
