"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";
import { siteImages } from "@/content/images";
import { optimizeRemoteImageUrl } from "@/lib/images";

type Props = {
  imageUrl?: string;
};

export function NewRoofSection({ imageUrl = siteImages.newRoof }: Props) {
  const copy = usePageCopy();
  const src = optimizeRemoteImageUrl(imageUrl, { width: 1200, quality: 75 });

  return (
    <section id="nytt-tak" className="section-pad">
      <div className="container-narrow grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{copy.newRoof.eyebrow}</p>
          <h2 className="heading-display mt-3 text-balance">{copy.newRoof.title}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{copy.newRoof.subtitle}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{copy.newRoof.body}</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/#kontakt">{copy.newRoof.cta}</Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[4/3]">
              <Image
                src={src}
                alt={copy.newRoof.title}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="surface-card rounded-none border-0 p-6 sm:p-8">
              <h3 className="text-lg font-semibold">{copy.newRoof.typesTitle}</h3>
              <ul className="mt-5 space-y-3">
                {copy.newRoof.types.map((type) => (
                  <li key={type} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check className="size-3" />
                    </span>
                    {type}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-muted-foreground">
                {copy.newRoof.note}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
