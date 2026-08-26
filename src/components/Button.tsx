import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline";
type Size = "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // The system darkens the fill on hover — it never scales on press.
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-50",
  outline:
    "border-[1.5px] border-line-2 text-ink hover:border-primary hover:text-primary",
};

const SIZES: Record<Size, string> = {
  md: "h-12 px-7 text-[15px]",
  lg: "h-[52px] px-6 text-[16px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 ease-standard";

export default function Button({
  children,
  href,
  variant = "primary",
  size = "lg",
  type = "button",
  external,
  className = "",
  iconRight,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit";
  external?: boolean;
  className?: string;
  iconRight?: ReactNode;
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const body = (
    <>
      {children}
      {iconRight}
    </>
  );

  if (!href) {
    return (
      <button type={type} className={classes}>
        {body}
      </button>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {body}
    </Link>
  );
}
