"use client";

import { Phone, CalendarCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePageCopy, useSiteSettings } from "@/components/site-settings-provider";

export function StickyBottomCta() {
  const copy = usePageCopy();
  const settings = useSiteSettings();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/90 px-3 py-2 backdrop-blur-xl md:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={settings.phoneHref}
          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 text-sm font-medium text-foreground transition-colors active:scale-[0.98]"
        >
          <Phone className="size-3.5" />
          {copy.sticky.call}
        </a>
        <Link
          href="/#kontakt"
          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent text-sm font-semibold text-accent-foreground shadow-md shadow-accent/20 transition-colors active:scale-[0.98]"
        >
          <CalendarCheck className="size-3.5" />
          {copy.sticky.book}
        </Link>
      </div>
    </div>
  );
}
