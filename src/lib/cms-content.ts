import { cache } from "react";
import { getPayload } from "@/lib/payload";
import { siteConfig } from "@/lib/site";
import { siteImages } from "@/content/images";
import {
  faqItems as fallbackFaq,
  products as fallbackProducts,
  projects as fallbackProjects,
  serviceKeys,
} from "@/content/site-content";
import noMessages from "@/i18n/messages/no.json";
import enMessages from "@/i18n/messages/en.json";
import {
  pageCopyFromMessages,
  pageCopyFromSettingsDoc,
  type PageCopy,
} from "@/lib/page-copy";

export type CmsService = {
  id: string;
  key: string;
  title: { no: string; en: string };
  description: { no: string; en: string };
  icon: string;
  featured: boolean;
  order: number;
};

export type CmsProject = {
  id: string;
  title: { no: string; en: string };
  order: number;
  stages: Array<{
    label: "before" | "during" | "after";
    caption: { no: string; en: string };
    image: string;
  }>;
};

export type CmsProduct = {
  id: string;
  name: string;
  category: { no: string; en: string };
  description: { no: string; en: string };
  badges: { no: string[]; en: string[] };
  order: number;
};

export type CmsFaq = {
  id: string;
  question: { no: string; en: string };
  answer: { no: string; en: string };
  order: number;
};

export type CmsSettings = {
  brandName: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: { street: string; postal: string; city: string };
  orgNr: string;
  parentOrg: string;
  calculator: typeof siteConfig.calculator;
  trust: typeof siteConfig.trust;
  images: {
    hero: string;
    about: string;
    newRoof: string;
  };
};

export type SiteContent = {
  settings: CmsSettings;
  copy: PageCopy;
  services: CmsService[];
  projects: CmsProject[];
  products: CmsProduct[];
  faq: CmsFaq[];
  source: "cms" | "fallback";
};

function fallbackServices(): CmsService[] {
  return serviceKeys.map((key, index) => {
    const noItem = noMessages.services.items[key as keyof typeof noMessages.services.items];
    const enItem = enMessages.services.items[key as keyof typeof enMessages.services.items];
    return {
      id: key,
      key,
      title: { no: noItem.title, en: enItem.title },
      description: { no: noItem.description, en: enItem.description },
      icon:
        key === "warranty"
          ? "shield"
          : key === "wash" || key === "softwash"
            ? "droplets"
            : key === "paint"
              ? "paint"
              : key === "newRoof"
                ? "home"
                : key === "impregnation"
                  ? "sparkles"
                  : key === "tiles" || key === "maintenance"
                    ? "wrench"
                    : "check",
      featured: index < 5,
      order: index,
    };
  });
}

function fallbackContent(): SiteContent {
  const copy = pageCopyFromMessages(noMessages, enMessages);
  return {
    source: "fallback",
    copy,
    settings: {
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
    },
    services: fallbackServices(),
    projects: fallbackProjects.map((p, i) => ({
      id: p.id,
      title: p.title,
      order: i,
      stages: p.stages.map((s) => ({
        label: s.label,
        caption: s.caption,
        image: s.image,
      })),
    })),
    products: fallbackProducts.map((p, i) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description,
      badges: {
        no: [...p.badges.no],
        en: [...p.badges.en],
      },
      order: i,
    })),
    faq: fallbackFaq.map((f, i) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      order: i,
    })),
  };
}

