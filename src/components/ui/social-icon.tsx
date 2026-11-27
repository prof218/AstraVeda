import type { SocialIcon as SocialIconName } from "@/data/site";

/** Minimal monochrome social glyphs (lucide no longer ships brand icons). */
export function SocialIcon({ name, className = "size-4" }: { name: SocialIconName; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="m10 9.5 4.5 2.5-4.5 2.5z" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14.5 8.5H16V5.5h-2a3.5 3.5 0 0 0-3.5 3.5v2H8.5v3h2V21h3v-7h2.2l.5-3h-2.7V9.5a1 1 0 0 1 1-1z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M4 4l16 16M20 4 4 20" />
        </svg>
      );
  }
}
