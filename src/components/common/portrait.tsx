import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Illustrated portrait placeholder for the astrologer.
 * Replace with <Image src="/astrologer.jpg" .../> once a real photo is supplied.
 */
export function Portrait({ className, label = "Portrait placeholder" }: { className?: string; label?: string }) {
  const id = useId().replace(/[:«»]/g, "");
  return (
    <div className={cn("relative overflow-hidden rounded-[20px] border border-line bg-abyss", className)}>
      <svg viewBox="0 0 400 500" className="h-full w-full" role="img" aria-label="Illustrated placeholder portrait of the astrologer">
        <defs>
          <radialGradient id={`${id}-bg`} cx="50%" cy="30%" r="80%">
            <stop offset="0" stopColor="#1c1830" />
            <stop offset="0.55" stopColor="#0d0b18" />
            <stop offset="1" stopColor="#05030b" />
          </radialGradient>
          <linearGradient id={`${id}-fig`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1d4f" />
            <stop offset="1" stopColor="#0a0717" />
          </linearGradient>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde7c0" />
            <stop offset="0.5" stopColor="#c4b5fd" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#${id}-bg)`} />
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 400} cy={(i * 61) % 300} r={i % 5 === 0 ? 1.4 : 0.7} fill="#fff" opacity={0.25 + ((i * 7) % 10) / 20} />
        ))}
        {/* halo */}
        <circle cx="200" cy="178" r="118" fill="none" stroke={`url(#${id}-rim)`} strokeOpacity="0.5" />
        <circle cx="200" cy="178" r="138" fill="none" stroke="#c4b5fd" strokeOpacity="0.12" strokeDasharray="2 8" />
        <circle cx="200" cy="178" r="96" fill="#8b5cf6" opacity="0.12" />
        {/* figure */}
        <path d="M200 92c-34 0-58 27-58 64 0 30 15 55 36 65v18c-58 8-104 44-118 104-6 26-6 85-6 157h292c0-72 0-131-6-157-14-60-60-96-118-104v-18c21-10 36-35 36-65 0-37-24-64-58-64z"
          fill={`url(#${id}-fig)`} />
        <path d="M200 92c-34 0-58 27-58 64 0 30 15 55 36 65v18c-58 8-104 44-118 104"
          fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.6" strokeOpacity="0.9" />
        <path d="M200 92c34 0 58 27 58 64 0 30-15 55-36 65v18c58 8 104 44 118 104" fill="none" stroke="#cdb488" strokeOpacity="0.25" strokeWidth="1.2" />
        {/* tilak + mala */}
        <circle cx="200" cy="133" r="2.5" fill="#f4c983" />
        <path d="M150 262q50 70 100 0" fill="none" stroke="#f4c983" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="0.5 7" strokeLinecap="round" />
      </svg>
      <span className="absolute left-4 top-4 rounded-full border border-line bg-void/70 px-3 py-1 text-[0.65rem] text-faint backdrop-blur">
        {label}
      </span>
    </div>
  );
}
