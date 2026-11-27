import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Flat crescent with a single star — one solid colour. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7 text-[#e8dcc4]", className)} fill="currentColor">
      <path d="M19.6 4.6a12 12 0 1 0 7.8 19.2A10 10 0 1 1 19.6 4.6z" />
      <path d="M23.5 7.5l.75 2.05 2.05.75-2.05.75-.75 2.05-.75-2.05-2.05-.75 2.05-.75z" />
    </svg>
  );
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className={cn("inline-flex items-center gap-2.5", className)} aria-label={`${site.name} — home`}>
      <LogoMark />
      <span className="font-display text-[1.6rem] font-medium leading-none text-star">{site.name}</span>
    </Link>
  );
}
