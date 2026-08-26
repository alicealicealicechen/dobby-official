"use client";

import { useState } from "react";
import Icon from "./Icon";

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
  successTitle: string;
  successBody: string;
};

export default function ContactForm({ t }: { t: ContactLabels }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
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
        <p className="m-0 text-[14.5px] text-secondary">
          {t.successBody}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // No submission endpoint exists yet — see the note in the handover.
        setSubmitted(true);
      }}
      className="flex flex-col gap-[18px] rounded-2xl border border-line bg-card p-6 sm:p-8"
    >
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
          placeholder={t.messagePlaceholder}
          className={`${FIELD} resize-y py-3`}
        />
      </div>

      <button
        type="submit"
        className="h-12 cursor-pointer rounded-lg bg-primary text-[15px] font-semibold text-on-primary transition-colors duration-150 ease-standard hover:bg-primary-hover"
      >
        {t.submit}
      </button>
    </form>
  );
}
