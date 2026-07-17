"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
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

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 1920;
const JPEG_QUALITY = 0.82;

const inquiryTypes = [
  "takvask",
  "impregnering",
  "takmaling",
  "nytt_tak",
  "usikker",
] as const;

type InquiryType = (typeof inquiryTypes)[number];

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

function isHeic(file: File) {
  return (
    /heic|heif/i.test(file.type) || /\.heic$|\.heif$/i.test(file.name)
  );
}

async function compressForUpload(file: File): Promise<File> {
  if (isHeic(file) || typeof createImageBitmap !== "function") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, "") || "tak";
    return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function guessContentType(file: File) {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".gif")) return "image/gif";
  if (name.endsWith(".heic")) return "image/heic";
  if (name.endsWith(".heif")) return "image/heif";
  return "image/jpeg";
}

export function ContactSection() {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initial);
  const [photos, setPhotos] = useState<File[]>([]);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const typeLabels: Record<InquiryType, string> = {
    takvask: copy.contact.form.typeWash,
    impregnering: copy.contact.form.typeImpregnation,
    takmaling: copy.contact.form.typePaint,
    nytt_tak: copy.contact.form.typeNew,
    usikker: copy.contact.form.typeUnsure,
  };

  const photosTooMany =
    locale === "en"
      ? "Max 5 photos – we kept the first 5"
      : "Maks 5 bilder – vi tok de første 5";
  const photoTooLarge =
    locale === "en"
      ? "One or more photos are too large (max 8 MB)"
      : "Ett eller flere bilder er for store (maks 8 MB)";
  const uploadingLabel = (current: number, total: number) =>
    (locale === "en"
      ? "Uploading photos ({current}/{total})…"
      : "Laster opp bilder ({current}/{total})…"
    )
      .replace("{current}", String(current))
      .replace("{total}", String(total));

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onPhotosSelected(fileList: FileList | null) {
    const all = Array.from(fileList || []);
    if (all.length > MAX_PHOTOS) {
      toast.message(photosTooMany);
    }
    setPhotos(all.slice(0, MAX_PHOTOS));
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
    setStatus(null);
    try {
      const selected = photos.slice(0, MAX_PHOTOS);
      if (selected.some((file) => file.size > MAX_PHOTO_BYTES)) {
        toast.error(photoTooLarge);
        return;
      }

      let photoUrls: string[] = [];
      if (selected.length) {
        setStatus(uploadingLabel(0, selected.length));
        const prepared = await Promise.all(selected.map(compressForUpload));
        const urls: string[] = new Array(prepared.length);
        let done = 0;

        await Promise.all(
          prepared.map(async (file, index) => {
            const safeName = file.name.replace(/[^\w.\-]+/g, "_") || `photo-${index + 1}.jpg`;
            const blob = await upload(`leads/${Date.now()}-${safeName}`, file, {
              access: "public",
              handleUploadUrl: "/api/lead/photo",
              contentType: guessContentType(file),
              multipart: file.size > 4 * 1024 * 1024,
            });
            urls[index] = blob.url;
            done += 1;
            setStatus(uploadingLabel(done, prepared.length));
          }),
        );
        photoUrls = urls.filter(Boolean);
        if (photoUrls.length !== prepared.length) {
          throw new Error("Photo upload incomplete");
        }
      }

      setStatus(copy.contact.form.sending);

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
      setForm(initial);
      setPhotos([]);
      if (photosInputRef.current) photosInputRef.current.value = "";
      setStep(1);
    } catch (err) {
      console.error("Lead submit failed:", err);
      toast.error(copy.contact.form.error);
    } finally {
      setLoading(false);
      setStatus(null);
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
                  <Input
                    ref={photosInputRef}
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => onPhotosSelected(e.target.files)}
                    className="cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-accent/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent"
                  />
                  <p className="text-xs text-muted-foreground">
                    {copy.contact.form.photosHint}
                    {photos.length > 0 ? ` · ${photos.length}` : ""}
                  </p>
                  {photos.length > 0 ? (
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {photos.map((file) => (
                        <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                          {file.name} ({Math.max(1, Math.round(file.size / 1024))} KB)
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
                    {status || (loading ? copy.contact.form.sending : copy.contact.form.submit)}
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
