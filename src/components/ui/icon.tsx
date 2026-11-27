import {
  BookOpen, Briefcase, Building2, Calendar, Coins, Compass, Flower2, Gem, Hash, Heart, Home, Lightbulb,
  MessageCircle, Moon, Orbit, Phone, ScrollText, ShieldCheck, Sparkles, Star, Store, Sun, User, Video,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import type { IconName } from "@/types";

function Rings({ size = 24, strokeWidth = 1.6, className }: LucideProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="9" cy="14" r="5.5" />
      <circle cx="15" cy="14" r="5.5" />
      <path d="M13.5 5.5 15 3.5l1.5 2L15 7z" />
    </svg>
  );
}

const map: Record<IconName, ComponentType<LucideProps>> = {
  sun: Sun, scroll: ScrollText, heart: Heart, rings: Rings, briefcase: Briefcase, coins: Coins, hash: Hash,
  compass: Compass, gem: Gem, orbit: Orbit, moon: Moon, sparkles: Sparkles, building: Building2, home: Home,
  store: Store, shield: ShieldCheck, user: User, book: BookOpen, lightbulb: Lightbulb, video: Video,
  phone: Phone, message: MessageCircle, star: Star, calendar: Calendar, flower: Flower2,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = map[name];
  return <Cmp strokeWidth={1.6} aria-hidden {...props} />;
}
