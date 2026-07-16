import { faqItems } from "@/content/site-content";
import { siteConfig } from "@/lib/site";

type Props = { locale: "no" | "en" };

export function JsonLd({ locale }: Props) {
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description:
      locale === "no"
        ? "Spesialist på takfornying: vask, impregnering og maling – eller nytt tak."
        : "Specialist in roof renewal: washing, impregnation and painting – or new roofs.",
    url: `${siteConfig.url}/${locale}`,
    telephone: siteConfig.phoneHref.replace("tel:", ""),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postal,
      addressCountry: siteConfig.address.country,
    },
    areaServed: locale === "no" ? "Sør- og Midt-Norge" : "Southern and Central Norway",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
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
      name: siteConfig.parentOrg,
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
