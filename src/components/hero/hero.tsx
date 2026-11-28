"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { NightSky } from "@/components/cosmic/night-sky";
import { RealisticMoon, RealisticSun } from "@/components/cosmic/realistic-bodies";
import { ZodiacWheel } from "@/components/cosmic/zodiac-wheel";
import { Planet, Saturn } from "@/components/hero/planet";
import { renderGalaxy, renderNebula, type PlanetKind } from "@/lib/planet-textures";
import { seededRandom } from "@/lib/utils";
import { stats } from "@/data/astrologer";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Solar system configuration                                         */
/* ------------------------------------------------------------------ */
type Orbit = {
  id: string;
  kind: PlanetKind;
  /** orbit radius as a fraction of the system radius */
  r: number;
  /** planet diameter in px at desktop scale */
  size: number;
  /** seconds per revolution */
  period: number;
  phase: number;
  stroke: string;
  /** planet spin, seconds per rotation */
  spin: number;
  desktopOnly?: boolean;
};

const ORBITS: Orbit[] = [
  { id: "venus", kind: "venus", r: 0.34, size: 18, period: 34, phase: 0.6, stroke: "#F5C46A", spin: 24 },
  { id: "earth", kind: "earth", r: 0.55, size: 34, period: 56, phase: 2.5, stroke: "#2563EB", spin: 18 },
  { id: "mars", kind: "mars", r: 0.76, size: 22, period: 82, phase: 4.3, stroke: "#8B5CF6", spin: 20, desktopOnly: true },
  { id: "jupiter", kind: "jupiter", r: 0.98, size: 62, period: 118, phase: 1.15, stroke: "#F5C46A", spin: 14 },
  { id: "neptune", kind: "neptune", r: 1.2, size: 30, period: 160, phase: 3.5, stroke: "#2563EB", spin: 22, desktopOnly: true },
];
/** Direction from the Moon (left) toward the central Sun. */
const MOON_LIGHT: [number, number, number] = [0.86, 0.05, 0.5];
const TILT = (-7 * Math.PI) / 180;
const FLATTEN = 0.27;

