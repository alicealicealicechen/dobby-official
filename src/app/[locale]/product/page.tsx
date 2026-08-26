import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Faq from "@/components/Faq";
import JsonLd from "@/components/JsonLd";
import productShot from "@/assets/product_screenshot.png";
import { getSiteSettings } from "@/lib/content";
import { getProductContent } from "@/lib/pages";
import { faqSchema } from "@/lib/schemas";
import { getDictionary, path, toLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const content = await getProductContent(locale);

  return {
    title: getDictionary(locale).breadcrumb.product,
    description: content.hero.lede,
    alternates: { canonical: path(locale, "/product") },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const [site, content] = await Promise.all([
    getSiteSettings(locale),
    getProductContent(locale),
  ]);
  const t = getDictionary(locale).breadcrumb;

  return (
    <>
      <Breadcrumb
        baseUrl={site.url}
        items={[
          { label: t.home, href: path(locale) },
          { label: t.product },
        ]}
      />

      <main>
        <section className="mx-auto max-w-[1200px] px-6 pt-14 pb-8 sm:px-8 sm:pt-20 sm:pb-10 text-center">
          <h1 className="m-0 mb-6 text-[clamp(2.75rem,9vw,7rem)] leading-[1] sm:leading-[0.95] font-semibold tracking-[0.02em] text-ink">
            {content.hero.title}
          </h1>
          <p className="mx-auto m-0 max-w-[640px] text-[17px] leading-[1.7] font-medium text-secondary sm:text-[20px]">
            {content.hero.lede}
          </p>
        </section>

        {/* OVERVIEW */}
        <section className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 sm:px-8 py-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[20px] border border-line shadow-[0_24px_48px_-24px_rgba(30,30,30,0.16)]">
            <Image
              src={productShot}
              alt={content.overview.imageAlt}
              sizes="(max-width: 1024px) 100vw, 560px"
              placeholder="blur"
              className="block h-auto w-full"
            />
          </div>
          <div>
            <h2 className="m-0 mb-4 text-[clamp(1.6rem,2.5vw,2rem)] font-bold tracking-[-0.02em] text-ink">
              {content.overview.title}
            </h2>
            <div className="flex flex-col gap-5">
              {content.overview.features.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <Icon
                    name={feature.icon}
                    size={22}
                    className="mt-0.5 shrink-0 text-primary"
                  />
                  <div>
                    <h3 className="m-0 mb-1 text-[15px] font-semibold text-ink">
                      {feature.title}
                    </h3>
                    <p className="m-0 text-sm leading-[1.6] text-secondary">
                      {feature.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLANS */}
        <section id="pricing" className="mx-auto max-w-[1024px] px-6 sm:px-8 py-14">
          <h2 className="m-0 mb-10 text-center text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-ink">
            {content.plansTitle}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.plans.map((plan) => (
              <div
                key={plan.name}
                className="flex flex-col rounded-2xl border border-line bg-card p-6 sm:p-8"
              >
                <h3 className="m-0 mb-1 text-[19px] font-bold text-ink">
                  {plan.name}
                </h3>
                <p className="m-0 mb-2 text-[13.5px] font-semibold text-orange-700">
                  {plan.subtitle}
                </p>
                <p className="m-0 mb-5 text-sm text-secondary">
                  {plan.description}
                </p>
                <div className="mb-4 h-px bg-line-soft" />
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-[13.5px] text-secondary"
                    >
                      <Icon
                        name="check"
                        size={15}
                        strokeWidth={2}
                        className="mt-1 shrink-0 text-primary"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-y border-line bg-subtle px-6 sm:px-8 py-14">
          <div className="mx-auto max-w-[768px]">
            <h2 className="m-0 mb-8 text-center text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-[-0.02em] text-ink">
              {content.faqTitle}
            </h2>
            <Faq items={content.faqs} />
          </div>
        </section>

        <section className="mx-auto max-w-[1024px] px-6 sm:px-8 py-16 text-center">
          <h2 className="m-0 mb-4 text-[clamp(1.6rem,2.5vw,2rem)] font-bold text-ink">
            {content.closing.title}
          </h2>
          <Button href={path(locale, "/contact")} className="px-6 sm:px-8">
            {content.closing.cta}
          </Button>
        </section>
      </main>

      <JsonLd schema={faqSchema(content.faqs)} />
    </>
  );
}
