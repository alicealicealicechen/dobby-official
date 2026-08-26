"use client";

import { useState } from "react";

export default function ShareActions() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard is unavailable (insecure origin, or permission denied) —
      // leave the label alone rather than claiming a copy that didn't happen.
    }
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const style =
    "h-10 cursor-pointer rounded-lg border-[1.5px] border-line-2 bg-card px-[18px] text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-standard hover:border-primary hover:text-primary";

  return (
    <div className="mt-10 flex gap-3 border-t border-line pt-6">
      <button type="button" onClick={copy} className={style}>
        {copied ? "已複製連結" : "複製連結"}
      </button>
      <button type="button" onClick={shareLinkedIn} className={style}>
        分享至 LinkedIn
      </button>
    </div>
  );
}
