import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getSiteContent } from "@/lib/cms-content";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = await getSiteContent();
  const loc = locale as "no" | "en";
  const title = content.settings.privacy.title[loc];
  return {
    title,
    description: title,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/personvern`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteConfig.url}/${l}/personvern`]),
      ),
    },
    robots: { index: true, follow: true },
  };
}

function renderMarkdownLite(body: string) {
  return body.split(/\n\n+/).map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 text-xl font-semibold tracking-tight">
          {trimmed.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
          {items.map((item, j) => (
            <li key={j}>{item.replace(/^-\s+/, "")}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mt-3 leading-relaxed text-muted-foreground">
        {trimmed}
      </p>
    );
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "no" | "en";
  const content = await getSiteContent();
  const privacy = content.settings.privacy;

  return (
    <section className="section-pad">
      <div className="container-narrow max-w-3xl">
        <p className="eyebrow">
          <Link href="/" className="hover:text-accent">
            {loc === "no" ? "Forside" : "Home"}
          </Link>
        </p>
        <h1 className="heading-display mt-3 text-balance">{privacy.title[loc]}</h1>
        <div className="mt-8">{renderMarkdownLite(privacy.body[loc])}</div>
      </div>
    </section>
  );
}
