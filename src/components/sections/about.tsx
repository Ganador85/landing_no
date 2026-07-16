"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy, useSiteSettings } from "@/components/site-settings-provider";
import type { CmsSettings } from "@/lib/cms-content";
import { siteImages } from "@/content/images";

type Props = {
  imageUrl?: string;
  settings?: CmsSettings;
};

export function AboutSection({ imageUrl, settings: settingsProp }: Props) {
  const copy = usePageCopy();
  const ctx = useSiteSettings();
  const settings = settingsProp ?? ctx;
  const image = imageUrl ?? settings.images.about ?? siteImages.about;

  return (
    <section id="om-oss" className="section-pad">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 lg:mb-10">
              <img
                src={image}
                alt={copy.about.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <p className="eyebrow">{copy.about.eyebrow}</p>
            <h2 className="heading-display mt-3 text-balance">{copy.about.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{copy.about.subtitle}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>{copy.about.p1}</p>
              <p>{copy.about.p2}</p>
              <p>{copy.about.p3}</p>
              <p className="text-foreground/90">{copy.about.parent}</p>
            </div>
            <Button asChild size="lg" className="mt-8">
              <Link href="/#kontakt">{copy.about.cta}</Link>
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.about.stats.map((stat) => (
                <div key={stat.title} className="surface-card p-5">
                  <p className="font-semibold text-accent">{stat.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.desc}</p>
                </div>
              ))}
            </div>

            <div className="surface-card mt-4 p-6">
              <h3 className="font-semibold">{copy.about.company.title}</h3>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{copy.about.company.org}</dt>
                  <dd className="font-medium">{settings.orgNr}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{copy.about.company.phone}</dt>
                  <dd className="font-medium">
                    <a href={settings.phoneHref} className="hover:text-accent">
                      {settings.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{copy.about.company.email}</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${settings.email}`} className="hover:text-accent">
                      {settings.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{copy.about.company.address}</dt>
                  <dd className="font-medium">
                    {settings.address.street}, {settings.address.postal}{" "}
                    {settings.address.city}
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
