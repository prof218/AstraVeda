import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Section({
  id, className, children, containerClassName, labelledBy,
}: { id?: string; className?: string; children: ReactNode; containerClassName?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-20 sm:py-28 lg:py-32", className)}>
      <div className={cn("container-cosmic relative", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  id, eyebrow, title, description, align = "center", className, children,
}: {
  id?: string; eyebrow?: string; title: ReactNode; description?: ReactNode; align?: "center" | "left";
  className?: string; children?: ReactNode;
}) {
  return (
    <div
      data-reveal
      className={cn("flex flex-col gap-5", align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-2xl", className)}
    >
      {eyebrow && (
        <p className="eyebrow">{eyebrow}</p>
      )}
      <h2 id={id} className="text-4xl leading-[1.05] sm:text-5xl lg:text-[3.6rem]">{title}</h2>
      {description && <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      {children}
    </div>
  );
}

/** Honest label for placeholder / demo content. */
export function DemoNote({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-[0.7rem] tracking-wide text-faint", className)}>
      <Info className="size-3.5 shrink-0 text-lavender/70" aria-hidden />
      {children ?? "Demo content — replace with verified client information"}
    </p>
  );
}

/** Thin ornamental divider with a star in the centre. */
export function StarDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-4", className)}>
      <span className="hairline w-24 sm:w-40" />
      <svg viewBox="0 0 24 24" className="size-3.5 text-lavender"><path fill="currentColor" d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg>
      <span className="hairline w-24 sm:w-40" />
    </div>
  );
}
