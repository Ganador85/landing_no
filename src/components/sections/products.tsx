"use client";

import { useLocale } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";
import type { CmsProduct } from "@/lib/cms-content";

type Props = {
  products: CmsProduct[];
};

export function ProductsSection({ products }: Props) {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";

  return (
    <section id="produkter" className="section-pad bg-background-elevated/40">
      <div className="container-narrow">
        <Reveal>
          <p className="eyebrow">{copy.products.eyebrow}</p>
          <h2 className="heading-display mt-3 max-w-2xl text-balance">{copy.products.title}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{copy.products.subtitle}</p>
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

        <p className="mt-8 text-center text-sm text-muted-foreground">{copy.products.footer}</p>
      </div>
    </section>
  );
}
