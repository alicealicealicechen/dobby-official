import Link from "next/link";
import Logo from "./Logo";
import { getSiteSettings } from "@/lib/content";

export default async function Footer() {
  const site = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2c2c2c] text-[#d4d2cb]">
      <div className="mx-auto grid max-w-[1520px] gap-10 px-8 pt-16 pb-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo invert className="mb-4 h-[18px]" />
          <p className="m-0 max-w-[260px] text-sm leading-[1.7] text-[#a8a49a]">
            {site.description}
          </p>
        </div>

        <FooterColumn title="網站地圖">
          {site.nav.map((item) => (
            <FooterLink key={item.key} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="聯絡資訊">
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

        <FooterColumn title="法律">
          {site.footerLegal.map((item) => (
            <FooterLink key={item.href} href={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </div>

      <div className="mx-auto max-w-[1520px] border-t border-[#484747] px-8 py-6 text-[13px] text-[#757575]">
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
    "text-sm text-[#a8a49a] transition-colors duration-150 ease-standard hover:text-[#f9f8f4]";

  if (external || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={className}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
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
