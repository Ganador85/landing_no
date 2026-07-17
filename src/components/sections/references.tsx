"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";
import type { CmsProject } from "@/lib/cms-content";
import { optimizeRemoteImageUrl } from "@/lib/images";

type Props = {
  projects: CmsProject[];
};

type Stage = CmsProject["stages"][number];

type LightboxState = {
  title: string;
  stages: Stage[];
  index: number;
};

type Pair = {
  before: Stage;
  after: Stage;
};

/** Pair equal before/after counts; leftover photos render as singles (never empty cells). */
function splitStages(stages: Stage[]) {
  const before = stages.filter((s) => s.label === "before");
  const after = stages.filter((s) => s.label === "after");
  const during = stages.filter((s) => s.label === "during");

  const pairCount = Math.min(before.length, after.length);
  const pairs: Pair[] = [];
  for (let i = 0; i < pairCount; i++) {
    pairs.push({ before: before[i], after: after[i] });
  }

  const singles = [...before.slice(pairCount), ...after.slice(pairCount)];

  return { pairs, during, singles };
}

export function ReferencesSection({ projects }: Props) {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const openStage = (project: CmsProject, stage: Stage) => {
    const index = project.stages.indexOf(stage);
    setLightbox({
      title: project.title[locale],
      stages: project.stages,
      index: index >= 0 ? index : 0,
    });
  };

  return (
    <section id="referanser" className="section-pad bg-background-elevated/40">
      <div className="container-narrow">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">{copy.references.eyebrow}</p>
            <h2 className="heading-display mt-3 text-balance">{copy.references.title}</h2>
            <p className="mt-4 text-muted-foreground">{copy.references.subtitle}</p>
            {copy.references.note ? (
              <p className="mt-2 text-xs text-muted-foreground/80">{copy.references.note}</p>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10 space-y-8">
          {projects.map((project, projectIndex) => {
            const { pairs, during, singles } = splitStages(project.stages);

            return (
              <Reveal key={project.id} delay={Math.min(projectIndex * 0.05, 0.2)}>
                <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <div className="border-b border-white/10 px-4 py-4 sm:px-5">
                    <h3 className="font-semibold">{project.title[locale]}</h3>
                    {pairs.length > 0 ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {locale === "no"
                          ? "Venstre: før · Høyre: etter"
                          : "Left: before · Right: after"}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
                    {pairs.map((pair, pairIndex) => (
                      <div
                        key={`${project.id}-pair-${pairIndex}`}
                        className="grid grid-cols-2 gap-2 sm:gap-3"
                      >
                        <PhotoCell
                          stage={pair.before}
                          label={copy.references.before}
                          locale={locale}
                          onOpen={() => openStage(project, pair.before)}
                        />
                        <PhotoCell
                          stage={pair.after}
                          label={copy.references.after}
                          locale={locale}
                          onOpen={() => openStage(project, pair.after)}
                        />
                      </div>
                    ))}

                    {singles.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                        {singles.map((stage, i) => (
                          <PhotoCell
                            key={`${project.id}-single-${i}`}
                            stage={stage}
                            label={copy.references[stage.label]}
                            locale={locale}
                            onOpen={() => openStage(project, stage)}
                            wide
                          />
                        ))}
                      </div>
                    ) : null}

                    {during.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                        {during.map((stage, i) => (
                          <PhotoCell
                            key={`${project.id}-during-${i}`}
                            stage={stage}
                            label={copy.references.during}
                            locale={locale}
                            onOpen={() => openStage(project, stage)}
                            wide
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      {lightbox ? (
        <Lightbox
          title={lightbox.title}
          stages={lightbox.stages}
          startIndex={lightbox.index}
          locale={locale}
          labelFor={(label) => copy.references[label]}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </section>
  );
}

function PhotoCell({
  stage,
  label,
  locale,
  onOpen,
  wide = false,
}: {
  stage: Stage;
  label: string;
  locale: "no" | "en";
  onOpen: () => void;
  wide?: boolean;
}) {
  const src = optimizeRemoteImageUrl(stage.image, { width: 1200, quality: 75 });

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative overflow-hidden rounded-xl bg-black/40 text-left ${
        wide ? "aspect-[16/10] sm:aspect-[4/3]" : "aspect-[4/3]"
      }`}
      aria-label={stage.caption[locale]}
    >
      <Image
        src={src}
        alt={stage.caption[locale]}
        width={1200}
        height={900}
        sizes={wide ? "(max-width: 640px) 100vw, 560px" : "(max-width: 640px) 50vw, 420px"}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        aria-hidden
      />
      <span className="absolute left-2 top-2 inline-flex rounded-md bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:text-[11px]">
        {label}
      </span>
      <p className="absolute inset-x-2 bottom-2 line-clamp-2 text-[11px] font-medium leading-snug text-white/95 sm:inset-x-3 sm:bottom-3 sm:text-sm">
        {stage.caption[locale]}
      </p>
    </button>
  );
}

function Lightbox({
  title,
  stages,
  startIndex,
  locale,
  labelFor,
  onClose,
}: {
  title: string;
  stages: Stage[];
  startIndex: number;
  locale: "no" | "en";
  labelFor: (label: Stage["label"]) => string;
  onClose: () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex,
    align: "center",
    containScroll: false,
    watchDrag: true,
  });
  const [index, setIndex] = useState(startIndex);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(startIndex, true);
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect, startIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [emblaApi, onClose]);

  const stage = stages[index] ?? stages[0];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-white/60">
            {index + 1} / {stages.length}
            {stages.length > 1
              ? locale === "no"
                ? " · sveip for å se mer"
                : " · swipe for more"
              : ""}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {stages.map((item, i) => (
              <div
                key={`${item.image}-${i}`}
                className="relative min-w-0 shrink-0 grow-0 basis-full px-2 sm:px-8"
              >
                <div className="relative mx-auto h-full w-full max-w-5xl">
                  <Image
                    src={optimizeRemoteImageUrl(item.image, { width: 1800, quality: 85 })}
                    alt={item.caption[locale]}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority={i === startIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {stages.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              disabled={!canPrev}
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-1 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white disabled:opacity-0 sm:left-4"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={!canNext}
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-1 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white disabled:opacity-0 sm:right-4"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90">
          {labelFor(stage.label)}
        </span>
        <p className="mt-2 text-sm font-medium text-white">{stage.caption[locale]}</p>
      </div>
    </div>
  );
}
