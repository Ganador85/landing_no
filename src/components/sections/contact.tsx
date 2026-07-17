"use client";

import { useRef, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy, useSiteSettings } from "@/components/site-settings-provider";

const MAX_PHOTOS = 15;
const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;
const MAX_EDGE = 1600;
const UPLOAD_CONCURRENCY = 2;

const inquiryTypes = [
  "takvask",
  "impregnering",
  "takmaling",
  "nytt_tak",
  "usikker",
] as const;

type InquiryType = (typeof inquiryTypes)[number];

type PhotoItem = {
  id: string;
  file: File;
  status: "queued" | "uploading" | "ready" | "error";
  url?: string;
  done: Promise<string | null>;
  resolve: (url: string | null) => void;
};

const step1Schema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(5),
  postal: z.string().trim().min(3),
  type: z.enum(inquiryTypes),
});

const step2Schema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional(),
  roofSize: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

type FormState = {
  name: string;
  phone: string;
  postal: string;
  type: InquiryType;
  email: string;
  address: string;
  roofSize: string;
  message: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  postal: "",
  type: "usikker",
  email: "",
  address: "",
  roofSize: "",
  message: "",
};

function photoKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        window.clearTimeout(timer);
        reject(err);
      },
    );
  });
}

async function compressImage(file: File): Promise<File> {
  if (/heic|heif/i.test(file.type) || /\.heic$|\.heif$/i.test(file.name)) {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error("HEIC too large");
    }
    return file;
  }

  if (typeof createImageBitmap !== "function") {
    if (file.size > MAX_UPLOAD_BYTES) throw new Error("too large");
    return file;
  }

  const bitmap = await withTimeout(createImageBitmap(file), 12_000, "decode");
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      if (file.size > MAX_UPLOAD_BYTES) throw new Error("too large");
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);

    let quality = 0.72;
    let blob: Blob | null = null;
    for (let i = 0; i < 4; i += 1) {
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (!blob) break;
      if (blob.size <= MAX_UPLOAD_BYTES) break;
      quality -= 0.12;
    }

    if (!blob) {
      if (file.size > MAX_UPLOAD_BYTES) throw new Error("compress failed");
      return file;
    }

    const base = file.name.replace(/\.[^.]+$/, "") || "tak";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

async function uploadViaServer(file: File): Promise<string> {
  const prepared = await compressImage(file);
  const body = new FormData();
  body.set("file", prepared);

  const res = await withTimeout(
    fetch("/api/lead/photo-upload", { method: "POST", body }),
    45_000,
    "upload",
  );
  const data = (await res.json().catch(() => null)) as
    | { url?: string; downloadUrl?: string; error?: string }
    | null;
  if (!res.ok || !data?.url) {
    throw new Error(data?.error || "Upload failed");
  }
  return data.downloadUrl || data.url;
}

