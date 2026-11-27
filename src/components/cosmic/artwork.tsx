import { useId } from "react";
import type { ArtVariant } from "@/types";
import { cn, hashString, seededRandom } from "@/lib/utils";

/**
 * Deterministic, lightweight SVG celestial illustrations.
 * Used as cover art for blog posts, products, gallery items and services so the
 * demo ships with cohesive visuals and zero external image requests.
 * Swap for real photography via next/image when the client supplies assets.
 */
export function Artwork({
  variant,
  hue = 260,
  seed = "",
  className,
  label,
}: {
  variant: ArtVariant;
  hue?: number;
  seed?: string;
  className?: string;
  label?: string;
}) {
  const uid = useId().replace(/[:«»]/g, "");
  const rand = seededRandom(hashString(variant + seed + hue));
  const stars = Array.from({ length: 46 }, () => ({
    x: rand() * 400,
    y: rand() * 300,
    r: rand() * 1.1 + 0.25,
    o: rand() * 0.7 + 0.2,
  }));
  const c1 = `hsl(${hue} 85% 68%)`;
  const c2 = `hsl(${(hue + 40) % 360} 90% 62%)`;
  const c3 = `hsl(${hue} 70% 22%)`;
  const id = (n: string) => `${uid}-${n}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={cn("block h-full w-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={id("bg")} cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor={`hsl(${hue} 60% 16%)`} />
          <stop offset="55%" stopColor="#0b0718" />
          <stop offset="100%" stopColor="#05030b" />
        </radialGradient>
        <radialGradient id={id("glow")} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("sphere")} cx="35%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="18%" stopColor={c1} />
          <stop offset="70%" stopColor={c3} />
          <stop offset="100%" stopColor="#05030b" />
        </radialGradient>
        <linearGradient id={id("line")} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${id("bg")})`} />
      <ellipse cx="320" cy="60" rx="180" ry="90" fill={`hsl(${(hue + 50) % 360} 80% 50%)`} opacity="0.08" />
      <ellipse cx="60" cy="260" rx="200" ry="80" fill={`hsl(${(hue + 300) % 360} 80% 50%)`} opacity="0.08" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
      ))}
      <circle cx="200" cy="150" r="130" fill={`url(#${id("glow")})`} />

      <Motif variant={variant} id={id} c1={c1} c2={c2} rand={rand} />
    </svg>
  );
}

