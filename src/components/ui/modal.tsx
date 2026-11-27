"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useMounted } from "@/hooks/use-today";
import { cn } from "@/lib/utils";

/** Accessible modal dialog: portal, focus trap, Escape to close, scroll lock, focus restore. */
export function Modal({
  open, onClose, title, description, children, className, hideTitle = false, size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  hideTitle?: boolean;
  size?: "md" | "lg" | "xl";
}) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const focusables = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])') ?? []);
    requestAnimationFrame(() => (focusables()[0] ?? panelRef.current)?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (e.key === "Tab") {
        const els = focusables();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-void/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[20px] border border-line bg-abyss shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] outline-none sm:rounded-[20px]",
              { md: "sm:max-w-lg", lg: "sm:max-w-3xl", xl: "sm:max-w-5xl" }[size],
              className,
            )}
          >
            <div className={cn("flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0", hideTitle && "absolute inset-x-0 top-0 z-10 p-4 sm:p-4")}>
              <div className={cn(hideTitle && "sr-only")}>
                <h2 id={titleId} className="text-3xl">{title}</h2>
                {description && <p id={descId} className="mt-1.5 text-sm text-muted">{description}</p>}
              </div>
              <button type="button" onClick={onClose} aria-label="Close dialog"
                className="ml-auto flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-void/60 text-star backdrop-blur transition-colors hover:border-lavender/50">
                <X className="size-4" />
              </button>
            </div>
            <div className={cn(!hideTitle && "p-6 sm:p-8")}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
