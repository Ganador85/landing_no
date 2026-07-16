"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";
import type { CmsProject } from "@/lib/cms-content";
import { optimizeRemoteImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  projects: CmsProject[];
};

export function ReferencesSection({ projects }: Props) {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section id="referanser" className="section-pad bg-background-elevated/40">
      <div className="container-narrow">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{copy.references.eyebrow}</p>
              <h2 className="heading-display mt-3 text-balance">{copy.references.title}</h2>
              <p className="mt-4 max-w-xl text-muted-foreground">{copy.references.subtitle}</p>
              <p className="mt-2 max-w-xl text-xs text-muted-foreground/80">{copy.references.note}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous"
                disabled={!canPrev}
                onClick={() => emblaApi?.scrollPrev()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next"
                disabled={!canNext}
                onClick={() => emblaApi?.scrollNext()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 disabled:opacity-30"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-muted-foreground md:hidden">{copy.references.swipe}</p>

        <div className="mt-8 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {projects.map((project) => (
              <article
                key={project.id}
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[60%] lg:basis-[42%]"
              >
                <div className="surface-card overflow-hidden">
                  <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2">
                    {project.stages.map((stage, idx) => (
                      <div
                        key={`${project.id}-${idx}`}
                        className="relative aspect-[4/3] overflow-hidden bg-black/40"
                      >
                        <Image
                          src={optimizeRemoteImageUrl(stage.image, {
                            width: 900,
                            quality: 72,
                          })}
                          alt={stage.caption[locale]}
                          fill
                          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 40vw, 360px"
                          className="object-cover"
                          loading="lazy"
                        />
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent",
                          )}
                          aria-hidden
                        />
                        <span className="absolute left-3 top-3 inline-flex rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                          {copy.references[stage.label]}
                        </span>
                        <p className="absolute inset-x-3 bottom-3 text-sm font-medium text-white/95">
                          {stage.caption[locale]}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold">{project.title[locale]}</h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
