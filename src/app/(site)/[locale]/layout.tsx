import type { Metadata } from "next";
import { Inter, Noto_Sans_TC, Roboto_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";
import {
  getDictionary,
  getNav,
  htmlLang,
  locales,
  toLocale,
} from "@/lib/i18n";

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

/** Only zh and en exist; anything else 404s instead of rendering. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const site = await getSiteSettings(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [htmlLang[l], `/${l}`]),
      ),
    },
    openGraph: {
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      locale: locale === "zh" ? "zh_TW" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const t = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]}>
      <body
        className={`${inter.variable} ${notoSansTC.variable} ${robotoMono.variable}`}
      >
        {/* Chrome lives here so every route — including not-found, which never
            receives params — renders in the right language. */}
        <Header
          nav={getNav(locale)}
          locale={locale}
          switcherLabel={t.localeSwitcher.label}
        />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
