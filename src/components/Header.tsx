"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import type { NavItem } from "@/lib/content";

export default function Header({
  nav,
  active,
}: {
  nav: NavItem[];
  active?: string;
}) {
  const [scrolled, setScrolled] = useState(false);

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
          <Link href="/" aria-label="Dobby AI 首頁" className="flex items-center">
            <Logo
              variant={scrolled ? "mark" : "wordmark"}
              className={scrolled ? "h-[22px]" : "h-[26px]"}
              priority
            />
          </Link>

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
        </div>
      </header>
      <div className="h-[72px]" />
    </>
  );
}
