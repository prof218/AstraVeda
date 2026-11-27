"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { HoroscopePeriod, ZodiacElement } from "@/types";
import { isPeriod, sunSignFromDate, zodiacSigns } from "@/data/horoscopes";
import { PeriodTabs } from "./period-tabs";
import { ZodiacCard } from "./zodiac-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ELEMENTS: ("All" | ZodiacElement)[] = ["All", "Fire", "Earth", "Air", "Water"];

export function HoroscopeBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const p = params.get("period");
  const period: HoroscopePeriod = isPeriod(p) ? p : "daily";
  const [element, setElement] = useState<(typeof ELEMENTS)[number]>("All");

  const setPeriod = (next: HoroscopePeriod) => {
    const q = new URLSearchParams(params.toString());
    q.set("period", next);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };

  const list = element === "All" ? zodiacSigns : zodiacSigns.filter((z) => z.element === element);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <PeriodTabs value={period} onChange={setPeriod} idPrefix="horoscope" />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by element">
          {ELEMENTS.map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={element === e}
              onClick={() => setElement(e)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                element === e ? "border-lavender/60 bg-violet/20 text-star" : "border-line text-muted hover:text-star",
              )}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div id="horoscope-panel" role="tabpanel" aria-labelledby={`horoscope-tab-${period}`} className="mt-10">
        <AnimatePresence mode="wait">
          <motion.ul
            key={period + element}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {list.map((z) => <li key={z.slug}><ZodiacCard sign={z} period={period} /></li>)}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** "Don't know your sign?" helper. */
export function SignFinder() {
  const router = useRouter();
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);
  const sign = dob && !Number.isNaN(Date.parse(dob)) ? sunSignFromDate(dob) : null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!sign) return setError("Please choose your date of birth");
        router.push(`/horoscope/${sign.slug}`);
      }}
      className="glass flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-end"
      noValidate
    >
      <div className="flex-1">
        <label htmlFor="finder-dob" className="text-[0.8rem] font-medium text-lavender/90">Don&apos;t know your sign? Enter your birth date</label>
        <input
          id="finder-dob"
          type="date"
          value={dob}
          onChange={(e) => { setDob(e.target.value); setError(null); }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "finder-error" : sign ? "finder-result" : undefined}
          className="mt-2 h-12 w-full rounded-xl border border-line bg-white/[0.035] px-4 text-star outline-none focus:border-violet/70"
        />
        {error && <p id="finder-error" role="alert" className="mt-2 text-xs text-danger">{error}</p>}
        {sign && <p id="finder-result" className="mt-2 text-xs text-muted" aria-live="polite">Your Sun sign is <span className="glyph">{sign.symbol}</span> <strong className="text-star">{sign.name}</strong></p>}
      </div>
      <Button type="submit" className="shrink-0">{sign ? `Read ${sign.name}` : "Find my sign"} <ArrowRight className="size-4" /></Button>
    </form>
  );
}
