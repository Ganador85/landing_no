"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function NewRoofSection() {
  const t = useTranslations("newRoof");
  const types = t.raw("types") as string[];

  return (
    <section id="nytt-tak" className="section-pad">
      <div className="container-narrow grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="heading-display mt-3 text-balance">{t("title")}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("subtitle")}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("body")}</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/#kontakt">{t("cta")}</Link>
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="surface-card p-6 sm:p-8">
            <h3 className="text-lg font-semibold">{t("typesTitle")}</h3>
            <ul className="mt-5 space-y-3">
              {types.map((type) => (
                <li key={type} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Check className="size-3" />
                  </span>
                  {type}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-muted-foreground">
              {t("note")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
