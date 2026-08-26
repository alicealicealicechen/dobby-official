"use client";

import { useState } from "react";
import Icon from "./Icon";

const FIELD =
  "w-full rounded-lg border-[1.5px] border-line-2 px-3.5 text-[14.5px] text-ink transition-colors duration-150 ease-standard placeholder:text-muted focus:border-primary focus:outline-none";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-card p-12 text-center">
        <Icon
          name="check"
          size={32}
          strokeWidth={2}
          className="mx-auto mb-4 text-primary"
        />
        <p className="m-0 mb-2 text-[19px] font-bold text-ink">
          已收到您的訊息
        </p>
        <p className="m-0 text-[14.5px] text-secondary">
          我們會在 1-2 個工作天內與您聯繫。
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
      className="flex flex-col gap-[18px] rounded-2xl border border-line bg-card p-8"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-[13.5px] font-semibold text-ink"
        >
          姓名
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="您的姓名"
          className={`${FIELD} h-11`}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-[13.5px] font-semibold text-ink"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={`${FIELD} h-11`}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-[13.5px] font-semibold text-ink"
        >
          需求說明
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="請簡述您的場域與需求"
          className={`${FIELD} resize-y py-3`}
        />
      </div>

      <button
        type="submit"
        className="h-12 cursor-pointer rounded-lg bg-primary text-[15px] font-semibold text-on-primary transition-colors duration-150 ease-standard hover:bg-primary-hover"
      >
        送出
      </button>
    </form>
  );
}
