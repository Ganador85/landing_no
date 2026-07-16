"use client";

import { createContext, useContext } from "react";
import type { CmsSettings } from "@/lib/cms-content";
import { siteConfig } from "@/lib/site";
import { siteImages } from "@/content/images";

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

const SiteSettingsContext = createContext<CmsSettings>(fallbackSettings);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: CmsSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
