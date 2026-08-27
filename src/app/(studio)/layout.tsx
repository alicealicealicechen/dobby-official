/**
 * Second root layout, for the Studio only.
 *
 * Route groups let /studio sit outside the [locale] tree, so the editor has no
 * language prefix. It deliberately does not import globals.css — the Studio
 * ships its own styling and our Tailwind reset fights it.
 */
export const metadata = {
  title: "Dobby AI Studio",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
