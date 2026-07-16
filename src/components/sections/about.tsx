"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site";
import { siteImages } from "@/content/images";

export function AboutSection() {
  const t = useTranslations("about");

  const stats = [
    { title: t("stats.roofs"), desc: t("stats.roofsDesc") },
    { title: t("stats.warranty"), desc: t("stats.warrantyDesc") },
    { title: t("stats.area"), desc: t("stats.areaDesc") },
    { title: t("stats.teams"), desc: t("stats.teamsDesc") },
  ];

  return (
    <section id="om-oss" className="section-pad">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 lg:mb-10">
              <img
                src={siteImages.about}
                alt={t("title")}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="heading-display mt-3 text-balance">{t("title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
              <p className="text-foreground/90">{t("parent")}</p>
            </div>
            <Button asChild size="lg" className="mt-8">
              <Link href="/#kontakt">{t("cta")}</Link>
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.title} className="surface-card p-5">
                  <p className="font-semibold text-accent">{stat.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="surface-card mt-4 p-6">
              <h3 className="font-semibold">{t("company.title")}</h3>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t("company.org")}</dt>
                  <dd className="font-medium">{siteConfig.orgNr}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("company.phone")}</dt>
                  <dd className="font-medium">
                    <a href={siteConfig.phoneHref} className="hover:text-accent">
                      {siteConfig.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("company.email")}</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("company.address")}</dt>
                  <dd className="font-medium">
                    {siteConfig.address.street}, {siteConfig.address.postal}{" "}
                    {siteConfig.address.city}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