function Motif({
  variant, id, c1, c2, rand,
}: { variant: ArtVariant; id: (n: string) => string; c1: string; c2: string; rand: () => number }) {
  const stroke = `url(#${id("line")})`;
  switch (variant) {
    case "planet":
      return (
        <g>
          <ellipse cx="200" cy="150" rx="128" ry="26" fill="none" stroke={c1} strokeOpacity="0.35" strokeWidth="1.2" transform="rotate(-16 200 150)" />
          <circle cx="200" cy="150" r="62" fill={`url(#${id("sphere")})`} />
          <path d="M 72 150 A 128 26 0 0 0 328 150" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.9" transform="rotate(-16 200 150)" />
          <circle cx="318" cy="88" r="9" fill={c2} opacity="0.8" />
        </g>
      );
    case "moon":
      return (
        <g>
          <circle cx="200" cy="150" r="70" fill={`url(#${id("sphere")})`} />
          <circle cx="228" cy="138" r="64" fill="#07040f" opacity="0.92" />
          <circle cx="172" cy="122" r="6" fill="#fff" opacity="0.12" />
          <circle cx="160" cy="170" r="9" fill="#fff" opacity="0.08" />
          <circle cx="150" cy="140" r="3" fill="#fff" opacity="0.15" />
        </g>
      );
    case "eclipse":
      return (
        <g>
          <circle cx="200" cy="150" r="74" fill="none" stroke={c1} strokeOpacity="0.25" strokeWidth="18" />
          <circle cx="200" cy="150" r="66" fill="none" stroke={stroke} strokeWidth="2.5" />
          <circle cx="200" cy="150" r="64" fill="#05030b" />
          <circle cx="246" cy="108" r="5" fill="#fff" opacity="0.95" />
        </g>
      );
    case "sun":
      return (
        <g>
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} x1="200" y1="150" x2={200 + Math.cos((i / 24) * Math.PI * 2) * (i % 2 ? 110 : 140)}
              y2={150 + Math.sin((i / 24) * Math.PI * 2) * (i % 2 ? 110 : 140)} stroke={c1} strokeOpacity="0.35" strokeWidth="1" />
          ))}
          <circle cx="200" cy="150" r="54" fill={`url(#${id("sphere")})`} />
          <circle cx="200" cy="150" r="70" fill="none" stroke={c2} strokeOpacity="0.4" />
        </g>
      );
    case "constellation": {
      const pts = Array.from({ length: 8 }, (_, i) => [70 + i * 37 + rand() * 20, 80 + rand() * 140] as const);
      return (
        <g>
          <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.8" />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="7" fill={c1} opacity="0.18" />
              <circle cx={x} cy={y} r="2.6" fill="#fff" />
            </g>
          ))}
        </g>
      );
    }
    case "mandala":
      return (
        <g transform="translate(200 150)">
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse key={i} rx="18" ry="78" fill="none" stroke={stroke} strokeOpacity="0.55" strokeWidth="1" transform={`rotate(${i * 11.25})`} />
          ))}
          <circle r="30" fill="none" stroke={c2} strokeOpacity="0.8" />
          <circle r="10" fill={c1} />
        </g>
      );
    case "gem":
      return (
        <g>
          <polygon points="200,70 262,118 240,215 160,215 138,118" fill={c1} opacity="0.16" />
          <polygon points="200,70 262,118 240,215 160,215 138,118" fill="none" stroke={stroke} strokeWidth="2" />
          <polyline points="138,118 262,118" stroke={c1} strokeOpacity="0.7" />
          <polyline points="200,70 175,118 200,215 225,118 200,70" fill="none" stroke={c2} strokeOpacity="0.7" />
          <polyline points="160,215 175,118 M240,215 225,118" fill="none" stroke={c2} strokeOpacity="0.6" />
          <circle cx="228" cy="98" r="3" fill="#fff" />
        </g>
      );
    case "rudraksha":
      return (
        <g>
          {Array.from({ length: 13 }, (_, i) => {
            const a = Math.PI * (0.1 + (i / 12) * 0.8);
            const x = 200 - Math.cos(a) * 140;
            const y = 70 + Math.sin(a) * 120;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="15" fill={`url(#${id("sphere")})`} />
                <path d={`M${x - 9} ${y - 6} q9 6 18 0 M${x - 10} ${y + 2} q10 6 20 0`} stroke="#000" strokeOpacity="0.35" fill="none" />
              </g>
            );
          })}
        </g>
      );
    case "yantra":
      return (
        <g transform="translate(200 150)" fill="none" stroke={stroke} strokeWidth="1.3">
          <rect x="-100" y="-100" width="200" height="200" strokeOpacity="0.4" />
          <circle r="86" strokeOpacity="0.6" />
          <circle r="76" strokeOpacity="0.4" />
          <polygon points="0,-66 57,33 -57,33" />
          <polygon points="0,66 57,-33 -57,-33" />
          <polygon points="0,-44 38,22 -38,22" strokeOpacity="0.7" />
          <polygon points="0,44 38,-22 -38,-22" strokeOpacity="0.7" />
          <circle r="5" fill={c2} stroke="none" />
        </g>
      );
    case "galaxy":
      return (
        <g transform="translate(200 150)">
          {Array.from({ length: 220 }, (_, i) => {
            const arm = i % 3;
            const t = (i / 220) * 4.2;
            const a = t * 2.2 + (arm * Math.PI * 2) / 3;
            const r = t * 30 + rand() * 10;
            return <circle key={i} cx={Math.cos(a) * r * 1.4} cy={Math.sin(a) * r * 0.62} r={rand() * 1.3 + 0.3} fill={i % 4 ? "#fff" : c1} opacity={0.9 - t * 0.17} />;
          })}
          <ellipse rx="26" ry="12" fill={c1} opacity="0.5" />
          <ellipse rx="10" ry="5" fill="#fff" opacity="0.9" />
        </g>
      );
    case "chart":
      return (
        <g transform="translate(110 60)" fill="none" stroke={stroke} strokeWidth="1.4">
          <rect width="180" height="180" />
          <path d="M0 0 180 180 M180 0 0 180" strokeOpacity="0.7" />
          <path d="M90 0 180 90 90 180 0 90Z" />
          <circle cx="90" cy="48" r="3" fill={c2} stroke="none" />
          <circle cx="46" cy="90" r="3" fill="#fff" stroke="none" />
          <circle cx="140" cy="118" r="3" fill={c1} stroke="none" />
        </g>
      );
  }
}
