"use client";

import { Shield, Star, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";
import { siteImages } from "@/content/images";

type Props = {
  heroImage?: string;
};

export function HeroSection({ heroImage = siteImages.hero }: Props) {
  const copy = usePageCopy();

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden pb-28 pt-28 md:items-center md:pb-20 md:pt-24">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${heroImage}')`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-overlay)" }}
        aria-hidden
      />
      <div className="grain absolute inset-0 opacity-60" aria-hidden />

      <div className="container-narrow relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent sm:text-sm">
            <Star className="size-3.5 shrink-0 fill-accent" />
            <span className="truncate">{copy.hero.badge}</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {copy.hero.title}{" "}
            <span className="text-accent">{copy.hero.titleAccent}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {copy.hero.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href="/#kontakt">{copy.hero.cta}</Link>
            </Button>
            <Button asChild size="xl" variant="secondary" className="w-full sm:w-auto">
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

      <div
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/40 md:bottom-8 md:block"
        aria-hidden
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
