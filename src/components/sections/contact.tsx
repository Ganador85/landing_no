"use client";

import { useState } from "react";
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

export function ContactSection() {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initial);
  const [photos, setPhotos] = useState<File[]>([]);

  const typeLabels: Record<InquiryType, string> = {
    takvask: copy.contact.form.typeWash,
    impregnering: copy.contact.form.typeImpregnation,
    takmaling: copy.contact.form.typePaint,
    nytt_tak: copy.contact.form.typeNew,
    usikker: copy.contact.form.typeUnsure,
  };

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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
      const body = new FormData();
      body.set("name", step1.data.name);
      body.set("phone", step1.data.phone);
      body.set("postal", step1.data.postal);
      body.set("type", step1.data.type);
      body.set("locale", locale);
      if (step2.data.email) body.set("email", step2.data.email);
      if (step2.data.address) body.set("address", step2.data.address);
      if (step2.data.roofSize) body.set("roofSize", step2.data.roofSize);
      if (step2.data.message) body.set("message", step2.data.message);
      for (const file of photos.slice(0, 5)) {
        body.append("photos", file);
      }

      const res = await fetch("/api/lead", {
        method: "POST",
        body,
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
      setStep(1);
    } catch {
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
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setPhotos(Array.from(e.target.files || []).slice(0, 5))
                    }
                    className="cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-accent/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent"
                  />
                  <p className="text-xs text-muted-foreground">
                    {copy.contact.form.photosHint}
                    {photos.length > 0 ? ` · ${photos.length}` : ""}
                  </p>
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
