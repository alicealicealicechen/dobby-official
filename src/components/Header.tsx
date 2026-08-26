"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import type { Locale, NavItem } from "@/lib/i18n";

export default function Header({
  nav,
  locale,
  switcherLabel,
}: {
  nav: NavItem[];
  locale: Locale;
  switcherLabel: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Derived rather than passed: the layout renders one Header for every route,
  // so each page would otherwise have to declare which nav item it is.
  const rest = pathname.replace(/^\/[^/]+/, "") || "/";
  const active =
    rest === "/"
      ? "home"
      : (nav.find((item) => {
          // Home's path is empty once the locale is stripped, and every route
          // startsWith("") — so it only ever matches the exact root above.
          const itemPath = item.href.replace(/^\/[^/]+/, "");
          return itemPath !== "" && rest.startsWith(itemPath);
        })?.key ?? "");

  // Past 24px the wordmark collapses to the bare mark, per the design.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/[0.86] backdrop-blur-[10px]">
        <div className="flex flex-wrap items-center justify-between gap-6 px-6 py-4 md:px-10">
          <Link href={nav[0].href} aria-label="Dobby AI" className="flex items-center">
            <Logo
              variant={scrolled ? "mark" : "wordmark"}
              className={scrolled ? "h-[22px]" : "h-[26px]"}
              priority
            />
          </Link>

          <div className="flex items-center gap-5 sm:gap-9">
            <nav className="flex flex-wrap items-center gap-5 sm:gap-7">
              {nav.map((item) => {
                const isActive = item.key === active;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-[14.5px] transition-colors duration-150 ease-standard ${
                      isActive
                        ? "font-bold text-ink"
                        : "font-medium text-secondary hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <LocaleSwitcher locale={locale} label={switcherLabel} />
          </div>
        </div>
      </header>
      <div className="h-[72px]" />
    </>
  );
}
