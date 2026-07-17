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

const leadSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(5),
  postal: z.string().trim().min(3),
  type: z.enum(["vedlikehold", "nytt_tak", "kledning"]),
  message: z.string().trim().optional(),
});

type FormState = {
  name: string;
  phone: string;
  postal: string;
  type: "vedlikehold" | "nytt_tak" | "kledning";
  message: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  postal: "",
  type: "vedlikehold",
  message: "",
};

export function ContactSection() {
  const copy = usePageCopy();
  const locale = useLocale();
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(initial);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = leadSchema.safeParse({
      name: form.name,
      phone: form.phone,
      postal: form.postal,
      type: form.type,
      message: form.message || undefined,
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
        body: JSON.stringify({
          ...parsed.data,
          message: parsed.data.message || (locale === "no" ? "Ønsker kontakt" : "Request contact"),
          locale,
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
            <div className="space-y-2">
              <Label htmlFor="name">{copy.contact.form.name} *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder={copy.contact.form.name}
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
                placeholder={copy.contact.form.phone}
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
                placeholder={copy.contact.form.postal}
                autoComplete="postal-code"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">{copy.contact.form.type} *</Label>
              <select
                id="type"
                value={form.type}
                onChange={(e) =>
                  update("type", e.target.value as FormState["type"])
                }
                className="flex h-11 w-full rounded-xl border border-white/10 bg-black/30 px-3 text-sm text-foreground outline-none focus-visible:border-accent/50 focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                <option value="vedlikehold">{copy.contact.form.typeRenewal}</option>
                <option value="nytt_tak">{copy.contact.form.typeNew}</option>
                <option value="kledning">{copy.contact.form.typeCladding}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{copy.contact.form.message}</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder={copy.contact.form.message}
                rows={3}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? copy.contact.form.sending : copy.contact.form.submit}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
