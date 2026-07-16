import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { CalculatorSection } from "@/components/sections/calculator";
import { NewRoofSection } from "@/components/sections/new-roof";
import { ReferencesSection } from "@/components/sections/references";
import { AboutSection } from "@/components/sections/about";
import { ProductsSection } from "@/components/sections/products";
import { FaqSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";
import { routing } from "@/i18n/routing";
import { getSiteContent } from "@/lib/cms-content";

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
      <JsonLd locale={locale as "no" | "en"} settings={content.settings} faq={content.faq} />
      <HeroSection heroImage={content.settings.images.hero} />
      <ServicesSection items={content.services} />
      <CalculatorSection calculator={content.settings.calculator} />
      <NewRoofSection imageUrl={content.settings.images.newRoof} />
      <ReferencesSection projects={content.projects} />
      <AboutSection
        imageUrl={content.settings.images.about}
        settings={content.settings}
      />
      <ProductsSection products={content.products} />
      <FaqSection items={content.faq} />
      <ContactSection />
    </>
  );
}
