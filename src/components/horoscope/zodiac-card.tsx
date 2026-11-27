import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HoroscopePeriod, ZodiacSign } from "@/types";

const elementTint: Record<ZodiacSign["element"], string> = {
  Fire: "from-ember/25",
  Earth: "from-success/20",
  Air: "from-sky/25",
  Water: "from-violet/30",
};

export function ZodiacCard({ sign, period }: { sign: ZodiacSign; period: HoroscopePeriod }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/[0.025] p-6 transition-[border-color,transform] duration-500 hover:border-lavender/30">
      <div aria-hidden className={`pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-radial ${elementTint[sign.element]} to-transparent to-70% opacity-60 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="relative flex items-center gap-4">
        <span className="glyph flex size-14 items-center justify-center rounded-2xl border border-line bg-void/50 text-[1.9rem] text-lavender transition-colors duration-500 group-hover:text-star">
          {sign.symbol}
        </span>
        <div>
          <h3 className="font-display text-2xl leading-none">{sign.name}</h3>
          <p className="mt-1.5 text-xs text-faint">{sign.dates}</p>
        </div>
      </div>
      <p className="relative mt-5 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">{sign.horoscope[period]}</p>
      <Link
        href={`/horoscope/${sign.slug}?period=${period}`}
        className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-lavender transition-colors after:absolute after:inset-0 after:content-[''] hover:text-star"
        aria-label={`Read ${sign.name} ${period} horoscope`}
      >
        Read Horoscope <ArrowRight className="size-4 transition-transform" />
      </Link>
    </article>
  );
}
