/**
 * Outline icon set in the Dobby house style — ~1.5px stroke, rounded caps and
 * joins, `currentColor` so glyphs inherit text colour.
 *
 * Drawn here rather than shipping the design project's SVG files so they can be
 * recoloured and sized from CSS. The readme sanctions substituting equivalent
 * outline glyphs; shapes follow the same language as the brand set.
 */

const PATHS = {
  arrowRight: <path d="M4 12h16M14 6l6 6-6 6" />,
  check: <path d="M4.5 12.5 9 17 19.5 6.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M4.75 20a7.25 7.25 0 0 1 14.5 0" />
    </>
  ),
  chat: (
    <path d="M20 13.5a3 3 0 0 1-3 3H9l-4.5 3.5v-3.5H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z" />
  ),
  dualChat: (
    <>
      <path d="M16.5 12.5a2.5 2.5 0 0 1-2.5 2.5H8l-3.5 2.75V15a2.5 2.5 0 0 1-1-2.5v-5A2.5 2.5 0 0 1 6 5h8a2.5 2.5 0 0 1 2.5 2.5z" />
      <path d="M8 18.5a2.5 2.5 0 0 0 2.5 2.5h1" />
      <path d="M19.5 8.5A2.5 2.5 0 0 1 22 11v5" />
    </>
  ),
  upload: (
    <>
      <path d="M6.5 17.5A3.5 3.5 0 0 1 6 10.6a5.5 5.5 0 0 1 10.7-1.3A4 4 0 0 1 18 17.3" />
      <path d="M12 20v-8M9 14.5 12 11.5l3 3" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l10-10a2.6 2.6 0 0 0-4-4L4 16z" />
      <path d="m14.5 7.5 2 2" />
    </>
  ),
  fileText: (
    <>
      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13.5 3.5V9H19M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  closeCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9.5 9.5 5 5M14.5 9.5l-5 5" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
      <path d="M8 10.5V7.75a4 4 0 0 1 8 0v2.75" />
      <circle cx="12" cy="15.25" r="1.15" />
    </>
  ),
  chevronRight: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  chevronDown: <path d="m5.5 9.5 6.5 6.5 6.5-6.5" />,
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({
  name,
  size = 20,
  className,
  strokeWidth = 1.5,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
