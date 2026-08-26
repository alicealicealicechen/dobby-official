"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = { zh: "中", en: "EN" };

/**
 * Swaps the locale segment of the current path so the reader stays on the page
 * they were reading rather than being bounced to the homepage.
 */
export default function LocaleSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      {locales.map((target) => {
        const isCurrent = target === locale;
        const href = pathname.replace(/^\/[^/]+/, `/${target}`);

        return (
          <Link
            key={target}
            href={href}
            hrefLang={target}
            aria-current={isCurrent ? "true" : undefined}
            className={`rounded-lg px-2.5 py-1 text-[13.5px] font-semibold transition-colors duration-150 ease-standard ${
              isCurrent
                ? "bg-subtle text-ink"
                : "text-secondary hover:text-primary"
            }`}
          >
            {LABELS[target]}
          </Link>
        );
      })}
    </div>
  );
}
