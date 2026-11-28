import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[10px] border border-line bg-white/[0.035] px-4 text-base text-star placeholder:text-faint sm:text-[0.95rem] transition-[border-color,box-shadow,background-color] duration-200 outline-none hover:border-line-strong focus:border-lavender/60 focus:bg-white/[0.06] aria-[invalid=true]:border-danger/70";

export function Field({
  label, htmlFor, error, hint, required, children, className,
}: {
  label: string; htmlFor: string; error?: string; hint?: string; required?: boolean; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-[0.8rem] font-medium tracking-wide text-lavender/90">
        {label}
        {required && <span className="ml-0.5 text-violet-soft" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldBase, "h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldBase, "min-h-28 resize-y py-3", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(fieldBase, "h-12 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <svg aria-hidden viewBox="0 0 20 20" fill="currentColor"
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-lavender/70">
        <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4z" />
      </svg>
    </div>
  );
}

/** aria wiring for a field + react-hook-form error. */
export function ariaFor(id: string, error?: unknown) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
