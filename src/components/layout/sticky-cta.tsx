"use client";

import { Phone, CalendarCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

export function StickyBottomCta() {
  const t = useTranslations("sticky");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/90 p-3 backdrop-blur-xl md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={siteConfig.phoneHref}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-sm font-semibold text-foreground transition-colors active:scale-[0.98]"
        >
          <Phone className="size-4" />
          {t("call")}
        </a>
        <Link
          href="/#kontakt"
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-colors active:scale-[0.98]"
        >
          <CalendarCheck className="size-4" />
          {t("book")}
        </Link>
      </div>
    </div>
  );
}