/** Deterministic glowing stars (purple / blue / white) rendered as DOM dots. */
const GLOW_STARS = (() => {
  const rand = seededRandom(2024);
  const colors = ["#c4b5fd", "#93c5fd", "#f8f7ff", "#8B5CF6", "#60a5fa", "#F5C46A"];
  return Array.from({ length: 26 }, (_, i) => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 88).toFixed(2)}%`,
    size: 2 + rand() * 2.5,
    color: colors[i % colors.length],
    dur: 2.5 + rand() * 4,
    delay: -rand() * 6,
  }));
})();

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [dims, setDims] = useState({ w: 1440, h: 860 });
  const nebulaRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLDivElement>(null);

  // Track hero size for the orbit SVG (only re-renders on resize).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setDims((d) => (Math.abs(d.w - width) > 2 || Math.abs(d.h - height) > 2 ? { w: width, h: height } : d));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Procedural nebula + galaxy canvases (once).
  useEffect(() => {
    const small = window.innerWidth < 768;
    const neb = renderNebula(small ? 160 : 320, small ? 240 : 200);
    neb.style.cssText = "width:100%;height:100%;filter:blur(2px)";
    nebulaRef.current?.appendChild(neb);
    let gal: HTMLCanvasElement | null = null;
    if (!small) {
      gal = renderGalaxy(420);
      gal.style.cssText = "width:100%;height:100%";
      galaxyRef.current?.appendChild(gal);
    }
    return () => { neb.remove(); gal?.remove(); };
  }, []);

  const mobile = dims.w < 640;
  const tablet = dims.w >= 640 && dims.w < 1024;
  const cx = dims.w / 2;
  const cy = dims.h * (mobile ? 0.43 : 0.46);
  const R = mobile ? dims.w * 0.62 : tablet ? dims.w * 0.5 : Math.min(dims.w * 0.42, 760);
  const visible = ORBITS.filter((o) => !(mobile && o.desktopOnly));
  const scale = mobile ? 0.7 : tablet ? 0.85 : 1;

  // Orbit + entrance + parallax + scroll animations.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const bodies = visible.map((o) => ({
      o,
      el: el.querySelector<HTMLElement>(`[data-orbit-body="${o.id}"]`),
      term: el.querySelector<HTMLElement>(`[data-orbit-body="${o.id}"] [data-terminator]`),
      sparks: Array.from(el.querySelectorAll<HTMLElement>(`[data-orbit-spark="${o.id}"]`)),
      size: o.size * scale,
      z: -1,
    }));
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    const place = (theta: number, rx: number) => {
      const ex = Math.cos(theta) * rx, ey = Math.sin(theta) * rx * FLATTEN;
      return { x: cx + ex * cosT - ey * sinT, y: cy + ex * sinT + ey * cosT, depth: Math.sin(theta) };
    };

    let t = 0;
    const update = (dt: number) => {
      t += dt;
      for (const b of bodies) {
        if (!b.el) continue;
        const rx = R * b.o.r;
        const theta = b.o.phase + (t / b.o.period) * Math.PI * 2;
        const p = place(theta, rx);
        const s = 0.8 + 0.2 * ((p.depth + 1) / 2);
        b.el.style.transform = `translate3d(${p.x - b.size / 2}px, ${p.y - b.size / 2}px, 0) scale(${s.toFixed(3)})`;
        const z = p.depth < 0 ? 2 : 6; // far side behind the Sun, near side in front
        if (z !== b.z) { b.el.style.zIndex = String(z); b.z = z; }
        if (b.term) {
          const a = (Math.atan2(cy - p.y, cx - p.x) * 180) / Math.PI;
          b.term.style.transform = `rotate(${(a + 180).toFixed(1)}deg)`;
        }
        b.sparks.forEach((sp, i) => {
          const q = place(theta * 1.35 + 2.1 + i * Math.PI, rx);
          sp.style.transform = `translate3d(${q.x - 2}px, ${q.y - 2}px, 0)`;
        });
      }
    };

    const ctx = gsap.context(() => {
      update(0);
      gsap.set("[data-hero-in]", { opacity: 1 });
      if (reduced) return;
      document.documentElement.classList.add("hero-ready");

      // ---- continuous orbits on GSAP's ticker (paused offscreen) ----
      let running = true;
      const tick = (_time: number, deltaMs: number) => { if (running) update(Math.min(deltaMs, 64) / 1000); };
      gsap.ticker.add(tick);
      const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; });
      io.observe(el);

      // ---- entrance ----
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-layer='nebula']", { opacity: 0, duration: 2.2 }, 0)
        .from("[data-layer='wheel']", { opacity: 0, scale: 0.86, rotate: -25, duration: 2.6 }, 0.1)
        .from("[data-layer='sun']", { opacity: 0, scale: 0.4, duration: 2.2 }, 0.2)
        .from("[data-layer='orbits']", { opacity: 0, duration: 2 }, 0.4)
        .from("[data-layer='planets'], [data-layer='moon'], [data-layer='saturn']", { opacity: 0, duration: 1.8, stagger: 0.15 }, 0.5)
        .from("[data-hero-copy] > *", { opacity: 0, y: 22, duration: 1.1, stagger: 0.1, ease: "expo.out" }, 0.5);

      // ---- slow nebula drift (transform only) ----
      gsap.to("[data-layer='nebula'] > div", { xPercent: 3, yPercent: -2, scale: 1.06, duration: 26, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // ---- scroll: copy lifts, universe sinks slightly ----
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to("[data-hero-copy]", { y: -60, opacity: 0, ease: "none", scrollTrigger: st });
      gsap.to("[data-layer='wheel']", { yPercent: 10, ease: "none", scrollTrigger: st });

      // ---- pointer parallax for depth ----
      if (finePointer) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((n) => ({
          d: Number(n.dataset.depth),
          x: gsap.quickTo(n, "x", { duration: 1.6, ease: "power3.out" }),
          y: gsap.quickTo(n, "y", { duration: 1.6, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
          for (const l of layers) { l.x(-nx * l.d); l.y(-ny * l.d); }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => { gsap.ticker.remove(tick); io.disconnect(); window.removeEventListener("pointermove", onMove); };
      }
      return () => { gsap.ticker.remove(tick); io.disconnect(); };
    }, el);
    return () => ctx.revert();
    // re-run when the layout (and therefore orbit geometry) changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.w, dims.h]);

  const sunSize = mobile ? 150 : tablet ? 190 : Math.min(Math.max(dims.w * 0.15, 190), 250);
  const wheelSize = mobile ? dims.w * 1.15 : Math.min(dims.w * 0.62, 900);
  const moonSize = mobile ? 112 : tablet ? 180 : Math.min(Math.max(dims.w * 0.15, 190), 280);
  const saturnSize = mobile ? 62 : tablet ? 90 : Math.min(Math.max(dims.w * 0.075, 100), 140);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#050510] md:min-h-[760px] md:h-[100svh] md:max-h-[940px]"
    >
      {/* ================= Universe ================= */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* deep space base */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,#0d1240_0%,#080B24_38%,#050510_75%)]" />

        {/* nebula clouds */}
        <div data-layer="nebula" data-depth="10" className="absolute -inset-[6%]">
          <div ref={nebulaRef} className="h-full w-full opacity-80 mix-blend-screen" />
        </div>

        {/* stars, Milky Way, shooting stars */}
        <div data-depth="6" className="absolute -inset-4 opacity-90">
          <NightSky />
        </div>

        {/* glowing coloured stars */}
        <div data-depth="12" className="absolute inset-0">
          {GLOW_STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full motion-safe:animate-[hero-twinkle_var(--d)_ease-in-out_infinite]"
              style={{
                left: s.left, top: s.top, width: s.size, height: s.size, background: s.color,
                boxShadow: `0 0 ${s.size * 3}px ${s.size}px ${s.color}66`,
                ["--d" as string]: `${s.dur}s`, animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        {/* spiral galaxy */}
        <div data-depth="14" className="absolute left-[7%] top-[9%] hidden w-[clamp(170px,16vw,260px)] md:block">
          <div ref={galaxyRef} className="aspect-square w-full opacity-55 mix-blend-screen motion-safe:animate-[spin_220s_linear_infinite]" style={{ transform: "rotate(-24deg)" }} />
        </div>

        {/* zodiac wheel behind the headline */}
        <div className="absolute" style={{ left: cx, top: cy, width: wheelSize, height: wheelSize, marginLeft: -wheelSize / 2, marginTop: -wheelSize / 2 }}>
          <div data-layer="wheel" data-depth="8" className="h-full w-full opacity-[0.28]">
            <ZodiacWheel color="#F5C46A" />
          </div>
        </div>

        {/* orbital paths */}
        <svg data-layer="orbits" className="absolute inset-0 h-full w-full" viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="none">
          <g transform={`rotate(${(TILT * 180) / Math.PI} ${cx} ${cy})`} fill="none">
            {visible.map((o) => (
              <g key={o.id}>
                <ellipse cx={cx} cy={cy} rx={R * o.r} ry={R * o.r * FLATTEN} stroke={o.stroke} strokeOpacity="0.14" strokeWidth="5" />
                <ellipse cx={cx} cy={cy} rx={R * o.r} ry={R * o.r * FLATTEN} stroke={o.stroke} strokeOpacity="0.55" strokeWidth="1" />
              </g>
            ))}
          </g>
        </svg>

        {/* the Sun */}
        <div className="absolute z-[4]" style={{ left: cx, top: cy, width: sunSize, height: sunSize, marginLeft: -sunSize / 2, marginTop: -sunSize / 2 }}>
          <div data-layer="sun" className="relative h-full w-full">
            <div className="absolute -inset-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(245,196,106,0.32),rgba(245,160,80,0.12)_45%,rgba(139,92,246,0.08)_70%,transparent)]" />
            <div className="absolute -inset-[25%] rounded-full bg-[radial-gradient(closest-side,rgba(255,236,190,0.5),rgba(245,196,106,0.18)_55%,transparent)] motion-safe:animate-pulse-glow" />
            <RealisticSun className="relative h-full w-full" />
          </div>
        </div>

        {/* orbiting planets + glowing particles */}
        <div data-layer="planets" className="absolute inset-0">
          {visible.map((o) => (
            <div key={o.id}>
              <div data-orbit-body={o.id} className="absolute left-0 top-0 will-change-transform" style={{ width: o.size * scale, height: o.size * scale }}>
                <Planet kind={o.kind} size="100%" spin={o.spin} />
              </div>
              {[0, 1].map((i) => (
                <span key={i} data-orbit-spark={o.id} className="absolute left-0 top-0 z-[5] size-1 rounded-full will-change-transform"
                  style={{ background: o.stroke, boxShadow: `0 0 8px 2px ${o.stroke}` }} />
              ))}
            </div>
          ))}
        </div>

        {/* large Moon (left) */}
        <div className="absolute z-[7] left-[-16%] top-[9%] sm:left-[-4%] sm:top-[8%] md:left-[2%] md:top-[12%] lg:left-[1%] lg:top-[33%]">
          <div data-layer="moon" data-depth="26">
            <div className="motion-safe:animate-float">
              <div className="motion-safe:animate-[moon-librate_24s_ease-in-out_infinite]" style={{ width: moonSize }}>
                <RealisticMoon light={MOON_LIGHT} className="w-full drop-shadow-[0_0_40px_rgba(226,232,255,0.18)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Saturn (right) */}
        <div className="absolute z-[7] right-[-6%] top-[84%] sm:right-[3%] sm:top-[72%] lg:right-[7%] lg:top-[56%]">
          <div data-layer="saturn" data-depth="30">
            <div className="motion-safe:animate-float [animation-delay:-4s]">
              <Saturn size={saturnSize} terminatorAngle={190} />
            </div>
          </div>
        </div>

        {/* cosmic horizon glow */}
        <div className="absolute left-1/2 top-[90%] aspect-square w-[190vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.5)_0%,rgba(139,92,246,0.35)_5%,#080B24_16%,#050510_32%)] shadow-[0_-2px_0_0_rgba(147,197,253,0.45),0_-24px_90px_-6px_rgba(139,92,246,0.55),0_-60px_160px_0_rgba(37,99,235,0.3)] md:top-[88%] md:w-[150vw]" />

        {/* readability scrim behind the copy + edge vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(42%_34%_at_50%_47%,rgba(5,5,16,0.62),transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,5,16,0.75)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-void" />
      </div>

      {/* ================= Copy ================= */}
      <div className="container-cosmic relative z-10 w-full pb-20 pt-28 text-center sm:pt-32">
        <div data-hero-copy data-hero-in className="mx-auto max-w-5xl [text-shadow:0_2px_24px_rgba(5,5,16,0.85)]">
          <p className="mb-6 whitespace-nowrap text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#F5C46A] sm:text-xs sm:tracking-[0.38em]">
            Ancient Wisdom <span className="mx-1.5 text-[#c4b5fd]">•</span> Modern Guidance
          </p>
          <h1 id="hero-title" className="text-[2.6rem] leading-[1.04] tracking-[-0.01em] text-[#F8F7FF] xs:text-5xl sm:text-6xl lg:text-[4.9rem] xl:text-[5.2rem]">
            Discover What The Universe
            <br />
            Has{" "}
            <span className="bg-[linear-gradient(100deg,#c4b5fd_0%,#8B5CF6_35%,#F5C46A_85%)] bg-clip-text text-transparent [text-shadow:none]">
              Written For You
            </span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-[#F8F7FF]/75 sm:text-lg sm:leading-8">
            Explore your cosmic journey through personalized astrology, ancient wisdom, and expert celestial guidance.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 xs:flex-row">
            <Link
              href="/book-consultation"
              className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(110deg,#7c4dff,#8B5CF6_45%,#6d28d9)] px-8 text-[0.95rem] font-semibold text-white shadow-[0_0_0_1px_rgba(245,196,106,0.35)_inset,0_12px_34px_-10px_rgba(139,92,246,0.9)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(245,196,106,0.7)_inset,0_14px_44px_-8px_rgba(139,92,246,1),0_0_42px_-6px_rgba(245,196,106,0.55)] active:translate-y-0 xs:w-auto"
            >
              Book Your Consultation <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-13 w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.05] px-8 text-[0.95rem] font-semibold text-[#F8F7FF] backdrop-blur-md transition-[border-color,box-shadow,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#F5C46A]/70 hover:bg-white/[0.08] hover:shadow-[0_0_34px_-6px_rgba(245,196,106,0.55)] xs:w-auto"
            >
              Explore Our Services
            </Link>
          </div>
          <p className="mt-9 text-xs text-[#F8F7FF]/55 sm:text-sm">
            <span className="font-display text-lg text-[#F8F7FF] sm:text-xl">{stats[0].value}+</span> years of practice
            <span className="mx-3 text-[#F5C46A]/60">✦</span>
            <span className="font-display text-lg text-[#F8F7FF] sm:text-xl">{(stats[2].value / 1000).toFixed(0)}k+</span> consultations
            <span className="ml-3 text-[0.7rem] text-[#F8F7FF]/35">(placeholder figures)</span>
          </p>
        </div>
      </div>

      <a href="#stats" className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#F8F7FF]/50 transition-colors hover:text-[#F5C46A] sm:flex">
        Scroll
        <span aria-hidden className="h-9 w-px bg-gradient-to-b from-[#F5C46A]/70 to-transparent" />
      </a>
    </section>
  );
}
