"use client";

import { useRef, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import type { HoroscopePeriod } from "@/types";
import { horoscopePeriods } from "@/data/horoscopes";
import { cn } from "@/lib/utils";

/** Accessible tablist (arrow-key navigation) with an animated indicator. */
export function PeriodTabs({
  value, onChange, idPrefix, className,
}: { value: HoroscopePeriod; onChange: (p: HoroscopePeriod) => void; idPrefix: string; className?: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = horoscopePeriods.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      onChange(horoscopePeriods[next].id);
      refs.current[next]?.focus();
    }
  };

  return (
    <div role="tablist" aria-label="Horoscope period" className={cn("inline-flex rounded-full border border-line bg-white/[0.03] p-1", className)}>
      {horoscopePeriods.map((p, i) => {
        const active = p.id === value;
        return (
          <button
            key={p.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`${idPrefix}-tab-${p.id}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(p.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn("relative min-h-10 rounded-full px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors sm:px-6 sm:text-sm", active ? "text-void" : "text-muted hover:text-star")}
          >
            {active && (
              <motion.span
                layoutId={`${idPrefix}-pill`}
                className="absolute inset-0 rounded-full bg-star"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
