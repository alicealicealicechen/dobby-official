"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile widget.
 *
 * Rendered explicitly rather than by the script's auto-scan, because React
 * owns this DOM node and the auto-scan can double-render it across hydration.
 * The token lands in a hidden input named `cf-turnstile-response`, which the
 * form reads on submit.
 *
 * Renders nothing when no site key is configured, so local development works
 * without Cloudflare credentials. The server still refuses unverified
 * submissions in production — see app/api/contact.
 */
export default function Turnstile({
  siteKey,
  locale,
  resetSignal,
}: {
  siteKey?: string;
  locale: string;
  /** Change this to force a fresh token — they are single-use. */
  resetSignal?: number;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !holder.current || widgetId.current) return;

    const render = () => {
      if (!window.turnstile || !holder.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(holder.current, {
        sitekey: siteKey,
        language: locale === "en" ? "en" : "zh-tw",
        theme: "light",
      });
    };

    render();
    // The script may still be loading on first mount.
    const timer = window.setInterval(() => {
      if (widgetId.current) return window.clearInterval(timer);
      render();
    }, 200);

    return () => window.clearInterval(timer);
  }, [siteKey, locale]);

  useEffect(() => {
    if (resetSignal && widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetSignal]);

  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
      />
      <div ref={holder} />
    </>
  );
}
