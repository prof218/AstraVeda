"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HoroscopePeriod } from "@/types";
import { zodiacSigns } from "@/data/horoscopes";
import { PeriodTabs } from "@/components/horoscope/period-tabs";
import { ZodiacCard } from "@/components/horoscope/zodiac-card";
import { SectionHeading, DemoNote } from "@/components/common/section";
import { ButtonLink } from "@/components/ui/button";

export function HoroscopePreview() {
  const [period, setPeriod] = useState<HoroscopePeriod>("daily");

  return (
    <section aria-labelledby="horoscope-title" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="container-cosmic relative">
        <SectionHeading
          id="horoscope-title"
          eyebrow="Horoscope"
          title={<>What the stars hold <em className="text-gradient">for your sign</em></>}
          description="General sun-sign forecasts for reflection. For guidance based on your own chart, book a personal reading."
        >
          <PeriodTabs value={period} onChange={setPeriod} idPrefix="home-horoscope" className="mt-4" />
        </SectionHeading>

        <div id="home-horoscope-panel" role="tabpanel" aria-labelledby={`home-horoscope-tab-${period}`} className="mt-14">
          <AnimatePresence mode="wait">
            <motion.ul
              key={period}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {zodiacSigns.map((z) => (
                <li key={z.slug}><ZodiacCard sign={z} period={period} /></li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <ButtonLink href={`/horoscope?period=${period}`} variant="secondary">
            All horoscopes <ArrowRight className="size-4" />
          </ButtonLink>
          <DemoNote>Sample horoscope content for demonstration</DemoNote>
        </div>
      </div>
    </section>
  );
}
