import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/content";
import { organizationSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "讓我們一起評估，如何在你的環境中安全地導入 AI。",
};

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <>
      <Header nav={site.nav} active="contact" />
      <Breadcrumb
        baseUrl={site.url}
        items={[{ label: "首頁", href: "/" }, { label: "聯絡我們" }]}
      />

      <main>
        <section className="mx-auto max-w-[1200px] px-8 pt-10 pb-20">
          <div className="mb-12 text-center">
            <h1 className="m-0 mb-3 text-[clamp(2rem,3.5vw,2.5rem)] font-bold tracking-[-0.02em] text-ink">
              聯絡我們
            </h1>
            <p className="m-0 text-[16px] text-secondary">
              讓我們一起評估，如何在你的環境中安全地導入 AI
            </p>
          </div>

          <div className="mx-auto grid max-w-[960px] gap-12 lg:grid-cols-[1.2fr_1fr]">
            <ContactForm />

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
                  <a href={`mailto:${site.email}`} className="text-sm">
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
                    className="text-sm"
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
                    地址
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

      <Footer />

      <JsonLd schema={organizationSchema(site)} />
    </>
  );
}
