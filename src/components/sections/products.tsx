"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";
import type { CmsProduct } from "@/lib/cms-content";
import { optimizeRemoteImageUrl } from "@/lib/images";

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
          <h2 className="heading-display mt-3 max-w-2xl text-balance">
            {copy.products.title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            {copy.products.subtitle}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i * 0.06, 0.24)}>
              <article className="surface-card hover:border-accent/25 h-full p-6 transition-colors">
                {product.image ? (
                  <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl bg-black/30">
                    <Image
                      src={optimizeRemoteImageUrl(product.image.url, {
                        width: 900,
                        quality: 80,
                      })}
                      alt={product.image.alt || product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <p className="text-accent text-xs font-semibold tracking-wider uppercase">
                  {product.category[locale]}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {product.description[locale]}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {product.badges[locale].map((badge) => (
                    <li
                      key={badge}
                      className="text-muted-foreground rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
                    >
                      {badge}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          {copy.products.footer}
        </p>
      </div>
    </section>
  );
}
