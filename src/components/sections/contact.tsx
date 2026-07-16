"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site";

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().min(2),
  houseNumber: z.string().min(1),
  postal: z.string().min(3),
  city: z.string().min(2),
  type: z.enum(["vedlikehold", "nytt_tak", "kledning"]),
  message: z.string().min(10),
  website: z.string().max(0).optional().or(z.literal("")),
});

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
  website: string;
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
  website: "",
};

export function ContactSection() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initial);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    if (!form.name || !form.email || !form.address || !form.houseNumber) {
      toast.error(t("form.required"));
      return;
    }
    setStep(2);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = leadSchema.safeParse({
      ...form,
      phone: form.phone || undefined,
    });

    if (!parsed.success) {
      toast.error(t("form.required"));
      return;
    }

    if (parsed.data.website) {
      toast.success(t("form.success"));
      setForm(initial);
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, locale }),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success(t("form.success"));
      setForm(initial);
      setStep(1);
    } catch {
      toast.error(t("form.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="kontakt" className="section-pad bg-background-elevated/50">
      <div className="container-narrow grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="heading-display mt-3 text-balance">{t("title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>

          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{t("phone")}</p>
                <a href={siteConfig.phoneHref} className="text-lg font-semibold hover:text-accent">
                  {siteConfig.phone}
                </a>
                <p className="text-xs text-muted-foreground">{t("hours")}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{t("email")}</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-lg font-semibold hover:text-accent"
                >
                  {siteConfig.email}
                </a>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {t("reply")}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">{t("office")}</p>
                <p className="font-semibold">
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.postal} {siteConfig.address.city}
                </p>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="surface-card space-y-4 p-5 sm:p-8">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden
            />

            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">{t("form.name")} *</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder={t("form.name")}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("form.phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder={t("form.phone")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("form.email")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder={t("form.email")}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
                  <div className="space-y-2">
                    <Label htmlFor="address">{t("form.address")} *</Label>
                    <Input
                      id="address"
                      required
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder={t("form.address")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="houseNumber">{t("form.houseNumber")} *</Label>
                    <Input
                      id="houseNumber"
                      required
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
                    <Label htmlFor="postal">{t("form.postal")} *</Label>
                    <Input
                      id="postal"
                      required
                      value={form.postal}
                      onChange={(e) => update("postal", e.target.value)}
                      placeholder="1394"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("form.city")} *</Label>
                    <Input
                      id="city"
                      required
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder={t("form.city")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{t("form.type")}</Label>
                  <select
                    id="type"
                    required
                    value={form.type}
                    onChange={(e) =>
                      update("type", e.target.value as FormState["type"])
                    }
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <option value="vedlikehold">{t("form.typeRenewal")}</option>
                    <option value="nytt_tak">{t("form.typeNew")}</option>
                    <option value="kledning">{t("form.typeCladding")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("form.message")} *</Label>
                  <Textarea
                    id="message"
                    required
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder={t("form.message")}
                  />
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
                    {loading ? t("form.sending") : t("form.submit")}
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
