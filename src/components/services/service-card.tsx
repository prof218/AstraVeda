import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, index, className }: { service: Service; index: number; className?: string }) {
  return (
    <article
      data-reveal
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white/[0.045] to-white/[0.01] p-7 transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-cosmic)] hover:border-lavender/30",
        className,
      )}
    >
      {/* hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(closest-side, hsl(${service.hue} 85% 65% / 0.28), transparent)` }}
      />
      <div className="relative flex items-start justify-between">
        <span className="relative flex size-14 items-center justify-center">
          <span aria-hidden className="absolute inset-0 rounded-full border border-line transition-transform duration-700 group-hover:border-lavender/40" style={{ borderStyle: "dashed" }} />
          <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.04] text-lavender transition-colors group-hover:text-star">
            <Icon name={service.icon} className="size-[1.15rem]" />
          </span>
        </span>
        <span className="font-display text-sm text-faint">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="relative mt-7 text-[1.7rem] leading-tight">{service.name}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted">{service.short}</p>
      <div className="relative mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
        <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-star after:absolute after:inset-0 after:content-['']">
          Learn More <ArrowUpRight className="size-4 transition-transform" />
        </Link>
        <Link
          href={`/book-consultation?service=${service.bookingId}`}
          className="relative z-10 inline-flex h-10 items-center rounded-full border border-line px-4 text-xs font-semibold text-lavender transition-colors hover:border-violet hover:bg-violet/15 hover:text-star"
        >
          Book Consultation
        </Link>
      </div>
    </article>
  );
}
