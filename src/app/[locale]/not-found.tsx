"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";
import { defaultLocale, getDictionary, isLocale, path } from "@/lib/i18n";

/**
 * Client-side because Next never passes `params` to not-found — the locale is
 * read back off the path instead. The surrounding chrome still comes from
 * [locale]/layout.tsx, so header and footer are already in the right language.
 */
export default function NotFound() {
  const pathname = usePathname();
  const segment = pathname.split("/")[1] ?? "";
  const locale = isLocale(segment) ? segment : defaultLocale;
  const t = getDictionary(locale).notFound;

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 sm:px-8 py-20 text-center">
      <p
        aria-hidden
        className="m-0 text-[clamp(4rem,10vw,7rem)] leading-none font-extrabold tracking-[-0.03em] text-sage-200"
      >
        404
      </p>
      <Icon
        name="closeCircle"
        size={36}
        className="my-3 text-muted opacity-50"
      />
      <h1 className="m-0 mb-3 text-[clamp(1.5rem,3vw,2rem)] font-bold text-ink">
        {t.title}
      </h1>
      <p className="m-0 mb-8 max-w-[420px] text-[15px] leading-[1.7] text-secondary">
        {t.body}
      </p>
      <Link
        href={path(locale)}
        className="inline-flex h-12 items-center rounded-lg bg-primary px-7 text-[15px] font-semibold text-on-primary transition-colors duration-150 ease-standard hover:bg-primary-hover"
      >
        {t.cta}
      </Link>
    </main>
  );
}
