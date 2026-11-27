import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { IconName } from "@/types";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/** Radio-style selectable card. Use inside a role="radiogroup". */
export function OptionCard({
  selected, onSelect, icon, title, description, meta, name,
}: {
  selected: boolean; onSelect: () => void; icon: IconName; title: string; description: string; meta?: ReactNode; name: string;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer gap-4 rounded-2xl border p-5 transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky",
        selected
          ? "border-lavender/60 bg-white/[0.04]"
          : "border-line bg-white/[0.02] hover:border-line-strong hover:bg-white/[0.04]",
      )}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors", selected ? "border-lavender/50 bg-violet/25 text-star" : "border-line text-lavender")}>
        <Icon name={icon} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-star">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-muted">{description}</span>
        {meta && <span className="mt-2.5 block text-xs text-lavender/80">{meta}</span>}
      </span>
      <span aria-hidden className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors", selected ? "border-transparent bg-star text-void" : "border-line-strong")}>
        {selected && <Check className="size-3" />}
      </span>
    </label>
  );
}
