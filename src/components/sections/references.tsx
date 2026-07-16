"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  src: string;
  alt: string;
  label: string;
} | null;

function useClickWithoutDrag(onActivate: () => void) {
  const origin = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      origin.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!origin.current) return;
      const dx = Math.abs(e.clientX - origin.current.x);
      const dy = Math.abs(e.clientY - origin.current.y);
      origin.current = null;
      if (dx < 10 && dy < 10) onActivate();
    },
    onPointerCancel: () => {
      origin.current = null;
    },
  };
}

function useCarouselWheel(
  emblaApi: ReturnType<typeof useEmblaCarousel>[1],
  targetRef?: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!emblaApi) return;
    const root = targetRef?.current ?? emblaApi.rootNode();
    if (!root) return;

    let lockedUntil = 0;

    const onWheel = (event: WheelEvent) => {
      const dominantX = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = dominantX ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 6) return;

      const goingNext = delta > 0;
      if (goingNext && !emblaApi.canScrollNext()) return;
      if (!goingNext && !emblaApi.canScrollPrev()) return;

      event.preventDefault();

      const now = Date.now();
      if (now < lockedUntil) return;
      lockedUntil = now + 280;

      if (goingNext) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [emblaApi, targetRef]);
}

export function ReferencesSection({ projects }: Props) {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";
  const sectionRef = useRef<HTMLElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    watchDrag: true,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  useCarouselWheel(emblaApi, sectionRef);

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

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <section
      id="referanser"
      ref={sectionRef}
      className="section-pad bg-background-elevated/40"
    >
      <div className="container-narrow">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{copy.references.eyebrow}</p>
              <h2 className="heading-display mt-3 text-balance">{copy.references.title}</h2>
              <p className="mt-4 max-w-xl text-muted-foreground">{copy.references.subtitle}</p>
              {copy.references.note ? (
                <p className="mt-2 max-w-xl text-xs text-muted-foreground/80">{copy.references.note}</p>
              ) : null}
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

        <p className="mt-4 text-xs text-muted-foreground">
          {locale === "no"
            ? "Dra med musen eller bruk hjulet for å bla · på mobil: sveip"
            : "Drag with the mouse or use the scroll wheel · on mobile: swipe"}
        </p>

        <div className="mt-8 cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                locale={locale}
                labelFor={(label) => copy.references[label]}
                onOpen={(stage) =>
                  setLightbox({
                    src: optimizeRemoteImageUrl(stage.image, { width: 1600, quality: 82 }),
                    alt: stage.caption[locale],
                    label: copy.references[stage.label],
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="size-5" />
          </button>
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1600}
              height={1200}
              className="h-auto max-h-[90vh] w-full object-contain"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4">
              <span className="inline-flex rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90">
                {lightbox.label}
              </span>
              <p className="mt-2 text-sm font-medium text-white">{lightbox.alt}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProjectCard({
  project,
  locale,
  labelFor,
  onOpen,
}: {
  project: CmsProject;
  locale: "no" | "en";
  labelFor: (label: Stage["label"]) => string;
  onOpen: (stage: Stage) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    watchDrag: true,
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
    <article className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[60%] lg:basis-[42%]">
      <div className="surface-card overflow-hidden">
        <div className="relative">
          <div className="cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
            <div className="flex">
              {project.stages.map((stage, idx) => (
                <StageSlide
                  key={`${project.id}-${idx}`}
                  stage={stage}
                  locale={locale}
                  label={labelFor(stage.label)}
                  onOpen={() => onOpen(stage)}
                />
              ))}
            </div>
          </div>

          {project.stages.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous photos"
                disabled={!canPrev}
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next photos"
                disabled={!canNext}
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-2 top-1/2 z-10 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm disabled:pointer-events-none disabled:opacity-0"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          ) : null}
        </div>

        <div className="p-5">
          <h3 className="font-semibold">{project.title[locale]}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {project.stages.length}{" "}
            {locale === "no" ? "bilder · dra for å se mer" : "photos · drag to see more"}
          </p>
        </div>
      </div>
    </article>
  );
}

function StageSlide({
  stage,
  locale,
  label,
  onOpen,
}: {
  stage: Stage;
  locale: "no" | "en";
  label: string;
  onOpen: () => void;
}) {
  const clickHandlers = useClickWithoutDrag(onOpen);
  const src = optimizeRemoteImageUrl(stage.image, {
    width: 900,
    quality: 72,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      className="group relative aspect-[4/3] min-w-0 shrink-0 grow-0 basis-[88%] cursor-grab overflow-hidden bg-black/40 active:cursor-grabbing sm:basis-[72%]"
      aria-label={stage.caption[locale]}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      {...clickHandlers}
    >
      <Image
        src={src}
        alt={stage.caption[locale]}
        width={900}
        height={675}
        sizes="(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 320px"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        loading="lazy"
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        aria-hidden
      />
      <span className="pointer-events-none absolute left-3 top-3 inline-flex rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
        {label}
      </span>
      <p className="pointer-events-none absolute inset-x-3 bottom-3 text-left text-sm font-medium text-white/95">
        {stage.caption[locale]}
      </p>
    </div>
  );
}
