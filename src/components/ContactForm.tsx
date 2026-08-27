"use client";

import { useState } from "react";
import Icon from "./Icon";
import type { Locale } from "@/lib/i18n";

const FIELD =
  "w-full rounded-lg border-[1.5px] border-line-2 px-3.5 text-[14.5px] text-ink transition-colors duration-150 ease-standard placeholder:text-muted focus:border-primary focus:outline-none";

export type ContactLabels = {
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  /** Contains {email} — the address to fall back to when delivery fails. */
  errorBody: string;
};

export default function ContactForm({
  t,
  locale,
  fallbackEmail,
}: {
  t: ContactLabels;
  locale: Locale;
  fallbackEmail: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"), // honeypot
          locale,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
    } catch {
      // Deliberately leaves the fields filled — nobody should have to retype
      // their enquiry, and they can copy it into an email instead.
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-card p-8 text-center sm:p-12">
        <Icon
          name="check"
          size={32}
          strokeWidth={2}
          className="mx-auto mb-4 text-primary"
        />
        <p className="m-0 mb-2 text-[19px] font-bold text-ink">
          {t.successTitle}
        </p>
        <p className="m-0 text-[14.5px] text-secondary">{t.successBody}</p>
      </div>
    );
  }

  const sending = state === "sending";
  const [errorBefore, errorAfter] = t.errorBody.split("{email}");

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-[18px] rounded-2xl border border-line bg-card p-6 sm:p-8"
    >
      {state === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-line-2 bg-subtle px-4 py-3"
        >
          <p className="m-0 mb-1 text-[14px] font-semibold text-ink">
            {t.errorTitle}
          </p>
          <p className="m-0 text-[13.5px] leading-[1.7] text-secondary">
            {errorBefore}
            <a href={`mailto:${fallbackEmail}`} className="underline">
              {fallbackEmail}
            </a>
            {errorAfter}
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-[13.5px] font-semibold text-ink"
        >
          {t.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          maxLength={100}
          placeholder={t.namePlaceholder}
          className={`${FIELD} h-11`}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-[13.5px] font-semibold text-ink"
        >
          {t.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={200}
          placeholder={t.emailPlaceholder}
          className={`${FIELD} h-11`}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-[13.5px] font-semibold text-ink"
        >
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder={t.messagePlaceholder}
          className={`${FIELD} resize-y py-3`}
        />
      </div>

      {/* Honeypot: positioned off-screen rather than display:none, which some
          bots detect. People never see or tab to it; bots fill it in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="h-12 cursor-pointer rounded-lg bg-primary text-[15px] font-semibold text-on-primary transition-colors duration-150 ease-standard hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
      >
        {sending ? t.sending : t.submit}
      </button>
    </form>
  );
}
