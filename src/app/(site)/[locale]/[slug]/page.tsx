import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MarkdownLite } from "@/components/content/markdown-lite";
import { Link, routing } from "@/i18n/routing";
import {
  getPageBySlug,
  getPublishedPages,
  getRedirectDestination,
  getRedirectForPath,
  localizeContent,
} from "@/lib/cms-pages";
import { redirectPathCandidates } from "@/lib/content-paths";
import { siteConfig, type Locale } from "@/lib/site";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const pages = await getPublishedPages();
    return pages.flatMap((page) =>
      routing.locales.map((locale) => ({ locale, slug: page.slug })),
    );
  } catch (error) {
    console.error("CMS page static params could not be generated:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  const loc = locale as Locale;
  const localized = localizeContent(page, loc);
  const { isEnabled: isDraftMode } = await draftMode();
  const pageUrl = `${siteConfig.url}/${locale}/${slug}`;

  return {
    title: localized.seoTitle,
    description: localized.seoDescription,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(
        routing.locales.map((language) => [
          language,
          `${siteConfig.url}/${language}/${slug}`,
        ]),
      ),
    },
    openGraph: {
      title: localized.seoTitle,
      description: localized.seoDescription,
      type: "website",
      url: pageUrl,
    },
    robots: isDraftMode
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "no" ? "nb-NO" : "en-GB", {
    dateStyle: "long",
  }).format(new Date(value));
}

export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const currentPath = `/${locale}/${slug}`;

  const redirectDocument = await getRedirectForPath(loc, currentPath);
  const destination = redirectDocument
    ? getRedirectDestination(redirectDocument)
    : null;
  const sourceAliases = redirectPathCandidates(loc, currentPath);

  if (destination && !sourceAliases.includes(destination)) {
    if (redirectDocument?.permanent !== false) permanentRedirect(destination);
    redirect(destination);
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const localized = localizeContent(page, loc);

  return (
    <article className="section-pad">
      <div className="container-narrow max-w-3xl">
        <p className="eyebrow">
          <Link href="/" className="hover:text-accent-hover">
            {loc === "no" ? "Forside" : "Home"}
          </Link>
        </p>
        <h1 className="heading-display mt-3 text-balance">{localized.title}</h1>
        {page.publishedAt && (
          <time
            dateTime={page.publishedAt}
            className="mt-4 block text-sm text-muted-foreground"
          >
            {formatDate(page.publishedAt, loc)}
          </time>
        )}
        {localized.excerpt && (
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {localized.excerpt}
          </p>
        )}
        <div className="mt-10">
          <MarkdownLite content={localized.content} />
        </div>
      </div>
    </article>
  );
}
