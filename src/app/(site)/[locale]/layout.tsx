import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { getSiteContent } from "@/lib/cms-content";
import { SiteSettingsProvider } from "@/components/site-settings-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyBottomCta } from "@/components/layout/sticky-cta";
import "../../globals.css";

export const revalidate = 30;

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const content = await getSiteContent();
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteConfig.url}/${l}`]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        ...languages,
        "x-default": `${siteConfig.url}/no`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteConfig.url}/${locale}`,
      siteName: content.settings.brandName,
      locale: locale === "no" ? "nb_NO" : "en_GB",
      type: "website",
      images: [
        {
          url: content.settings.images.hero,
          width: 1200,
          height: 630,
          alt: content.settings.brandName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [content.settings.images.hero],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "no" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const [messages, content] = await Promise.all([getMessages(), getSiteContent()]);

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <SiteSettingsProvider settings={content.settings}>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <StickyBottomCta />
            <Toaster theme="dark" position="top-center" richColors />
          </SiteSettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
