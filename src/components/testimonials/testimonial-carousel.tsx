"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const INTERVAL = 7000;

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = testimonials.length;

  const go = useCallback((next: number, d: number) => {
    setDir(d);
    setIndex(((next % n) + n) % n);
  }, [n]);

  useEffect(() => {
    if (paused || hovering) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(index + 1, 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, hovering, go]);

  const t = testimonials[index];

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="relative mx-auto max-w-4xl overflow-hidden px-2 text-center" aria-live={paused ? "polite" : "off"}>
        <Quote aria-hidden className="mx-auto size-12 text-violet/50" strokeWidth={1} />
        <div className="relative min-h-[17rem] sm:min-h-[14rem]">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.figure
              key={t.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -40, filter: "blur(6px)" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${n}`}
            >
              <div className="mt-6 flex justify-center gap-1" aria-label={`Rated ${t.rating} out of 5`} role="img">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} aria-hidden className={cn("size-4", i < t.rating ? "fill-solar text-solar" : "text-line-strong")} />
                ))}
              </div>
              <blockquote className="mt-6 font-display text-2xl leading-snug text-star sm:text-[2.1rem]">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-4">
                <span aria-hidden className="flex size-12 items-center justify-center rounded-full bg-star text-sm font-bold text-void ring-4 ring-violet/15">
                  {t.initials}
                </span>
                <span className="text-left">
                  <span className="block font-semibold text-star">{t.name}</span>
                  <span className="block text-xs text-muted">{t.location} · {t.service}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(index - 1, -1)} aria-label="Previous testimonial" className={navBtn}>
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(i, i > index ? 1 : -1)}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index}
              className="group flex h-11 min-w-6 items-center justify-center"
            >
              <span className={cn("block h-1 rounded-full transition-colors duration-500", i === index ? "w-8 bg-star" : "w-2 bg-line-strong group-hover:bg-lavender/60")} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1, 1)} aria-label="Next testimonial" className={navBtn}>
          <ChevronRight className="size-5" />
        </button>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Resume autoplay" : "Pause autoplay"} className={cn(navBtn, "size-9")}>
          {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}

const navBtn = "flex size-11 items-center justify-center rounded-full border border-line text-star/80 transition-colors hover:border-lavender/50 hover:text-star";
