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

const step1Schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  address: z.string().trim().min(2),
  houseNumber: z.string().trim().min(1),
});

const step2Schema = z.object({
  postal: z.string().trim().min(3),
  city: z.string().trim().min(2),
  type: z.enum(["vedlikehold", "nytt_tak", "kledning"]),
  message: z.string().trim().min(10),
});

const leadSchema = step1Schema.merge(step2Schema);

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  houseNumber: string;
  postal: string;
  city: string;
  type: "vedlikehold" | "nytt_tak" | "kledning";
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  houseNumber: "",
  postal: "",
  city: "",
  type: "vedlikehold",
  message: "",
};

export function ContactSection() {
  const copy = usePageCopy();
  const locale = useLocale();
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initial);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    const parsed = step1Schema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address,
      houseNumber: form.houseNumber,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      if (issue?.path[0] === "email") {
        toast.error(copy.contact.form.invalidEmail);
      } else {
        toast.error(copy.contact.form.required);
      }
      return;
    }

    setStep(2);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const step1 = step1Schema.safeParse({
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      address: form.address,
      houseNumber: form.houseNumber,
    });

    if (!step1.success) {
      setStep(1);
      const issue = step1.error.issues[0];
      toast.error(
        issue?.path[0] === "email" ? copy.contact.form.invalidEmail : copy.contact.form.required,
      );
      return;
    }

    const step2 = step2Schema.safeParse({
      postal: form.postal,
      city: form.city,
      type: form.type,
      message: form.message,
    });

    if (!step2.success) {
      const issue = step2.error.issues[0];
      if (issue?.path[0] === "message") {
        toast.error(copy.contact.form.messageTooShort);
      } else {
        toast.error(copy.contact.form.required);
      }
      return;
    }

    const parsed = leadSchema.safeParse({
      ...step1.data,
      ...step2.data,
    });

    if (!parsed.success) {
      toast.error(copy.contact.form.required);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, locale }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed");
      }

      toast.success(copy.contact.form.success);
      setForm(initial);
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
              {locale === "no" ? `Steg ${step} av 2` : `Step ${step} of 2`}
            </p>

            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">{copy.contact.form.name} *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder={copy.contact.form.name}
                    autoComplete="name"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{copy.contact.form.phone}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder={copy.contact.form.phone}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{copy.contact.form.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="name@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
                  <div className="space-y-2">
                    <Label htmlFor="address">{copy.contact.form.address} *</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder={copy.contact.form.address}
                      autoComplete="street-address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="houseNumber">{copy.contact.form.houseNumber} *</Label>
                    <Input
                      id="houseNumber"
                      value={form.houseNumber}
                      onChange={(e) => update("houseNumber", e.target.value)}
                      placeholder="12"
                    />
                  </div>
                </div>
                <Button type="button" className="w-full" size="lg" onClick={goNext}>
                  {locale === "no" ? "Neste" : "Next"}
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="postal">{copy.contact.form.postal} *</Label>
                    <Input
                      id="postal"
                      value={form.postal}
                      onChange={(e) => update("postal", e.target.value)}
                      placeholder="1182"
                      autoComplete="postal-code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{copy.contact.form.city} *</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder={copy.contact.form.city}
                      autoComplete="address-level2"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{copy.contact.form.type}</Label>
                  <select
                    id="type"
                    value={form.type}
                    onChange={(e) =>
                      update("type", e.target.value as FormState["type"])
                    }
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="vedlikehold">{copy.contact.form.typeRenewal}</option>
                    <option value="nytt_tak">{copy.contact.form.typeNew}</option>
                    <option value="kledning">{copy.contact.form.typeCladding}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{copy.contact.form.message} *</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder={copy.contact.form.message}
                  />
                  <p className="text-xs text-muted-foreground">{copy.contact.form.messageHint}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    {locale === "no" ? "Tilbake" : "Back"}
                  </Button>
                  <Button type="submit" className="flex-1" size="lg" disabled={loading}>
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
