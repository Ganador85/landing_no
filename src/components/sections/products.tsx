"use client";

import { useLocale, useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { products } from "@/content/site-content";

export function ProductsSection() {
  const t = useTranslations("products");
  const locale = useLocale() as "no" | "en";

  return (
    <section id="produkter" className="section-pad bg-background-elevated/40">
      <div className="container-narrow">
        <Reveal>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="heading-display mt-3 max-w-2xl text-balance">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i * 0.06, 0.24)}>
              <article className="surface-card h-full p-6 transition-colors hover:border-accent/25">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {product.category[locale]}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {product.description[locale]}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {product.badges[locale].map((badge) => (
                    <li
                      key={badge}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">{t("footer")}</p>
      </div>
    </section>
  );
}
