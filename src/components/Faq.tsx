"use client";

import { useState } from "react";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.q}
            className="overflow-hidden rounded-xl border border-line bg-card"
          >
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                aria-controls={`faq-${i}`}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-[22px] py-[18px] text-left"
              >
                <span className="text-[15px] font-semibold text-ink">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-[18px] leading-none text-primary"
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`faq-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-standard ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden" inert={!open}>
                <p className="m-0 px-[22px] pb-5 text-sm leading-[1.8] text-secondary">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
