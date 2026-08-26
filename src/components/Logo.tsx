import Image from "next/image";
import wordmark from "@/assets/DOBBY_logo_en_no_chinese.png";
import mark from "@/assets/DOBBY_logo_mark_only.png";

export default function Logo({
  variant = "wordmark",
  className = "",
  invert = false,
  priority = false,
}: {
  variant?: "wordmark" | "mark";
  className?: string;
  /** Knock the artwork out to white for the dark footer. */
  invert?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "mark" ? mark : wordmark}
      alt="Dobby AI"
      priority={priority}
      className={`w-auto ${invert ? "brightness-0 invert opacity-90" : ""} ${className}`}
    />
  );
}
