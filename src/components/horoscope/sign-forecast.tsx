"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, Heart, Leaf } from "lucide-react";
import type { HoroscopePeriod, ZodiacSign } from "@/types";
import { horoscopePeriods, isPeriod } from "@/data/horoscopes";
import { PeriodTabs } from "./period-tabs";

export function SignForecast({ sign }: { sign: ZodiacSign }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const p = params.get("period");
  const period: HoroscopePeriod = isPeriod(p) ? p : "daily";
  const label = horoscopePeriods.find((x) => x.id === period)!.label;

  return (
    <div>
      <PeriodTabs value={period} idPrefix="sign" onChange={(next) => router.replace(`${pathname}?period=${next}`, { scroll: false })} />
      <div id="sign-panel" role="tabpanel" aria-labelledby={`sign-tab-${period}`} className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div key={period} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className="eyebrow mb-3">{label} horoscope</p>
            <p className="font-display text-3xl leading-snug text-star sm:text-4xl">{sign.horoscope[period]}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Heart, title: "Love", text: sign.focus.love },
          { icon: Briefcase, title: "Career", text: sign.focus.career },
          { icon: Leaf, title: "Wellbeing", text: sign.focus.wellbeing },
        ].map(({ icon: I, title, text }) => (
          <div key={title} className="rounded-2xl border border-line bg-white/[0.025] p-5">
            <I className="size-5 text-lavender" aria-hidden />
            <h3 className="mt-3 text-sm font-medium text-star/60">{title}</h3>
            <p className="mt-2 text-sm text-muted">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
