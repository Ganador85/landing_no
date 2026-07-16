"use client";

import { useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";
import { usePageCopy } from "@/components/site-settings-provider";
import type { CmsFaq } from "@/lib/cms-content";

type Props = {
  items: CmsFaq[];
};

export function FaqSection({ items }: Props) {
  const copy = usePageCopy();
  const locale = useLocale() as "no" | "en";

  return (
    <section id="faq" className="section-pad">
      <div className="container-narrow max-w-3xl">
        <Reveal>
          <p className="eyebrow">{copy.faq.eyebrow}</p>
          <h2 className="heading-display mt-3 text-balance">{copy.faq.title}</h2>
          <p className="mt-4 text-muted-foreground">{copy.faq.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-8">
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question[locale]}</AccordionTrigger>
                <AccordionContent>{item.answer[locale]}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