function phoneHrefFrom(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

type MediaLike =
  | number
  | string
  | {
      url?: string | null;
      sizes?: {
        hero?: { url?: string | null } | null;
        card?: { url?: string | null } | null;
      } | null;
    }
  | null
  | undefined;

function resolveMediaUrl(
  media: MediaLike,
  preferredSize?: "hero" | "card",
): string | undefined {
  if (!media || typeof media === "number" || typeof media === "string") {
    return undefined;
  }
  if (preferredSize === "hero" && media.sizes?.hero?.url) {
    return media.sizes.hero.url;
  }
  if (preferredSize === "card" && media.sizes?.card?.url) {
    return media.sizes.card.url;
  }
  return media.url || undefined;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const fallback = fallbackContent();

  try {
    const payload = await getPayload();
    const [settingsDoc, servicesRes, projectsRes, productsRes, faqRes] =
      await Promise.all([
        payload.findGlobal({ slug: "site-settings", depth: 1 }),
        payload.find({
          collection: "services",
          sort: "order",
          limit: 50,
          depth: 0,
          overrideAccess: true,
        }),
        payload.find({
          collection: "projects",
          sort: "order",
          limit: 50,
          depth: 1,
          overrideAccess: true,
        }),
        payload.find({
          collection: "products",
          sort: "order",
          limit: 50,
          depth: 0,
          overrideAccess: true,
        }),
        payload.find({
          collection: "faq",
          sort: "order",
          limit: 50,
          depth: 0,
          overrideAccess: true,
        }),
      ]);

    const hasCmsRows =
      servicesRes.docs.length > 0 ||
      projectsRes.docs.length > 0 ||
      productsRes.docs.length > 0 ||
      faqRes.docs.length > 0;

    const copyFallback = pageCopyFromMessages(noMessages, enMessages);
    const copy = pageCopyFromSettingsDoc(settingsDoc, copyFallback);
    const hasCmsCopy = Boolean(settingsDoc.copyMeta?.titleNo?.trim());

    const settings: CmsSettings = {
      brandName: settingsDoc.brandName || fallback.settings.brandName,
      phone: settingsDoc.phone || fallback.settings.phone,
      phoneHref: phoneHrefFrom(settingsDoc.phone || fallback.settings.phone),
      email: settingsDoc.email || fallback.settings.email,
      address: {
        street: settingsDoc.street || fallback.settings.address.street,
        postal: settingsDoc.postal || fallback.settings.address.postal,
        city: settingsDoc.city || fallback.settings.address.city,
      },
      orgNr: settingsDoc.orgNr || fallback.settings.orgNr,
      parentOrg: settingsDoc.parentOrg || fallback.settings.parentOrg,
      calculator: {
        minSqm: settingsDoc.calculator?.minSqm ?? fallback.settings.calculator.minSqm,
        maxSqm: settingsDoc.calculator?.maxSqm ?? fallback.settings.calculator.maxSqm,
        defaultSqm:
          settingsDoc.calculator?.defaultSqm ?? fallback.settings.calculator.defaultSqm,
        newRoofPerSqm:
          settingsDoc.calculator?.newRoofPerSqm ??
          fallback.settings.calculator.newRoofPerSqm,
        renewalPerSqm:
          settingsDoc.calculator?.renewalPerSqm ??
          fallback.settings.calculator.renewalPerSqm,
      },
      trust: {
        sqmRenewed: settingsDoc.trust?.sqmRenewed || fallback.settings.trust.sqmRenewed,
        warrantyYears:
          settingsDoc.trust?.warrantyYears ?? fallback.settings.trust.warrantyYears,
        happyCustomers:
          settingsDoc.trust?.happyCustomers || fallback.settings.trust.happyCustomers,
        rating: settingsDoc.trust?.rating || fallback.settings.trust.rating,
      },
      images: {
        hero:
          resolveMediaUrl(settingsDoc.heroImage as MediaLike, "hero") ||
          settingsDoc.heroImageUrl ||
          fallback.settings.images.hero,
        about:
          resolveMediaUrl(settingsDoc.aboutImage as MediaLike, "card") ||
          settingsDoc.aboutImageUrl ||
          fallback.settings.images.about,
        newRoof:
          resolveMediaUrl(settingsDoc.newRoofImage as MediaLike, "card") ||
          settingsDoc.newRoofImageUrl ||
          fallback.settings.images.newRoof,
      },
    };

    const services: CmsService[] =
      servicesRes.docs.length > 0
        ? servicesRes.docs.map((doc) => ({
            id: String(doc.id),
            key: doc.key,
            title: { no: doc.titleNo, en: doc.titleEn },
            description: { no: doc.descriptionNo, en: doc.descriptionEn },
            icon: doc.icon || "check",
            featured: Boolean(doc.featured),
            order: doc.order ?? 0,
          }))
        : fallback.services;

    const projects: CmsProject[] =
      projectsRes.docs.length > 0
        ? projectsRes.docs.map((doc) => ({
            id: String(doc.id),
            title: { no: doc.titleNo, en: doc.titleEn },
            order: doc.order ?? 0,
            stages: (doc.stages || []).map(
              (stage: {
                label: "before" | "during" | "after";
                captionNo: string;
                captionEn: string;
                image?: MediaLike;
                imageUrl?: string | null;
              }) => ({
                label: stage.label,
                caption: { no: stage.captionNo, en: stage.captionEn },
                image:
                  resolveMediaUrl(stage.image, "card") ||
                  stage.imageUrl ||
                  fallback.settings.images.hero,
              }),
            ),
          }))
        : fallback.projects;

    const products: CmsProduct[] =
      productsRes.docs.length > 0
        ? productsRes.docs.map((doc) => ({
            id: String(doc.id),
            name: doc.name,
            category: { no: doc.categoryNo, en: doc.categoryEn },
            description: { no: doc.descriptionNo, en: doc.descriptionEn },
            badges: {
              no: (doc.badgesNo || [])
                .map((b: { label: string }) => b.label)
                .filter(Boolean),
              en: (doc.badgesEn || [])
                .map((b: { label: string }) => b.label)
                .filter(Boolean),
            },
            order: doc.order ?? 0,
          }))
        : fallback.products;

    const faq: CmsFaq[] =
      faqRes.docs.length > 0
        ? faqRes.docs.map((doc) => ({
            id: String(doc.id),
            question: { no: doc.questionNo, en: doc.questionEn },
            answer: { no: doc.answerNo, en: doc.answerEn },
            order: doc.order ?? 0,
          }))
        : fallback.faq;

    return {
      source: hasCmsRows || hasCmsCopy ? "cms" : "fallback",
      settings,
      copy,
      services,
      projects,
      products,
      faq,
    };
  } catch (err) {
    console.error("CMS content fetch failed, using fallback:", err);
    return fallback;
  }
});
