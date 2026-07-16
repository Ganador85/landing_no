import type { CmsFaq, CmsSettings } from "@/lib/cms-content";
import { siteConfig } from "@/lib/site";

type Props = {
  locale: "no" | "en";
  settings: CmsSettings;
  faq: CmsFaq[];
};

export function JsonLd({ locale, settings, faq }: Props) {
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.brandName,
    description:
      locale === "no"
        ? "Spesialist på takfornying: vask, impregnering og maling – eller nytt tak."
        : "Specialist in roof renewal: washing, impregnation and painting – or new roofs.",
    url: `${siteConfig.url}/${locale}`,
    telephone: settings.phoneHref.replace("tel:", ""),
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      postalCode: settings.address.postal,
      addressCountry: siteConfig.address.country,
    },
    areaServed: locale === "no" ? "Sør- og Midt-Norge" : "Southern and Central Norway",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: settings.trust.rating.split("/")[0] || "4.9",
      reviewCount: "500",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
    parentOrganization: {
      "@type": "Organization",
      name: settings.parentOrg,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question[locale],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[locale],
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
