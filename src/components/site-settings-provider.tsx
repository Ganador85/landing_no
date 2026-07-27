"use client";

import { createContext, useContext, useMemo } from "react";
import { useLocale } from "next-intl";
import type { CmsSettings } from "@/lib/cms-content";
import {
  localizeCopy,
  type LocalizedCopy,
  type PageCopy,
} from "@/lib/page-copy";

type SiteContextValue = {
  settings: CmsSettings;
  copy: PageCopy;
};

const SiteSettingsContext = createContext<SiteContextValue | null>(null);

function useSiteContext() {
  const value = useContext(SiteSettingsContext);
  if (!value) {
    throw new Error(
      "Site settings hooks must be used within SiteSettingsProvider.",
    );
  }
  return value;
}

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
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useSiteContext().settings;
}

export function usePageCopy(): LocalizedCopy {
  const locale = useLocale() as "no" | "en";
  const { copy } = useSiteContext();
  return useMemo(() => localizeCopy(copy, locale), [copy, locale]);
}
