"use client";

import Image from "next/image";
import { Shield, Star, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TrustBarSection } from "@/components/sections/trust-bar";
import { usePageCopy } from "@/components/site-settings-provider";
import { siteImages } from "@/content/images";
import { optimizeRemoteImageUrl } from "@/lib/images";

type Props = {
  heroImage?: string;
};

/** Keep "70 %" together; on mobile wrap after it, on desktop keep one line. */
function HeroTitle({ title }: { title: string }) {
  const match = title.match(/^(.*?70[\u00a0\s]?%)\s*(.+)$/i);
  const lead = match?.[1] ?? title;
  const rest = match?.[2] ?? "";

  return (
    <span className="block md:whitespace-nowrap">
      <span className="whitespace-nowrap">{lead}</span>
      {rest ? <span>{` ${rest}`}</span> : null}
    </span>
  );
}

export function HeroSection({ heroImage = siteImages.hero }: Props) {
  const copy = usePageCopy();
  const src = optimizeRemoteImageUrl(heroImage, { width: 2000, quality: 72 });

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-24">
      <Image
        src={src}
        alt={`${copy.hero.title} ${copy.hero.titleAccent}`}
        width={2000}
        height={1125}
        priority
        sizes="100vw"
        quality={72}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
        aria-hidden
      />
      <div className="grain absolute inset-0 opacity-60" aria-hidden />

      <div className="container-narrow relative z-10 flex w-full flex-1 flex-col justify-end px-4 pb-8 sm:px-6 md:justify-center md:pb-10 lg:px-8">
        {copy.hero.badge ? (
          <Reveal>
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent sm:text-sm">
              <Star className="size-3.5 shrink-0 fill-accent" />
              <span className="truncate">{copy.hero.badge}</span>
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.08}>
          <h1 className="max-w-4xl text-3xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:max-w-5xl lg:text-6xl xl:text-[4.25rem]">
            <HeroTitle title={copy.hero.title} />
            {copy.hero.titleAccent ? (
              <span className="mt-2 block text-[0.72em] font-semibold text-accent sm:mt-3">
                {copy.hero.titleAccent}
              </span>
            ) : null}
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {copy.hero.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
            <Button asChild size="lg" className="h-11 w-full rounded-lg shadow-md shadow-accent/15 sm:h-12 sm:w-auto sm:rounded-xl">
              <Link href="/#kontakt">{copy.hero.cta}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-11 w-full rounded-lg border border-white/15 bg-transparent text-white/90 hover:bg-white/8 sm:h-12 sm:w-auto sm:rounded-xl"
            >
              <Link href="/#tjenester">{copy.hero.ctaSecondary}</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.28}>
          <ul className="mt-10 grid grid-cols-3 gap-2 sm:gap-4 md:max-w-xl">
            {[
              { icon: Shield, label: copy.hero.trustWarranty },
              { icon: Users, label: copy.hero.trustCustomers },
              { icon: Star, label: copy.hero.trustRating },
            ].map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-black/30 px-2 py-3 text-center backdrop-blur-sm sm:flex-row sm:items-center sm:justify-center sm:gap-2 sm:px-3"
              >
                <Icon className="size-4 shrink-0 text-accent" />
                <span className="text-[10px] font-medium leading-tight text-white/90 sm:text-xs">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* First-viewport trust strip – sits above mobile sticky CTA */}
      <div className="relative z-10 mb-[calc(3.25rem+env(safe-area-inset-bottom))] md:mb-0">
        <TrustBarSection variant="hero" />
      </div>
    </section>
  );
}
