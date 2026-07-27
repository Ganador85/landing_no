import type { CmsFaq, CmsService, CmsSettings } from "@/lib/cms-content";
import type { PageCopy } from "@/lib/page-copy";
import { siteConfig } from "@/lib/site";

type Props = {
  locale: "no" | "en";
  settings: CmsSettings;
  faq: CmsFaq[];
  services: CmsService[];
  testimonials: PageCopy["testimonials"]["items"];
  description: string;
};

function absoluteUrl(path: string) {
  return new URL(path, `${siteConfig.url}/`).toString();
}

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function JsonLd({
  locale,
  settings,
  faq,
  services,
  testimonials,
  description,
}: Props) {
  const pageUrl = `${siteConfig.url}/${locale}`;
  const organizationId = `${siteConfig.url}/#organization`;
  const businessId = `${siteConfig.url}/#local-business`;
  const websiteId = `${siteConfig.url}/#website`;

  const reviews = testimonials
    .map((item, index) => ({
      quote: item.quote[locale]?.trim(),
      author: item.author[locale]?.trim(),
      index,
    }))
    .filter((item): item is { quote: string; author: string; index: number } =>
      Boolean(item.quote && item.author),
    )
    .map((item) => ({
      "@type": "Review",
      "@id": `${pageUrl}#review-${item.index + 1}`,
      reviewBody: item.quote,
      author: {
        "@type": "Person",
        name: item.author,
      },
      itemReviewed: {
        "@id": businessId,
      },
    }));

  const business = {
    "@type": "LocalBusiness",
    "@id": businessId,
    name: settings.brandName,
    description,
    url: pageUrl,
    telephone: settings.phoneHref.replace("tel:", ""),
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      postalCode: settings.address.postal,
      addressCountry: siteConfig.address.country,
    },
    areaServed: settings.seo.areaServed[locale],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.trust.rating.split("/")[0] || "4.9",
      reviewCount: settings.trust.happyCustomers.replace(/\D/g, "") || "100",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: settings.seo.openingHours.days,
      opens: settings.seo.openingHours.opens,
      closes: settings.seo.openingHours.closes,
    },
    ...(reviews.length > 0
      ? {
          review: reviews.map((review) => ({ "@id": review["@id"] })),
        }
      : {}),
    ...(settings.parentOrg
      ? {
          parentOrganization: {
            "@type": "Organization",
            name: settings.parentOrg,
          },
        }
      : {}),
  };

  const organization = {
    "@type": "Organization",
    "@id": organizationId,
    name: settings.brandName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(settings.images.logo.url),
    },
    telephone: settings.phoneHref.replace("tel:", ""),
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      postalCode: settings.address.postal,
      addressCountry: siteConfig.address.country,
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.url,
    name: settings.brandName,
    description,
    inLanguage: locale === "no" ? "nb-NO" : "en",
    publisher: {
      "@id": organizationId,
    },
  };

  const serviceSchemas = services
    .map((service) => ({
      service,
      name: service.title[locale]?.trim(),
      serviceDescription: service.description[locale]?.trim(),
    }))
    .filter((item) => Boolean(item.name))
    .map(({ service, name, serviceDescription }) => ({
      "@type": "Service",
      "@id": `${pageUrl}#service-${encodeURIComponent(service.id || service.key)}`,
      name,
      ...(serviceDescription ? { description: serviceDescription } : {}),
      url: `${pageUrl}#tjenester`,
      provider: {
        "@id": businessId,
      },
      areaServed: settings.seo.areaServed[locale],
    }));

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[locale],
      },
    })),
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
      business,
      ...serviceSchemas,
      ...reviews,
      faqSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
