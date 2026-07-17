"use client";

import { useLocale } from "next-intl";
import { Reveal } from "@/components/ui/reveal";

const items = {
  no: [
    {
      quote: "God kommunikasjon, ryddig arbeid og taket ble som nytt.",
      author: "Kunde, Oslo",
      service: "Takfornying",
    },
    {
      quote: "Profesjonelt team fra start til slutt. Anbefales!",
      author: "Kunde, Viken",
      service: "Takvask og impregnering",
    },
    {
      quote: "Fast pris, tydelig plan og et resultat vi er svært fornøyde med.",
      author: "Borettslag, Oslo",
      service: "Takfornying – borettslag",
    },
  ],
  en: [
    {
      quote: "Good communication, tidy work and the roof looks like new.",
      author: "Customer, Oslo",
      service: "Roof renewal",
    },
    {
      quote: "Professional team from start to finish. Recommended!",
      author: "Customer, Viken",
      service: "Roof wash and impregnation",
    },
    {
      quote: "Fixed price, a clear plan and a result we are very happy with.",
      author: "Housing association, Oslo",
      service: "Roof renewal – housing association",
    },
  ],
} as const;

export function TestimonialsSection() {
  const locale = useLocale() as "no" | "en";
  const list = items[locale];

  return (
    <section id="omtaler" className="section-pad bg-background-elevated/30">
      <div className="container-narrow">
        <Reveal>
          <p className="eyebrow">{locale === "no" ? "Kundeomtaler" : "Testimonials"}</p>
          <h2 className="heading-display mt-3 text-balance">
            {locale === "no" ? "Hva kundene sier" : "What customers say"}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {list.map((item, i) => (
            <Reveal key={item.author} delay={Math.min(i * 0.06, 0.18)}>
              <blockquote className="flex h-full flex-col border-l-2 border-accent/60 pl-5">
                <p className="text-base leading-relaxed text-foreground/90">
                  “{item.quote}”
                </p>
                <footer className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80">{item.author}</span>
                  <span className="mt-0.5 block text-xs">{item.service}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
