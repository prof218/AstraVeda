import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accordion built on native <details>/<summary>: keyboard accessible and
 * works without JavaScript. Optional `name` makes items mutually exclusive.
 */
export function Accordion({ items, name, className }: { items: { q: string; a: string }[]; name?: string; className?: string }) {
  return (
    <div className={cn("divide-y divide-line rounded-2xl border border-line bg-white/[0.02]", className)}>
      {items.map((item, i) => (
        <details key={item.q} name={name} className="group px-6 [&_summary::-webkit-details-marker]:hidden" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-semibold text-star transition-colors hover:text-lavender">
            {item.q}
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-300 group-open:rotate-45 group-open:border-lavender/50 group-open:text-lavender">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="pb-6 pr-12 text-sm leading-relaxed text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
