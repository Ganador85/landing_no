import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import { getPosts, localizeContent } from "@/lib/cms-pages";
import { siteConfig, type Locale } from "@/lib/site";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const title = loc === "no" ? "Blogg" : "Blog";
  const description =
    loc === "no"
      ? "Råd og nyheter om takfornyelse, vedlikehold og produkter."
      : "Advice and news about roof renewal, maintenance, and products.";

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blogg`,
      languages: Object.fromEntries(
        routing.locales.map((language) => [
          language,
          `${siteConfig.url}/${language}/blogg`,
        ]),
      ),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/${locale}/blogg`,
    },
  };
}

function formatDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "no" ? "nb-NO" : "en-GB", {
    dateStyle: "long",
  }).format(new Date(value));
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const posts = await getPosts();

  return (
    <section className="section-pad">
      <div className="container-narrow">
        <p className="eyebrow">
          <Link href="/" className="hover:text-accent-hover">
            {loc === "no" ? "Forside" : "Home"}
          </Link>
        </p>
        <h1 className="heading-display mt-3">
          {loc === "no" ? "Blogg" : "Blog"}
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {loc === "no"
            ? "Råd og nyheter om takfornyelse, vedlikehold og produkter."
            : "Advice and news about roof renewal, maintenance, and products."}
        </p>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {posts.map((post) => {
              const localized = localizeContent(post, loc);
              const date = post.publishedAt || post.createdAt;

              return (
                <article key={String(post.id)} className="surface-card p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={date}>{formatDate(date, loc)}</time>
                    {post._status === "draft" && (
                      <span className="rounded-full border border-accent/40 px-2 py-0.5 text-xs font-semibold text-accent">
                        Draft
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    <Link
                      href={`/blogg/${post.slug}`}
                      className="transition-colors hover:text-accent"
                    >
                      {localized.title}
                    </Link>
                  </h2>
                  {localized.excerpt && (
                    <p className="mt-3 leading-7 text-muted-foreground">
                      {localized.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blogg/${post.slug}`}
                    className="mt-6 inline-flex text-sm font-semibold text-accent hover:text-accent-hover"
                  >
                    {loc === "no" ? "Les mer" : "Read more"}
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="surface-card mt-10 p-6 text-muted-foreground">
            {loc === "no"
              ? "Ingen publiserte innlegg ennå."
              : "No published posts yet."}
          </p>
        )}
      </div>
    </section>
  );
}
