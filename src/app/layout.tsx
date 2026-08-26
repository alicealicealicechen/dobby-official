import type { Metadata } from "next";
import { Inter, Noto_Sans_TC, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/content";

// Self-hosted through next/font so there is no layout shift and no runtime
// call to a font CDN (plan.md §3.6).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

// CJK families are far too large to preload — the browser fetches it lazily
// and falls back to the system Chinese face until it lands.
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  weight: ["400", "500", "700"],
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    openGraph: {
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      locale: "zh_TW",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${inter.variable} ${notoSansTC.variable} ${robotoMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
