import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { NewRoofSection } from "@/components/sections/new-roof";
import { AboutSection } from "@/components/sections/about";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ProductsSection } from "@/components/sections/products";
import { FaqSection } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";
import { getSiteContent } from "@/lib/cms-content";

/** Defer heavier below-fold client JS so initial load ships less unused code. */
const CalculatorSection = dynamic(() =>
  import("@/components/sections/calculator").then((m) => ({
    default: m.CalculatorSection,
  })),
);
const ReferencesSection = dynamic(() =>
  import("@/components/sections/references").then((m) => ({
    default: m.ReferencesSection,
  })),
);
const ContactSection = dynamic(() =>
  import("@/components/sections/contact").then((m) => ({
    default: m.ContactSection,
  })),
);

export const revalidate = 30;

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getSiteContent();

  return (
    <>
      <JsonLd
        locale={locale as "no" | "en"}
        settings={content.settings}
        faq={content.faq}
        description={content.copy.meta.description[locale as "no" | "en"]}
      />
      <HeroSection heroImage={content.settings.images.hero} />
      <ServicesSection items={content.services} />
      <CalculatorSection calculator={content.settings.calculator} />
      <NewRoofSection imageUrl={content.settings.images.newRoof} />
      <ReferencesSection projects={content.projects} />
      <AboutSection
        imageUrl={content.settings.images.about}
        settings={content.settings}
      />
      <TestimonialsSection />
      <ProductsSection products={content.products} />
      <FaqSection items={content.faq} />
      <ContactSection />
    </>
  );
}
