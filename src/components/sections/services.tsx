"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Droplets,
  Home,
  Paintbrush,
  Shield,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { type ServiceKey } from "@/content/site-content";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  inspection: CheckCircle2,
  tiles: Wrench,
  wash: Droplets,
  impregnation: Sparkles,
  paint: Paintbrush,
  maintenance: Wrench,
  warranty: Shield,
  newRoof: Home,
  softwash: Droplets,
};

export function ServicesSection() {
  const t = useTranslations("services");
  const [expanded, setExpanded] = useState(false);

  const primaryKeys: ServiceKey[] = [
    "inspection",
    "tiles",
    "wash",
    "impregnation",
    "paint",
  ];
  const secondaryKeys: ServiceKey[] = [
    "maintenance",
    "warranty",
    "newRoof",
    "softwash",
  ];
  const visible = expanded ? [...primaryKeys, ...secondaryKeys] : primaryKeys;

  return (
    <section id="tjenester" className="section-pad relative">
      <div className="absolute inset-0 bg-[var(--surface-glow)]" aria-hidden />
      <div className="container-narrow relative">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="heading-display mt-3 max-w-2xl text-balance">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((key, i) => {
            const Icon = icons[key] || CheckCircle2;
            return (
              <Reveal key={key} delay={Math.min(i * 0.05, 0.25)}>
                <article className="group surface-card h-full p-5 transition-all duration-300 hover:border-accent/30 hover:bg-background-elevated sm:p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform group-hover:scale-105">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{t(`items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`items.${key}.description`)}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            variant="secondary"
            onClick={() => setExpanded((v) => !v)}
            className={cn("min-w-[200px]")}
          >
            {expanded ? t("showLess") : t("showMore")}
          </Button>
        </div>
      </div>
    </section>
  );
}
