import { useId } from "react";
import { cn } from "@/lib/utils";

const HOUSES: [number, number][] = [
  [150, 82], [75, 36], [34, 75], [75, 150], [34, 225], [75, 266],
  [150, 222], [225, 266], [266, 225], [225, 150], [266, 75], [225, 36],
];

/**
 * North Indian style Kundli layout. Illustrative only — house numbers are
 * shown, no planetary positions are calculated.
 */
export function ChartTemplate({ className, lagnaLabel }: { className?: string; lagnaLabel?: string }) {
  const uid = useId().replace(/[:«»]/g, "");
  return (
    <svg viewBox="-10 -10 320 320" className={cn("h-auto w-full", className)} role="img" aria-label="Illustrative North Indian Kundli layout (not calculated)">
      <defs>
        <linearGradient id={`${uid}-s`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4c983" />
          <stop offset="0.5" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id={`${uid}-f`} cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity="0.18" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="300" rx="6" fill={`url(#${uid}-f)`} stroke={`url(#${uid}-s)`} strokeWidth="1.5" />
      <path d="M0 0 300 300 M300 0 0 300" stroke={`url(#${uid}-s)`} strokeOpacity="0.7" strokeWidth="1.2" />
      <path d="M150 0 300 150 150 300 0 150Z" fill="none" stroke={`url(#${uid}-s)`} strokeWidth="1.4" />
      {HOUSES.map(([x, y], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="13" fill={i === 0 ? "#f4c983" : "#a1a1aa"} style={{ fontFamily: "var(--font-sans)" }}>
          {i + 1}
        </text>
      ))}
      {lagnaLabel && (
        <text x="150" y="104" textAnchor="middle" fontSize="10" fill="#c4b5fd" letterSpacing="2" style={{ fontFamily: "var(--font-sans)" }}>
          {lagnaLabel}
        </text>
      )}
    </svg>
  );
}
