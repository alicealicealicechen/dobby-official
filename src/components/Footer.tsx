import Link from "next/link";
import Logo from "./Logo";
import { getSiteSettings } from "@/lib/content";
import { getDictionary, getNav, type Locale } from "@/lib/i18n";

export default async function Footer({ locale }: { locale: Locale }) {
  const site = await getSiteSettings(locale);
  const t = getDictionary(locale).footer;
  const nav = getNav(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2c2c2c] text-[#d4d2cb]">
      <div className="mx-auto grid max-w-[1520px] gap-10 px-6 pt-10 pb-6 sm:grid-cols-2 sm:px-8 sm:pt-12 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <Logo invert className="mb-4 h-[18px]" />
          <p className="m-0 max-w-[260px] text-sm leading-[1.7] text-[#a8a49a]">
            {site.description}
          </p>
        </div>

        <FooterColumn title={t.sitemap}>
          {nav.map((item) => (
            <FooterLink key={item.key} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={t.contact}>
          <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>
          <p className="m-0 text-sm text-[#a8a49a]">
            {site.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <FooterLink href={site.linkedin} external>
            LinkedIn
          </FooterLink>
        </FooterColumn>

        {/* Parked until the privacy and terms pages exist — /privacy and
            /terms have no route, so these linked to a 404. Restoring this also
            needs `path` back in the i18n import above.
        <FooterColumn title={t.legal}>
          <FooterLink href={path(locale, "/privacy")}>{t.privacy}</FooterLink>
          <FooterLink href={path(locale, "/terms")}>{t.terms}</FooterLink>
        </FooterColumn>
        */}
      </div>

      <div className="mx-auto max-w-[1520px] border-t border-[#484747] px-6 sm:px-8 py-4 text-[13px] text-[#757575]">
        © {year} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-4 text-[13px] font-bold text-[#f9f8f4]">{title}</h2>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex min-h-6 items-center text-sm text-[#a8a49a] transition-colors duration-150 ease-standard hover:text-[#f9f8f4]";

  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
