"use client";

import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";

export function TrustBarSection() {
  const copy = usePageCopy();
  const items = copy.trustBar.items.filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section
      aria-label={items.join(" · ")}
      className="relative border-y border-white/[0.06] bg-background-elevated"
    >
      <div className="container-narrow px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <Reveal>
          <ul className="flex flex-wrap items-center justify-center gap-x-0 gap-y-2 text-center text-[11px] font-medium tracking-wide text-muted-foreground sm:text-xs md:text-[13px]">
            {items.map((label, index) => (
              <li key={label} className="inline-flex items-center">
                {index > 0 ? (
                  <span
                    className="mx-2.5 text-accent/50 sm:mx-3.5"
                    aria-hidden
                  >
                    ·
                  </span>
                ) : null}
                <span className="text-foreground/75">{label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
