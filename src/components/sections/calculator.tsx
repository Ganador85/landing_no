"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { usePageCopy } from "@/components/site-settings-provider";
import type { CmsSettings } from "@/lib/cms-content";
import { siteConfig } from "@/lib/site";
import { formatNok } from "@/lib/utils";

type Props = {
  calculator?: CmsSettings["calculator"];
};

export function CalculatorSection({
  calculator = siteConfig.calculator,
}: Props) {
  const copy = usePageCopy();
  const locale = useLocale();
  const { minSqm, maxSqm, defaultSqm, newRoofPerSqm, renewalPerSqm } = calculator;
  const [sqm, setSqm] = useState(defaultSqm);

  const { newRoof, renewal, save, percent } = useMemo(() => {
    const newRoofCost = sqm * newRoofPerSqm;
    const renewalCost = sqm * renewalPerSqm;
    const saveAmount = newRoofCost - renewalCost;
    const pct = Math.round((saveAmount / newRoofCost) * 100);
    return {
      newRoof: newRoofCost,
      renewal: renewalCost,
      save: saveAmount,
      percent: pct,
    };
  }, [sqm, newRoofPerSqm, renewalPerSqm]);

  return (
    <section id="kalkulator" className="section-pad bg-background-elevated/50">
      <div className="container-narrow">
        <Reveal>
          <p className="eyebrow">{copy.calculator.eyebrow}</p>
          <h2 className="heading-display mt-3 text-balance">{copy.calculator.title}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{copy.calculator.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="surface-card mt-10 overflow-hidden p-5 sm:p-8 lg:p-10">
            <p className="text-sm text-muted-foreground">{copy.calculator.hint}</p>

            <div className="mt-6">
              <div className="mb-3 flex items-end justify-between gap-4">
                <label htmlFor="roof-size" className="text-sm font-medium">
                  {copy.calculator.sizeLabel}
                </label>
                <span className="text-2xl font-bold tabular-nums text-accent sm:text-3xl">
                  {sqm} m²
                </span>
              </div>
              <input
                id="roof-size"
                type="range"
                min={minSqm}
                max={maxSqm}
                step={5}
                value={sqm}
                onChange={(e) => setSqm(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-lg"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{minSqm} m²</span>
                <span>{maxSqm} m²</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-muted-foreground">{copy.calculator.newRoof}</p>
                <p className="mt-2 text-xl font-bold tabular-nums line-through decoration-white/30 sm:text-2xl">
                  <CountUp
                    value={newRoof}
                    formatter={(n) => formatNok(n, locale)}
                  />
                </p>
              </div>
              <div className="rounded-2xl border border-accent/30 bg-accent-soft p-5">
                <p className="text-sm text-accent">{copy.calculator.renewal}</p>
                <p className="mt-2 text-xl font-bold tabular-nums text-accent sm:text-2xl">
                  <CountUp
                    value={renewal}
                    formatter={(n) => formatNok(n, locale)}
                  />
                </p>
              </div>
              <div className="rounded-2xl border border-success/30 bg-success/10 p-5">
                <p className="text-sm text-success">{copy.calculator.youSave}</p>
                <p className="mt-2 text-xl font-bold tabular-nums text-success sm:text-2xl">
                  <CountUp
                    value={save}
                    formatter={(n) => formatNok(n, locale)}
                  />
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-lg font-semibold text-foreground">
              {copy.calculator.cheaper.replace("{percent}", String(percent))}
            </p>
            <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
              {copy.calculator.disclaimer}
            </p>

            <div className="mt-8 flex justify-center">
              <Button asChild size="lg">
                <Link href="/#kontakt">{copy.calculator.cta}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
