import { zodiacSigns } from "@/data/horoscopes";
import { cn } from "@/lib/utils";

const BRASS = "#cdb488";
const R = 200;
/** Round SVG coordinates so server and client render identical markup. */
const f = (n: number) => Math.round(n * 100) / 100;

/**
 * Astrolabe face drawn like engraved brass. Two counter-rotating layers:
 * the outer degree scale + zodiac ring turns clockwise, the inner rete
 * (star pointers and alidade) turns the opposite way. Paused for users who
 * prefer reduced motion.
 */
export function ZodiacWheel({ className, color = BRASS }: { className?: string; color?: string }) {
  const C = color;
  return (
    <div aria-hidden className={cn("relative aspect-square", className)}>
      {/* Outer: degree scale + zodiac ring (clockwise) */}
      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full motion-safe:animate-[spin_140s_linear_infinite]">
        <g transform="translate(250 250)" fill="none" stroke={C}>
          <circle r={R + 38} strokeOpacity="0.55" />
          <circle r={R + 34} strokeOpacity="0.2" />
          <circle r={R} strokeOpacity="0.6" />
          <circle r={R - 44} strokeOpacity="0.45" />
          {Array.from({ length: 180 }, (_, k) => {
            const i = k * 2;
            const a = (i / 360) * Math.PI * 2;
            const len = i % 30 === 0 ? 18 : i % 10 === 0 ? 11 : 6;
            return (
              <line key={i} x1={f(Math.cos(a) * R)} y1={f(Math.sin(a) * R)} x2={f(Math.cos(a) * (R + len))} y2={f(Math.sin(a) * (R + len))}
                strokeOpacity={i % 30 === 0 ? 0.8 : 0.4} strokeWidth={i % 30 === 0 ? 1 : 0.6} />
            );
          })}
          {zodiacSigns.map((z, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const mid = a + Math.PI / 12;
            return (
              <g key={z.slug}>
                <line x1={f(Math.cos(a) * (R - 44))} y1={f(Math.sin(a) * (R - 44))} x2={f(Math.cos(a) * R)} y2={f(Math.sin(a) * R)} strokeOpacity="0.5" />
                <text x={f(Math.cos(mid) * (R - 22))} y={f(Math.sin(mid) * (R - 22))} fill={C} stroke="none" fontSize="19"
                  textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-glyph)" }} opacity="0.9">
                  {z.symbol}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Inner: rete + alidade (counter-clockwise) */}
      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full motion-safe:animate-[spin_90s_linear_infinite_reverse]">
        <g transform="translate(250 250)" fill="none" stroke={C}>
          <circle r={R - 120} strokeOpacity="0.3" />
          <circle r="6" strokeOpacity="0.8" />
          <path d="M0 -150 C 60 -110 110 -40 120 40 M0 -150 C -70 -100 -120 -20 -110 60 M-110 60 C -40 110 50 120 120 40" strokeOpacity="0.45" />
          {[[0, -150], [120, 40], [-110, 60], [55, -105], [-62, -98]].map(([x, y]) => (
            <path key={`${x}${y}`} d={`M${x} ${y - 7} L${x + 3} ${y} L${x} ${y + 7} L${x - 3} ${y}Z`} fill={C} fillOpacity="0.8" stroke="none" />
          ))}
          <line x1={-(R + 30)} y1={-28} x2={R + 30} y2={28} strokeOpacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
