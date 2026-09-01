import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Inter, Noto_Sans_TC, Roboto_Mono } from "next/font/google";
import "../../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";
import { notFound } from "next/navigation";
import {
  getDictionary,
  getNav,
  htmlLang,
  isLocale,
  locales,
  toLocale,
  type Locale,
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

/**
 * Only zh and en exist, and this is where that is enforced.
 *
 * It used to be `dynamicParams = false`, which reads like it constrains the
 * locale segment but is route segment config: it cascades to every dynamic
 * segment underneath. Blog posts and categories inherited it, so any slug that
 * did not exist at build time returned 404 for good — a post published in the
 * Studio was unreachable until the next deploy, and ISR could not help because
 * the param had never been generated. An explicit check does the same job to
 * this segment only, and leaves nested routes free to render on demand.
 */
function assertKnownLocale(value: string): asserts value is Locale {
  if (!isLocale(value)) notFound();
}

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
  assertKnownLocale(rawLocale);
  const locale = rawLocale;
  const t = getDictionary(locale);
  const previewing = (await draftMode()).isEnabled;

  return (
    <html lang={htmlLang[locale]}>
      {/* A column that fills the viewport, so the footer sits at the bottom of
          a short page instead of floating halfway up it. */}
      <body
        className={`flex min-h-screen flex-col ${inter.variable} ${notoSansTC.variable} ${robotoMono.variable}`}
      >
        {/* Chrome lives here so every route — including not-found, which never
            receives params — renders in the right language. */}
        <Header
          nav={getNav(locale)}
          locale={locale}
          switcherLabel={t.localeSwitcher.label}
        />
        <div className="flex-1">{children}</div>
        <Footer locale={locale} />

        {previewing && (
          <>
            {/* The draft cookie outlives the tab it was set in, which is how an
                editor ends up reading unpublished copy hours later and reporting
                it as a bug on the live site. The way out is always on screen. */}
            <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-3 bg-primary px-4 py-2 text-[13px] font-semibold text-on-primary">
              <span>Previewing unpublished changes</span>
              <a
                href={`/api/draft-mode/disable?to=/${locale}`}
                className="rounded border border-white/40 px-2 py-0.5 underline-offset-2 hover:bg-white/15"
              >
                Exit preview
              </a>
            </div>
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
