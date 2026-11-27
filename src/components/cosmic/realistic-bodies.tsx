"use client";

import { useEffect, useRef } from "react";
import { renderMoon, renderSun } from "@/lib/celestial-render";
import { cn } from "@/lib/utils";

/** Shared cache so the (relatively expensive) renders run once per size. */
const cache = new Map<string, HTMLCanvasElement | { disc: HTMLCanvasElement; corona: HTMLCanvasElement }>();

function measureSize(el: HTMLElement | null) {
  {
    if (!el) return 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // bucket sizes so small resizes reuse the cached render
    return Math.min(1100, Math.ceil((el.getBoundingClientRect().width * dpr) / 64) * 64);
  }
}

const idle = (cb: () => void) =>
  typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 400 }) : window.setTimeout(cb, 16);

/**
 * A physically shaded Moon (waxing gibbous, lit from the upper left).
 * `light` is the direction towards the Sun in view space.
 */
export function RealisticMoon({ className, light }: { className?: string; light?: [number, number, number] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const draw = () => {
      const size = measureSize(wrap.current);
      if (!size || cancelled) return;
      const key = `moon-${size}-${light?.join(",") ?? "d"}`;
      let src = cache.get(key) as HTMLCanvasElement | undefined;
      if (!src) {
        src = renderMoon(size, light);
        cache.set(key, src);
      }
      canvas.width = canvas.height = size;
      canvas.getContext("2d")!.drawImage(src, 0, 0);
      canvas.dataset.ready = "true";
    };
    idle(draw);
    let t = 0;
    const ro = new ResizeObserver(() => { window.clearTimeout(t); t = window.setTimeout(draw, 200); });
    if (wrap.current) ro.observe(wrap.current);
    return () => { cancelled = true; ro.disconnect(); window.clearTimeout(t); };
  }, [light]);

  return (
    <div ref={wrap} aria-hidden className={cn("relative aspect-square", className)}>
      {/* faint atmospheric halo, neutral — like a long exposure */}
      <div className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(226,230,240,0.10),rgba(226,230,240,0.03)_55%,transparent)]" />
      <canvas ref={canvasRef} className="relative h-full w-full opacity-0 transition-opacity duration-[1.4s] data-[ready=true]:opacity-100" />
    </div>
  );
}

/** Limb-darkened Sun with a slowly turning corona. */
export function RealisticSun({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLCanvasElement>(null);
  const coronaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      const size = measureSize(wrap.current);
      const disc = discRef.current, corona = coronaRef.current;
      if (!size || !disc || !corona || cancelled) return;
      const key = `sun-${size}`;
      let src = cache.get(key) as { disc: HTMLCanvasElement; corona: HTMLCanvasElement } | undefined;
      if (!src) {
        src = renderSun(size);
        cache.set(key, src);
      }
      for (const [el, s] of [[disc, src.disc], [corona, src.corona]] as const) {
        el.width = el.height = size;
        el.getContext("2d")!.drawImage(s, 0, 0);
        el.dataset.ready = "true";
      }
    };
    idle(draw);
    return () => { cancelled = true; };
  }, []);

  return (
    <div ref={wrap} aria-hidden className={cn("relative aspect-square", className)}>
      <div className="absolute inset-[22%] rounded-full bg-[radial-gradient(closest-side,rgba(255,236,206,0.35),rgba(255,214,170,0.08)_60%,transparent)]" />
      <canvas ref={coronaRef} className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[2s] data-[ready=true]:opacity-90 motion-safe:animate-[spin_900s_linear_infinite]" />
      <canvas ref={discRef} className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1.2s] data-[ready=true]:opacity-100" />
    </div>
  );
}
