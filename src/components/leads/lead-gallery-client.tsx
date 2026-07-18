"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  leadId: string;
  token: string;
  photoUrls: string[];
};

function blobSrc(leadId: string, token: string, url: string, download = false) {
  const params = new URLSearchParams({
    id: leadId,
    token,
    url,
  });
  if (download) params.set("download", "1");
  return `/api/lead/blob?${params.toString()}`;
}

export function LeadGalleryClient({ leadId, token, photoUrls }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => {
    setLightbox((i) => (i === null ? i : (i + photoUrls.length - 1) % photoUrls.length));
  }, [photoUrls.length]);
  const next = useCallback(() => {
    setLightbox((i) => (i === null ? i : (i + 1) % photoUrls.length));
  }, [photoUrls.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, close, prev, next]);

  const downloadOne = (url: string, index: number) => {
    const a = document.createElement("a");
    a.href = blobSrc(leadId, token, url, true);
    a.download = `takfornyelse-lead-${leadId}-${index + 1}.jpg`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadAll = async () => {
    for (let i = 0; i < photoUrls.length; i += 1) {
      downloadOne(photoUrls[i], i);
      // Stagger so browsers don't block multiple downloads
      await new Promise((r) => setTimeout(r, 350));
    }
  };

  if (!photoUrls.length) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-muted-foreground">
        Ingen bilder vedlagt.
      </p>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {photoUrls.length} {photoUrls.length === 1 ? "bilde" : "bilder"}
        </p>
        <button
          type="button"
          onClick={() => void downloadAll()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          <Download className="size-4" />
          Last ned alle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photoUrls.map((url, i) => (
          <div
            key={url}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40"
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="block w-full"
              aria-label={`Åpne bilde ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blobSrc(leadId, token, url)}
                alt={`Bilde ${i + 1}`}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
            <button
              type="button"
              onClick={() => downloadOne(url, i)}
              className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm hover:bg-black/85"
            >
              <Download className="size-3" />
              Last ned
            </button>
          </div>
        ))}
      </div>

      {lightbox !== null ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Bildegalleri"
        >
          <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <p className="text-sm text-white/80">
              {lightbox + 1} / {photoUrls.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => downloadOne(photoUrls[lightbox], lightbox)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 text-sm text-white"
              >
                <Download className="size-4" />
                Last ned
              </button>
              <button
                type="button"
                aria-label="Lukk"
                onClick={close}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blobSrc(leadId, token, photoUrls[lightbox])}
              alt={`Bilde ${lightbox + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            {photoUrls.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Forrige"
                  onClick={prev}
                  className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  aria-label="Neste"
                  onClick={next}
                  className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
