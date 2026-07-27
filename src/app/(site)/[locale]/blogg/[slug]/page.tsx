import type { Metadata } from "next";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MarkdownLite } from "@/components/content/markdown-lite";
import { Link, routing } from "@/i18n/routing";
import {
  getPostBySlug,
  getPublishedPosts,
  getRedirectDestination,
  getRedirectForPath,
  localizeContent,
} from "@/lib/cms-pages";
import { resolveMedia } from "@/lib/cms-content";
import { redirectPathCandidates } from "@/lib/content-paths";
import { siteConfig, type Locale } from "@/lib/site";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.flatMap((post) =>
      routing.locales.map((locale) => ({ locale, slug: post.slug })),
    );
  } catch (error) {
    console.error("Blog static params could not be generated:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const loc = locale as Locale;
  const localized = localizeContent(post, loc);
  const hero = resolveMedia(post.heroImage, "hero");
  const { isEnabled: isDraftMode } = await draftMode();
  const postUrl = `${siteConfig.url}/${locale}/blogg/${slug}`;
  const heroUrl = hero
    ? new URL(hero.url, siteConfig.url).toString()
    : undefined;

  return {
    title: localized.seoTitle,
    description: localized.seoDescription,
    alternates: {
      canonical: postUrl,
      languages: Object.fromEntries(
        routing.locales.map((language) => [
          language,
          `${siteConfig.url}/${language}/blogg/${slug}`,
        ]),
      ),
    },
    openGraph: {
      title: localized.seoTitle,
      description: localized.seoDescription,
      type: "article",
      url: postUrl,
      publishedTime: post.publishedAt || undefined,
      images: heroUrl
        ? [{ url: heroUrl, alt: hero?.alt || localized.title }]
        : undefined,
    },
    twitter: heroUrl
      ? {
          card: "summary_large_image",
          title: localized.seoTitle,
          description: localized.seoDescription,
          images: [heroUrl],
        }
      : undefined,
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

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const currentPath = `/${locale}/blogg/${slug}`;

  const redirectDocument = await getRedirectForPath(loc, currentPath);
  const destination = redirectDocument
    ? getRedirectDestination(redirectDocument)
    : null;
  const sourceAliases = redirectPathCandidates(loc, currentPath);

  if (destination && !sourceAliases.includes(destination)) {
    if (redirectDocument?.permanent !== false) permanentRedirect(destination);
    redirect(destination);
  }

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const localized = localizeContent(post, loc);
  const hero = resolveMedia(post.heroImage, "hero");
  const date = post.publishedAt || post.createdAt;

  return (
    <article className="section-pad">
      <div className="container-narrow max-w-3xl">
        <p className="eyebrow">
          <Link href="/blogg" className="hover:text-accent-hover">
            {loc === "no" ? "Tilbake til bloggen" : "Back to the blog"}
          </Link>
        </p>
        <h1 className="heading-display mt-3 text-balance">{localized.title}</h1>
        <time
          dateTime={date}
          className="mt-4 block text-sm text-muted-foreground"
        >
          {formatDate(date, loc)}
        </time>
        {localized.excerpt && (
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {localized.excerpt}
          </p>
        )}
        {hero && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={hero.url}
              alt={hero.alt || localized.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
        <div className="mt-10">
          <MarkdownLite content={localized.content} />
        </div>
      </div>
    </article>
  );
}
