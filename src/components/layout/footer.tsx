"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { usePageCopy, useSiteSettings } from "@/components/site-settings-provider";

export function Footer() {
  const copy = usePageCopy();
  const locale = useLocale();
  const settings = useSiteSettings();
  const year = new Date().getFullYear();

  const quick = [
    { href: "/", label: copy.nav.home },
    { href: "/#tjenester", label: copy.nav.services },
    { href: "/#referanser", label: copy.nav.references },
    { href: "/#om-oss", label: copy.nav.about },
    { href: "/#kontakt", label: copy.nav.contact },
  ] as const;

  return (
    <footer className="border-t border-white/10 bg-[#080a0e] pb-24 md:pb-0">
      <div className="container-narrow section-pad grid gap-10 md:grid-cols-3">
        <div className="space-y-4">
          <Link
            href="/"
            className="relative block h-10 w-[180px]"
            aria-label={settings.brandName}
          >
            <Image
              src="/brand/logo.webp"
              alt={settings.brandName}
              fill
              sizes="180px"
              className="object-contain object-left"
            />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {copy.footer.tagline}
          </p>
          {settings.parentOrg ? (
            <p className="text-sm text-muted-foreground">
              {copy.footer.partOf}{" "}
              <span className="text-foreground">{settings.parentOrg}</span>
            </p>
          ) : null}
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider">
            {copy.footer.quickLinks}
          </p>
          <ul className="space-y-2">
            {quick.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider">
            {copy.footer.contact}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${settings.email}`} className="hover:text-accent">
                {settings.email}
              </a>
            </li>
            <li>
              <a href={settings.phoneHref} className="hover:text-accent">
                {settings.phone}
              </a>
            </li>
            <li>
              {settings.address.street}, {settings.address.postal}{" "}
              {settings.address.city}
            </li>
            <li>Org.nr: {settings.orgNr}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-narrow flex flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {settings.brandName}. {copy.footer.rights}
          </p>
          <p>{copy.footer.warrantyNote}</p>
          <p className="uppercase tracking-wider">{locale}</p>
        </div>
      </div>
    </footer>
  );
}
