import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import heroPhoto from "@/assets/home_page.jpg";
import { getSiteSettings } from "@/lib/content";
import { getHomeContent } from "@/lib/pages";
import { organizationSchema } from "@/lib/schemas";
import { path, toLocale } from "@/lib/i18n";

// SSG + ISR, so published CMS edits appear without a redeploy.
export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const [site, content] = await Promise.all([
    getSiteSettings(locale),
    getHomeContent(locale),
  ]);
  const { hero, band, points, cta } = content;

  return (
    <main>
      {/* HERO */}
      {/* Full-bleed so the glow clips to the viewport. When the max-width sat on
          the section itself, anything wider than 1520px showed the blob cut off
          against a hard vertical edge at the content column's boundary. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="hero-blob pointer-events-none absolute top-[10%] -right-[10%] z-0 h-[560px] w-[560px] rounded-full bg-orange-100 opacity-70 blur-[70px]"
        />
        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-[1520px] flex-col justify-center px-6 py-20 sm:px-8">
          <p className="mb-5 font-mono text-[12.5px] font-semibold tracking-[0.14em] text-primary sm:mb-7 sm:text-[16px]">
            {hero.eyebrow}
          </p>
          <h1 className="m-0 mb-8 text-[clamp(2.25rem,8vw,6.2rem)] leading-[1.02] sm:leading-[0.98] font-extrabold tracking-[-0.04em] text-ink">
            {hero.titleLead}
            <br />
            {hero.titleRest}
            <span className="text-primary">{hero.highlight}</span>
          </h1>
          <p className="m-0 max-w-[480px] text-[17px] leading-[1.65] text-secondary sm:text-[19px]">
            {hero.lede}
          </p>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="w-full bg-ink">
        <div className="mx-auto max-w-[1520px] px-6 py-[clamp(48px,7vw,72px)] sm:px-8 text-center">
          <h2 className="mb-5 text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-[-0.02em] text-white">
            {band.title}
          </h2>
          <p className="text-balance mx-auto mb-10 max-w-[480px] text-[15px] leading-[1.7] text-white">
            {band.body}
          </p>
          <Image
            src={heroPhoto}
            alt={band.imageAlt}
            sizes="(max-width: 768px) 100vw, 720px"
            placeholder="blur"
            className="mx-auto h-auto w-full max-w-[720px] rounded-[4px]"
          />
        </div>
      </section>

      {/* SELLING POINTS */}
      <section className="mx-auto max-w-[1520px] px-6 py-[clamp(64px,9vw,104px)] sm:px-8">
        <h2 className="m-0 mb-12 max-w-[640px] text-[clamp(1.75rem,3.2vw,2.4rem)] font-bold tracking-[-0.02em] text-ink">
          {content.pointsTitle}
        </h2>
        <ol className="m-0 list-none p-0">
          {points.map((point, i) => (
            <li
              key={point.title}
              className="flex items-baseline gap-4 border-b border-line py-6 last:border-b-0 sm:gap-8 sm:py-7"
            >
              <span
                aria-hidden
                className="w-12 shrink-0 text-[clamp(1.75rem,4vw,3rem)] font-light text-line sm:w-[100px]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-1 flex-wrap justify-between gap-2 sm:gap-6">
                <h3 className="m-0 text-[19px] font-bold text-ink sm:min-w-[220px] sm:text-[22px]">
                  {point.title}
                </h3>
                <p className="m-0 max-w-[480px] text-[15px] leading-[1.7] text-secondary sm:text-[17px]">
                  {point.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* BOTTOM CTA */}
      <section className="mx-auto flex max-w-[1520px] items-center px-6 py-8 sm:px-8">
        <div className="relative mx-auto flex w-full max-w-[1300px] items-center justify-center overflow-hidden rounded-[24px] border border-line bg-card px-6 py-[clamp(56px,9vw,96px)] sm:px-8 text-center shadow-lg lg:min-h-[620px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[20%] left-1/2 z-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-orange-100 opacity-60 blur-[90px]"
          />
          <div className="relative z-10">
            <p className="mb-5 font-mono text-[12.5px] font-bold tracking-[0.14em] text-primary">
              {cta.eyebrow}
            </p>
            <h2 className="m-0 mb-5 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.02em] text-ink">
              {cta.title}
            </h2>
            <p className="text-balance mx-auto mb-8 max-w-[480px] text-[16px] leading-[1.7] text-secondary">
              {cta.lede}
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <Button
                href={path(locale, "/contact")}
                iconRight={<Icon name="arrowRight" size={16} />}
              >
                {cta.primary}
              </Button>
              {cta.secondary.map((link) => (
                <Link
                  key={link.to}
                  href={path(locale, link.to)}
                  className="inline-flex h-[52px] items-center rounded-lg border-[1.5px] border-line-2 px-6 text-[16px] font-semibold text-ink transition-colors duration-150 ease-standard hover:border-primary hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <JsonLd schema={organizationSchema(site)} />
    </main>
  );
}
