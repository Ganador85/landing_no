"use client";

import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePageCopy, useSiteSettings } from "@/components/site-settings-provider";

const links = [
  { href: "/#tjenester", key: "services" as const },
  { href: "/#referanser", key: "references" as const },
  { href: "/#om-oss", key: "about" as const },
  { href: "/#produkter", key: "products" as const },
  { href: "/#kontakt", key: "contact" as const },
];

export function Navbar() {
  const copy = usePageCopy();
  const locale = useLocale();
  const pathname = usePathname();
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "no" ? "en" : "no";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="container-narrow flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-amber-700 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20">
            T
          </span>
          <span className="text-sm font-bold tracking-wide uppercase sm:text-base">
            {settings.brandName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {copy.nav[link.key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={otherLocale}
            className="hidden rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground sm:inline-flex"
            aria-label={`Switch to ${otherLocale === "no" ? "Norwegian" : "English"}`}
          >
            {otherLocale}
          </Link>

          <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
            <a href={settings.phoneHref}>
              <Phone className="size-3.5" />
              {copy.nav.call}
            </a>
          </Button>

          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/#kontakt">{copy.nav.contactUs}</Link>
          </Button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-white/10 lg:hidden"
            aria-label={open ? copy.nav.close : copy.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-white/5 bg-background/95 backdrop-blur-xl lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-narrow flex flex-col gap-1 px-4 py-4">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-xl px-4 py-3 text-base font-medium hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {copy.nav[link.key]}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-white/10 pt-4">
            <Button asChild className="flex-1" variant="secondary">
              <a href={settings.phoneHref}>
                <Phone className="size-4" />
                {copy.nav.call}
              </a>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/#kontakt" onClick={() => setOpen(false)}>
                {copy.nav.contactUs}
              </Link>
            </Button>
          </div>
          <Link
            href={pathname}
            locale={otherLocale}
            className="mt-2 rounded-xl px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            {otherLocale === "no" ? "Norsk" : "English"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
