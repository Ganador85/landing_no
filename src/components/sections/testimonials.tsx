"use client";

import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";

export function TestimonialsSection() {
  const copy = usePageCopy();
  const items = copy.testimonials.items.filter((item) => item.quote.trim());

  if (items.length === 0) return null;

  return (
    <section id="omtaler" className="section-pad bg-background-elevated/30">
      <div className="container-narrow">
        <Reveal>
          <p className="eyebrow">{copy.testimonials.eyebrow}</p>
          <h2 className="heading-display mt-3 text-balance">{copy.testimonials.title}</h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={`${item.author}-${i}`} delay={Math.min(i * 0.06, 0.18)}>
              <blockquote className="flex h-full flex-col border-l-2 border-accent/60 pl-5">
                <p className="text-base leading-relaxed text-foreground/90">
                  “{item.quote}”
                </p>
                <footer className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80">{item.author}</span>
                  {item.service ? (
                    <span className="mt-0.5 block text-xs">{item.service}</span>
                  ) : null}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
