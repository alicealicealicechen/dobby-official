import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/content";
import { organizationSchema } from "@/lib/schemas";
import { getDictionary, path, toLocale } from "@/lib/i18n";

// SSG + ISR, so published CMS edits appear without a redeploy.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const t = getDictionary(locale).contact;

  return {
    title: t.title,
    description: t.lede,
    alternates: { canonical: path(locale, "/contact") },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const site = await getSiteSettings(locale);
  const t = getDictionary(locale);

  return (
    <>
      <Breadcrumb
        baseUrl={site.url}
        items={[
          { label: t.breadcrumb.home, href: path(locale) },
          { label: t.breadcrumb.contact },
        ]}
      />

      <main>
        <section className="mx-auto max-w-[1200px] px-6 sm:px-8 pt-10 pb-20">
          <div className="mb-12 text-center">
            <h1 className="m-0 mb-3 text-[clamp(2rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em] text-ink">
              {t.contact.title}
            </h1>
            <p className="text-balance m-0 text-[16px] text-secondary">
              {t.contact.lede}
            </p>
          </div>

          <div className="mx-auto grid max-w-[960px] gap-12 lg:grid-cols-[1.2fr_1fr]">
            <ContactForm t={t.contact} />

            <div className="flex flex-col gap-6">
              <div className="flex gap-3">
                <Icon
                  name="user"
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div>
                  <h2 className="m-0 mb-1 text-sm font-semibold text-ink">
                    Email
                  </h2>
                  <a href={`mailto:${site.email}`} className="inline-flex min-h-6 items-center text-sm">
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <Icon
                  name="chat"
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div>
                  <h2 className="m-0 mb-1 text-sm font-semibold text-ink">
                    LinkedIn
                  </h2>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-6 items-center text-sm"
                  >
                    {site.name}
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <Icon
                  name="fileText"
                  size={20}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <div>
                  <h2 className="m-0 mb-1 text-sm font-semibold text-ink">
                    {t.contact.address}
                  </h2>
                  <p className="m-0 text-sm leading-[1.7] text-secondary">
                    {site.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <JsonLd schema={organizationSchema(site)} />
    </>
  );
}