export function ContactSection() {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initial);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photosLimitNotice, setPhotosLimitNotice] = useState<string | null>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PhotoItem[]>([]);
  const queueRef = useRef<PhotoItem[]>([]);
  const activeRef = useRef(0);
  photosRef.current = photos;

  const typeLabels: Record<InquiryType, string> = {
    takvask: copy.contact.form.typeWash,
    impregnering: copy.contact.form.typeImpregnation,
    takmaling: copy.contact.form.typePaint,
    nytt_tak: copy.contact.form.typeNew,
    usikker: copy.contact.form.typeUnsure,
  };

  const ui = {
    choosePhotos: locale === "en" ? "Choose photos" : "Velg bilder",
    noPhotos: locale === "en" ? "No files selected" : "Ingen filer valgt",
    photosSelected: (n: number) =>
      locale === "en"
        ? `${n} photo${n === 1 ? "" : "s"} selected`
        : `${n} bilde${n === 1 ? "" : "r"} valgt`,
    photosTooMany:
      locale === "en"
        ? "We only accept up to 15 photos. Extra files were not added."
        : "Vi tar imot maks 15 bilder. Flere filer ble ikke lagt til.",
    photosLimitInline:
      locale === "en"
        ? "Maximum 15 photos. Extra files were ignored."
        : "Maksimum 15 bilder. Ekstra filer ble ignorert.",
    photoTooLarge:
      locale === "en"
        ? "One or more photos are too large (max 20 MB)"
        : "Ett eller flere bilder er for store (maks 20 MB)",
    photoUploading: locale === "en" ? "Uploading…" : "Laster opp…",
    photoQueued: locale === "en" ? "Waiting…" : "Venter…",
    photoReady: locale === "en" ? "Ready" : "Klar",
    photoFailed: locale === "en" ? "Failed" : "Feilet",
  };

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function patchPhoto(id: string, patch: Partial<PhotoItem>) {
    setPhotos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function pumpQueue() {
    while (activeRef.current < UPLOAD_CONCURRENCY && queueRef.current.length) {
      const item = queueRef.current.shift();
      if (!item) break;
      activeRef.current += 1;
      patchPhoto(item.id, { status: "uploading" });

      void (async () => {
        try {
          const url = await uploadViaServer(item.file);
          patchPhoto(item.id, { status: "ready", url });
          item.resolve(url);
        } catch (err) {
          console.error("Photo upload failed:", err);
          patchPhoto(item.id, { status: "error" });
          item.resolve(null);
        } finally {
          activeRef.current -= 1;
          pumpQueue();
        }
      })();
    }
  }

  function onPhotosSelected(fileList: FileList | null) {
    const all = Array.from(fileList || []);
    const truncated = all.length > MAX_PHOTOS;
    if (truncated) {
      toast.warning(ui.photosTooMany, { duration: 6000 });
      setPhotosLimitNotice(ui.photosLimitInline);
    } else {
      setPhotosLimitNotice(null);
    }

    const nextFiles = all.slice(0, MAX_PHOTOS);
    if (nextFiles.some((file) => file.size > MAX_SOURCE_BYTES)) {
      toast.error(ui.photoTooLarge);
    }

    queueRef.current = [];
    activeRef.current = 0;

    const next: PhotoItem[] = nextFiles
      .filter((file) => file.size <= MAX_SOURCE_BYTES)
      .map((file) => {
        let resolveDone: (url: string | null) => void = () => {};
        const done = new Promise<string | null>((resolve) => {
          resolveDone = resolve;
        });
        return {
          id: photoKey(file),
          file,
          status: "queued" as const,
          done,
          resolve: resolveDone,
        };
      });

    setPhotos(next);
    queueRef.current = [...next];
    pumpQueue();
  }

  function goNext() {
    const parsed = step1Schema.safeParse({
      name: form.name,
      phone: form.phone,
      postal: form.postal,
      type: form.type,
    });
    if (!parsed.success) {
      toast.error(copy.contact.form.required);
      return;
    }
    setStep(2);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const step1 = step1Schema.safeParse({
      name: form.name,
      phone: form.phone,
      postal: form.postal,
      type: form.type,
    });
    if (!step1.success) {
      setStep(1);
      toast.error(copy.contact.form.required);
      return;
    }

    const step2 = step2Schema.safeParse({
      email: form.email,
      address: form.address,
      roofSize: form.roofSize,
      message: form.message,
    });
    if (!step2.success) {
      const issue = step2.error.issues[0];
      toast.error(
        issue?.path[0] === "email"
          ? copy.contact.form.invalidEmail
          : copy.contact.form.required,
      );
      return;
    }

    setLoading(true);
    try {
      const current = photosRef.current;
      const settled = await Promise.all(current.map((p) => p.done));
      const photoUrls = settled.filter((url): url is string => Boolean(url));
      const failed = settled.length - photoUrls.length;

      if (current.length && !photoUrls.length) {
        throw new Error("All photo uploads failed");
      }

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: step1.data.name,
          phone: step1.data.phone,
          postal: step1.data.postal,
          type: step1.data.type,
          locale,
          email: step2.data.email || undefined,
          address: step2.data.address || undefined,
          roofSize: step2.data.roofSize || undefined,
          message: step2.data.message || undefined,
          photoUrls: photoUrls.length ? photoUrls : undefined,
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed");
      }

      toast.success(copy.contact.form.success);
      if (failed > 0 && photoUrls.length) {
        toast.message(
          locale === "en"
            ? "Enquiry sent. Some photos could not be uploaded."
            : "Henvendelsen er sendt. Noen bilder kunne ikke lastes opp.",
        );
      }
      setForm(initial);
      setPhotos([]);
      setPhotosLimitNotice(null);
      queueRef.current = [];
      if (photosInputRef.current) photosInputRef.current.value = "";
      setStep(1);
    } catch (err) {
      console.error("Lead submit failed:", err);
      toast.error(copy.contact.form.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="kontakt" className="section-pad bg-background-elevated/50">
      <div className="container-narrow grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{copy.contact.eyebrow}</p>
          <h2 className="heading-display mt-3 text-balance">{copy.contact.title}</h2>
          <p className="mt-4 text-muted-foreground">{copy.contact.subtitle}</p>

          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{copy.contact.phone}</p>
                <a href={settings.phoneHref} className="text-lg font-semibold hover:text-accent">
                  {settings.phone}
                </a>
                <p className="text-xs text-muted-foreground">{copy.contact.hours}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{copy.contact.email}</p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-lg font-semibold hover:text-accent"
                >
                  {settings.email}
                </a>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {copy.contact.reply}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{copy.contact.office}</p>
                <p className="font-semibold">
                  {settings.address.street}
                  <br />
                  {settings.address.postal} {settings.address.city}
                </p>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="surface-card space-y-4 p-5 sm:p-8" noValidate>
            <p className="text-xs text-muted-foreground">
              {copy.contact.form.step.replace("{n}", String(step))}
            </p>

            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">{copy.contact.form.name} *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{copy.contact.form.phone} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal">{copy.contact.form.postal} *</Label>
                  <Input
                    id="postal"
                    value={form.postal}
                    onChange={(e) => update("postal", e.target.value)}
                    autoComplete="postal-code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{copy.contact.form.type} *</Label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) => update("type", e.target.value as InquiryType)}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-foreground outline-none focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/30"
                  >
                    {inquiryTypes.map((value) => (
                      <option key={value} value={value}>
                        {typeLabels[value]}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="button" size="lg" className="w-full" onClick={goNext}>
                  {copy.contact.form.next}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">{copy.contact.form.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{copy.contact.form.address}</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    autoComplete="street-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roofSize">{copy.contact.form.roofSize}</Label>
                  <Input
                    id="roofSize"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={form.roofSize}
                    onChange={(e) => update("roofSize", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photos">{copy.contact.form.photos}</Label>
                  <input
                    ref={photosInputRef}
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => onPhotosSelected(e.target.files)}
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={loading}
                      onClick={() => photosInputRef.current?.click()}
                    >
                      {ui.choosePhotos}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {photos.length ? ui.photosSelected(photos.length) : ui.noPhotos}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {copy.contact.form.photosHint}
                  </p>
                  {photosLimitNotice ? (
                    <p className="text-xs font-medium text-accent" role="status">
                      {photosLimitNotice}
                    </p>
                  ) : null}
                  {photos.length > 0 ? (
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {photos.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="truncate">{item.file.name}</span>
                          <span
                            className={
                              item.status === "ready"
                                ? "shrink-0 text-accent"
                                : item.status === "error"
                                  ? "shrink-0 text-red-400"
                                  : "shrink-0"
                            }
                          >
                            {item.status === "ready"
                              ? ui.photoReady
                              : item.status === "error"
                                ? ui.photoFailed
                                : item.status === "queued"
                                  ? ui.photoQueued
                                  : ui.photoUploading}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{copy.contact.form.message}</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    disabled={loading}
                    onClick={() => setStep(1)}
                  >
                    {copy.contact.form.back}
                  </Button>
                  <Button type="submit" size="lg" className="w-full flex-1" disabled={loading}>
                    {loading ? copy.contact.form.sending : copy.contact.form.submit}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
