"use client";

import { useEffect, useRef } from "react";
import { renderSky, type TwinkleStar } from "@/lib/celestial-render";
import { cn } from "@/lib/utils";

const DEFAULT_BAND = { ax: 0.32, ay: -0.08, bx: 1.02, by: 1.08 };

type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number };

/**
 * Photographic night sky: a static Milky Way layer rendered once, plus a light
 * animated layer for atmospheric twinkle and the occasional meteor.
 * Pauses offscreen / in hidden tabs; static when reduced motion is preferred.
 */
export function NightSky({
  className,
  band = DEFAULT_BAND,
  meteors = true,
}: {
  className?: string;
  band?: { ax: number; ay: number; bx: number; by: number };
  meteors?: boolean;
}) {
  const skyRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sky = skyRef.current, fx = fxRef.current;
    if (!sky || !fx) return;
    const sctx = sky.getContext("2d");
    const fctx = fx.getContext("2d");
    if (!sctx || !fctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    let w = 0, h = 0;
    let twinkles: TwinkleStar[] = [];
    const meteorsList: Meteor[] = [];
    let raf = 0, running = false, visible = true, last = 0, lastFrame = 0;
    let nextMeteor = 3500 + Math.random() * 4000;
    let renderedFor = "";

    const paintSky = () => {
      const rect = sky.getBoundingClientRect();
      const key = `${Math.round(rect.width)}x${Math.round(rect.height)}`;
      if (key === renderedFor || rect.width < 2) return;
      renderedFor = key;
      w = rect.width; h = rect.height;
      for (const c of [sky, fx]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const portrait = h > w * 1.1;
      twinkles = renderSky(sctx, w, h, {
        lowPower,
        band: portrait ? { ax: 1.1, ay: 0.05, bx: -0.2, by: 0.75 } : band,
      });
      drawFx(0, 0);
      sky.dataset.ready = "true";
    };

    function drawFx(t: number, dt: number) {
      fctx!.clearRect(0, 0, w, h);
      for (const s of twinkles) {
        // atmospheric scintillation: small, irregular brightness changes
        const tw = reduced ? 1 : 0.72 + 0.28 * Math.sin(t * 0.001 * s.s + s.p) * Math.sin(t * 0.00037 * s.s + s.p * 2);
        fctx!.fillStyle = `rgba(${s.c},${s.a * tw})`;
        fctx!.beginPath();
        fctx!.arc(s.x, s.y, s.r * 0.8, 0, Math.PI * 2);
        fctx!.fill();
      }
      for (let i = meteorsList.length - 1; i >= 0; i--) {
        const m = meteorsList[i];
        m.life += dt;
        const k = m.life / m.max;
        if (k >= 1) { meteorsList.splice(i, 1); continue; }
        m.x += m.vx * dt; m.y += m.vy * dt;
        const fade = Math.sin(Math.PI * k);
        const mag = Math.hypot(m.vx, m.vy);
        const tx = m.x - (m.vx / mag) * m.len, ty = m.y - (m.vy / mag) * m.len;
        const g = fctx!.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
        g.addColorStop(0.25, `rgba(214,228,255,${0.35 * fade})`);
        g.addColorStop(1, "rgba(214,228,255,0)");
        fctx!.strokeStyle = g;
        fctx!.lineWidth = 1;
        fctx!.beginPath();
        fctx!.moveTo(m.x, m.y);
        fctx!.lineTo(tx, ty);
        fctx!.stroke();
      }
    }

    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (t - lastFrame < (lowPower ? 50 : 33)) return; // twinkle needs ~20–30fps only
      const dt = Math.min(80, last ? t - last : 16);
      last = t; lastFrame = t;
      if (meteors) {
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          const ang = 0.5 + Math.random() * 0.5;
          const sp = 1.3 + Math.random() * 0.8;
          meteorsList.push({ x: w * (0.15 + Math.random() * 0.75), y: h * Math.random() * 0.35, vx: Math.cos(ang) * sp * (Math.random() > 0.5 ? 1 : -1), vy: Math.sin(ang) * sp, life: 0, max: 380 + Math.random() * 300, len: 60 + Math.random() * 90 });
          nextMeteor = (lowPower ? 9000 : 6000) + Math.random() * 8000;
        }
      }
      drawFx(t, dt);
    }
    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true; last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // Render after first paint so it never blocks the headline.
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 300 }) : window.setTimeout(cb, 16);
    idle(() => { paintSky(); start(); });

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(paintSky, 150);
    });
    ro.observe(sky);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(sky);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [band, meteors]);

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <canvas ref={skyRef} className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1.6s] ease-[var(--ease-cosmic)] data-[ready=true]:opacity-100" />
      <canvas ref={fxRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
