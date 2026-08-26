import Link from "next/link";
import Icon from "./Icon";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";

export type Crumb = { label: string; href?: string };

/**
 * Renders the trail plus the BreadcrumbList JSON-LD that plan.md §3.5 asks for,
 * so the two can never drift apart.
 */
export default function Breadcrumb({
  items,
  baseUrl,
}: {
  items: Crumb[];
  baseUrl: string;
}) {
  return (
    <nav aria-label="breadcrumb" className="mx-auto max-w-[1200px] px-6 sm:px-8 pt-5">
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="inline-flex min-h-6 items-center text-[13.5px] font-semibold text-secondary"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex min-h-6 items-center text-[13.5px] text-muted hover:text-primary"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && (
                <Icon name="chevronRight" size={12} className="text-muted opacity-60" />
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd schema={breadcrumbSchema(items, baseUrl)} />
    </nav>
  );
}
