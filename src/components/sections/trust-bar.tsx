"use client";

import { usePageCopy } from "@/components/site-settings-provider";
import { cn } from "@/lib/utils";

type Props = {
  /** Pin to the bottom of the first viewport (hero). */
  variant?: "hero" | "section";
};

export function TrustBarSection({ variant = "section" }: Props) {
  const copy = usePageCopy();
  const items = copy.trustBar.items.filter(Boolean);
  if (items.length === 0) return null;

  const isHero = variant === "hero";

  return (
    <div
      aria-label={items.join(" · ")}
      className={cn(
        isHero
          ? "relative z-10 border-t border-white/10 bg-black/45 backdrop-blur-md"
          : "relative border-y border-white/[0.06] bg-background-elevated",
      )}
    >
      <div
        className={cn(
          "container-narrow px-4 sm:px-6 lg:px-8",
          isHero ? "py-3 sm:py-3.5" : "py-4 sm:py-5",
        )}
      >
        <ul className="flex flex-wrap items-center justify-center gap-x-0 gap-y-1.5 text-center text-[10px] font-medium tracking-wide sm:text-xs md:text-[13px]">
          {items.map((label, index) => (
            <li key={label} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mx-2 text-accent/60 sm:mx-3.5" aria-hidden>
                  ·
                </span>
              ) : null}
              <span className={isHero ? "text-white/85" : "text-foreground/75"}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
