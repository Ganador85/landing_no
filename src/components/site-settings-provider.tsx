"use client";

import { createContext, useContext, useMemo } from "react";
import { useLocale } from "next-intl";
import type { CmsSettings } from "@/lib/cms-content";
import {
  localizeCopy,
  pageCopyFromMessages,
  type LocalizedCopy,
  type PageCopy,
} from "@/lib/page-copy";
import { siteConfig } from "@/lib/site";
import { siteImages } from "@/content/images";
import noMessages from "@/i18n/messages/no.json";
import enMessages from "@/i18n/messages/en.json";

const fallbackSettings: CmsSettings = {
  brandName: siteConfig.name,
  phone: siteConfig.phone,
  phoneHref: siteConfig.phoneHref,
  email: siteConfig.email,
  address: {
    street: siteConfig.address.street,
    postal: siteConfig.address.postal,
    city: siteConfig.address.city,
  },
  orgNr: siteConfig.orgNr,
  parentOrg: siteConfig.parentOrg,
  calculator: siteConfig.calculator,
  trust: siteConfig.trust,
  images: {
    hero: siteImages.hero,
    about: siteImages.about,
    newRoof: siteImages.newRoof,
  },
};

const fallbackCopy = pageCopyFromMessages(noMessages, enMessages);

type SiteContextValue = {
  settings: CmsSettings;
  copy: PageCopy;
};

const SiteSettingsContext = createContext<SiteContextValue>({
  settings: fallbackSettings,
  copy: fallbackCopy,
});

export function SiteSettingsProvider({
  settings,
  copy,
  children,
}: {
  settings: CmsSettings;
  copy: PageCopy;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ settings, copy }), [settings, copy]);

  return (
    <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext).settings;
}

export function usePageCopy(): LocalizedCopy {
  const locale = useLocale() as "no" | "en";
  const { copy } = useContext(SiteSettingsContext);
  return useMemo(() => localizeCopy(copy, locale), [copy, locale]);
}
