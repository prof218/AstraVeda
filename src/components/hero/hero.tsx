"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Briefcase, CalendarDays, Compass, Flower2, Heart, Orbit as OrbitIcon } from "lucide-react";
import { NightSky } from "@/components/cosmic/night-sky";
import { RealisticSun, RotatingMoon } from "@/components/cosmic/realistic-bodies";
import { ZodiacWheel } from "@/components/cosmic/zodiac-wheel";
import { Planet, Saturn } from "@/components/hero/planet";
import { renderNightEarthStrip, renderSideNebula, renderSpiralGalaxy, type PlanetKind } from "@/lib/planet-textures";
import { seededRandom } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Scene layout — fractions of the hero's width/height                 */
/* ------------------------------------------------------------------ */
type Body = {
  id: string;
  kind: PlanetKind | "saturn-ringed" | "moon-lit";
  /** where the body sits in the composition at t = 0 */
  at: [number, number];
  /** diameter as a fraction of hero width */
  size: number;
  /** seconds per orbit */
  period: number;
  /** seconds per axial rotation */
  spin: number;
  /** orbit around the Sun instead of the scene centre */
  aroundSun?: boolean;
  /** phone only: explicit orbit around the Sun [rx, ry] as fractions of width, plus start angle */
  ring?: [number, number, number];
};

const DESKTOP: Body[] = [
  { id: "mercury", kind: "mercury", at: [0.3, 0.17], size: 0.026, period: 70, spin: 26, aroundSun: true },
  { id: "jupiter", kind: "jupiter", at: [0.155, 0.44], size: 0.034, period: 150, spin: 15 },
  { id: "earth", kind: "earth", at: [0.11, 0.61], size: 0.068, period: 120, spin: 24 },
  { id: "moon", kind: "moon-lit", at: [0.83, 0.22], size: 0.078, period: 210, spin: 40 },
  { id: "saturn", kind: "saturn-ringed", at: [0.885, 0.56], size: 0.06, period: 250, spin: 30 },
];
const TABLET: Body[] = [
  { id: "mercury", kind: "mercury", at: [0.31, 0.15], size: 0.03, period: 70, spin: 26, aroundSun: true },
  { id: "jupiter", kind: "jupiter", at: [0.11, 0.3], size: 0.04, period: 150, spin: 15 },
  { id: "earth", kind: "earth", at: [0.06, 0.52], size: 0.075, period: 120, spin: 24 },
  { id: "moon", kind: "moon-lit", at: [0.88, 0.24], size: 0.085, period: 210, spin: 40 },
  { id: "saturn", kind: "saturn-ringed", at: [0.92, 0.66], size: 0.06, period: 250, spin: 30 },
];
const MOBILE: Body[] = [
  // phone: a compact solar system circling the Sun above the headline
  { id: "mercury", kind: "mercury", at: [0, 0], size: 0.045, period: 24, spin: 20, ring: [0.3, 0.15, 0.9] },
  { id: "jupiter", kind: "jupiter", at: [0, 0], size: 0.075, period: 36, spin: 15, ring: [0.3, 0.15, 3.7] },
  { id: "earth", kind: "earth", at: [0, 0], size: 0.085, period: 50, spin: 20, ring: [0.41, 0.24, 2.5] },
  { id: "moon", kind: "moon-lit", at: [0, 0], size: 0.11, period: 60, spin: 40, ring: [0.41, 0.24, -0.6] },
  { id: "saturn", kind: "saturn-ringed", at: [0, 0], size: 0.085, period: 80, spin: 30, ring: [0.41, 0.24, 0.9] },
];

/** The Sun sits below-left of the Moon in the composition. */
const MOON_LIGHT: [number, number, number] = [-0.82, -0.12, 0.56];

const GLOW_STARS = (() => {
  const rand = seededRandom(2024);
  const colors = ["#c4b5fd", "#a78bfa", "#f8f7ff", "#93c5fd", "#e9d5ff"];
  return Array.from({ length: 34 }, (_, i) => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 78).toFixed(2)}%`,
    size: 1.5 + rand() * 2.5,
    color: colors[i % colors.length],
    dur: 2.5 + rand() * 4,
    delay: -rand() * 6,
  }));
})();

const FEATURES = [
  { label: "Birth Chart\nAnalysis", href: "/services/kundli-analysis", Icon: OrbitIcon },
  { label: "Love & Relationship\nGuidance", href: "/services/love-relationship", Icon: Heart },
  { label: "Career & Finance\nInsights", href: "/services/career-business", Icon: Briefcase },
  { label: "Remedies &\nSolutions", href: "/remedies", Icon: Flower2 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [dims, setDims] = useState({ w: 1440, h: 860 });
  const nebulaRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLDivElement>(null);
  const earthStripRef = useRef<HTMLDivElement>(null);

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

  // Procedural nebula, galaxy and night-side Earth texture (once).
  useEffect(() => {
    const small = window.innerWidth < 768;
    const gal =renderSpiralGalaxy(small ? 300 : 520);
    gal.style.cssText = "width:100%;height:100%";
    galaxyRef.current?.appendChild(gal);
    const strip = renderNightEarthStrip(small ? 1024 : 2048, small ? 220 : 360);
    const copies: HTMLCanvasElement[] = [];
    for (let i = 0; i < 2; i++) {
      const c = document.createElement("canvas");
      c.width = strip.width; c.height = strip.height;
      c.getContext("2d")!.drawImage(strip, 0, 0);
      c.style.cssText = "width:50%;height:100%;display:block;float:left";
      earthStripRef.current?.appendChild(c);
      copies.push(c);
    }
    return () => { gal.remove(); copies.forEach((c) => c.remove()); };
  }, []);

  const { w: W, h: H } = dims;
  const mobile = W < 640;

  // Nebula: phones get one drawn to the hero's real (tall) proportions so the
  // clouds don't stretch into streaks; tablet/desktop keep the original render.
  const nebulaKey = mobile ? `phone-${Math.round((H / W) * 4)}` : "wide";
  useEffect(() => {
    const host = nebulaRef.current;
    if (!host) return;
    let neb: HTMLCanvasElement;
    if (nebulaKey.startsWith("phone")) {
      neb = renderSideNebula(240, Math.round(240 * (H / W)), true);
      neb.style.cssText = "width:100%;height:100%;filter:blur(5px);opacity:0.75";
    } else {
      const small = window.innerWidth < 768;
      neb = renderSideNebula(small ? 200 : 420, small ? 300 : 240);
      neb.style.cssText = "width:100%;height:100%;filter:blur(3px)";
    }
    host.appendChild(neb);
    return () => neb.remove();
    // re-render only when switching between phone/wide or the phone aspect bucket changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nebulaKey]);
  const tablet = W >= 640 && W < 1024;
  const bodies = mobile ? MOBILE : tablet ? TABLET : DESKTOP;
  const sizeK = 1;

  // Sun + zodiac wheel at top centre
  const sun = { x: W * 0.5, y: mobile ? 165 : H * 0.245 };
  const sunSize = mobile ? W * 0.42 : Math.min(W * 0.27, 440);
  // zodiac ring seen at an angle (flattened ellipse), as in the reference
  const wheelSize = mobile ? W * 0.84 : Math.min(W * 0.38, 620);

  // Main orbit system: every orbit passes through its body's place in the composition
  const centre = { x: W * 0.5, y: H * (mobile ? 0.42 : 0.44) };
  const RY = H * (mobile ? 0.3 : 0.33);
  const SUN_RY = H * (mobile ? 0.1 : 0.12);
  const orbitOf = (b: Body) => {
    if (b.ring) return { c: sun, rx: b.ring[0] * W, ry: b.ring[1] * W, theta: b.ring[2] };
    const c = b.aroundSun ? sun : centre;
    const ry = b.aroundSun ? SUN_RY : RY;
    const dx = b.at[0] * W - c.x, dy = b.at[1] * H - c.y;
    const s = Math.max(-0.98, Math.min(0.98, dy / ry));
    let theta = Math.asin(s);
    if (dx < 0) theta = Math.PI - theta;
    const rx = Math.abs(dx / Math.cos(theta));
    return { c, rx, ry, theta };
  };
  const orbits = bodies.map((b) => ({ b, ...orbitOf(b), px: b.size * W * sizeK }));

  // Earth's night-side horizon — a very large sphere whose cap fills the bottom
  const horizonTop = mobile ? H - 250 : H * 0.745;
  const earthR = mobile ? W * 1.35 : W * 2.05;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const items = orbits.map((o) => ({
      ...o,
      el: el.querySelector<HTMLElement>(`[data-body="${o.b.id}"]`),
      term: el.querySelector<HTMLElement>(`[data-body="${o.b.id}"] [data-terminator]`),
    }));
    let t = 0;
    const update = (dt: number) => {
      t += dt;
      for (const it of items) {
        if (!it.el) continue;
        const th = it.theta + (t / it.b.period) * Math.PI * 2;
        const x = it.c.x + Math.cos(th) * it.rx;
        const y = it.c.y + Math.sin(th) * it.ry;
        const s = 0.86 + 0.14 * ((Math.sin(th) + 1) / 2);
        it.el.style.transform = `translate3d(${(x - it.px / 2).toFixed(1)}px, ${(y - it.px / 2).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        if (it.term) {
          const a = (Math.atan2(sun.y - y, sun.x - x) * 180) / Math.PI;
          it.term.style.transform = `rotate(${(a + 180).toFixed(1)}deg)`;
        }
      }
    };

    const ctx = gsap.context(() => {
      update(0);
      gsap.set("[data-hero-in]", { opacity: 1 });
      if (reduced) return;
      document.documentElement.classList.add("hero-ready");

      let running = true;
      const tick = (_t: number, dMs: number) => { if (running) update(Math.min(dMs, 64) / 1000); };
      gsap.ticker.add(tick);
      const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; });
      io.observe(el);

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-layer='nebula']", { opacity: 0, duration: 2.4 }, 0)
        .from("[data-layer='sun']", { opacity: 0, scale: 0.7, duration: 2.2 }, 0.1)
        .from("[data-layer='wheel']", { opacity: 0, rotate: -30, duration: 2.6 }, 0.2)
        .from("[data-layer='earth']", { y: 60, opacity: 0, duration: 2.2 }, 0.2)
        .from("[data-layer='bodies']", { opacity: 0, duration: 2 }, 0.5)
        .from("[data-hero-copy] > *", { opacity: 0, y: 20, duration: 1.1, stagger: 0.1, ease: "expo.out" }, 0.5)
        .from("[data-features] > *", { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 }, 1.1);

      // drifting nebula and stars (continuous, transform-only)
      gsap.to("[data-layer='nebula'] > div", { xPercent: 2.5, yPercent: -2, scale: 1.05, duration: 24, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to("[data-layer='stars']", { x: 36, y: -18, duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to("[data-layer='glow-stars']", { x: -28, y: 14, duration: 32, ease: "sine.inOut", yoyo: true, repeat: -1 });

      const st = { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to("[data-hero-copy]", { y: -50, opacity: 0, ease: "none", scrollTrigger: st });

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
    // orbit geometry depends only on the hero size
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [W, H]);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#050510] md:h-[100svh] md:min-h-[760px] md:max-h-[980px]"
    >
      {/* ================= Universe ================= */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_30%,#0f0b2e_0%,#080B24_40%,#050510_78%)]" />

        <div data-layer="stars" className="absolute -inset-10">
          <div data-depth="5" className="absolute inset-0">
            <NightSky bandStrength={0.25} />
          </div>
        </div>

        {/* nebula sits above the (opaque) star canvas and screens over it */}
        <div data-layer="nebula" data-depth="10" className="absolute -inset-[4%]">
          <div ref={nebulaRef} className="h-full w-full mix-blend-screen" />
        </div>

        <div data-layer="glow-stars" className="absolute -inset-8">
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
        </div>

        {/* spiral galaxy (top left): tilted plane, spinning disc */}
        <div data-depth="16" className="absolute left-[-6%] top-[6%] hidden w-[38vw] sm:block max-w-[300px] sm:left-[0%] md:w-[21vw] md:max-w-[360px]" style={{ perspective: "800px" }}>
          <div className="aspect-square w-full" style={{ transform: "rotateZ(-26deg) rotateX(57deg)" }}>
            <div ref={galaxyRef} className="h-full w-full opacity-90 mix-blend-screen motion-safe:animate-[spin_160s_linear_infinite]" />
          </div>
        </div>

        {/* comet (top right) */}
        <div className="absolute right-[3%] top-[15%] hidden h-px w-44 md:block">
          <span className="hero-comet absolute inset-0" />
        </div>

        {/* orbital paths */}
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          {orbits.map((o) => (
            <ellipse key={o.b.id} cx={o.c.x} cy={o.c.y} rx={o.rx} ry={o.ry} fill="none" stroke="rgba(214,206,255,0.2)" strokeWidth="1" />
          ))}
        </svg>

        {/* Sun + zodiac arc, fading into the headline */}
        <div
          className="absolute [mask-image:linear-gradient(to_bottom,#000_0%,#000_50%,transparent_66%)]"
          style={{ left: sun.x - wheelSize / 2, top: sun.y - wheelSize / 2, width: wheelSize, height: wheelSize }}
        >
          <div className="absolute inset-0" style={{ transform: mobile ? "rotateX(56deg)" : "rotateX(62deg)" }}>
            <div data-layer="wheel" className="absolute inset-0 opacity-95 [filter:drop-shadow(0_0_6px_rgba(245,196,106,0.6))]">
              <ZodiacWheel color="#F5C46A" />
            </div>
          </div>
          <div data-layer="sun" className="absolute left-1/2 top-1/2" style={{ width: sunSize, height: sunSize, marginLeft: -sunSize / 2, marginTop: -sunSize / 2 }}>
            <div className="absolute -inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(255,170,80,0.42),rgba(245,140,60,0.16)_45%,rgba(139,92,246,0.08)_70%,transparent)] motion-safe:animate-pulse-glow" />
            <RealisticSun className="relative h-full w-full" />
          </div>
        </div>

        {/* planets on their orbits */}
        <div data-layer="bodies" className="absolute inset-0">
          {orbits.map(({ b, px }) => (
            <div key={b.id} data-body={b.id} className="absolute left-0 top-0 will-change-transform" style={{ width: px, height: px }}>
              {b.kind === "moon-lit" ? (
                <RotatingMoon light={MOON_LIGHT} period={b.spin} className="h-full w-full drop-shadow-[0_0_30px_rgba(226,232,255,0.25)]" />
              ) : b.kind === "saturn-ringed" ? (
                <Saturn size="100%" sphere terminatorAngle={200} />
              ) : (
                <Planet kind={b.kind} size="100%" spin={b.spin} sphere />
              )}
            </div>
          ))}
        </div>

        {/* Earth's night-side horizon */}
        <div data-layer="earth" className="absolute" style={{ left: W / 2 - earthR, top: horizonTop, width: earthR * 2, height: earthR * 2 }}>
          <div className="absolute inset-0 rounded-full shadow-[0_0_0_1.5px_rgba(165,200,255,0.75),0_-6px_30px_2px_rgba(96,165,250,0.6),0_-28px_110px_8px_rgba(99,102,241,0.45),0_-70px_220px_20px_rgba(139,92,246,0.25)]" />
          <div className="absolute inset-0 overflow-hidden rounded-full bg-[#04070f]">
            <div className="absolute top-0 overflow-hidden" style={{ left: earthR - W * 0.75, width: W * 1.5, height: H - horizonTop + 10 }}>
              <div ref={earthStripRef} className="h-full w-[200%] motion-safe:animate-[planet-spin_260s_linear_infinite]" />
              {/* sunlit limb at the top, deeper night below, darker edges */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(90,150,255,0.55)_0px,rgba(50,90,200,0.32)_14px,rgba(20,40,110,0.16)_60px,transparent_140px)]" />
              <div className="absolute inset-0 bg-[radial-gradient(55%_140%_at_50%_0%,rgba(36,70,190,0.55),rgba(20,40,120,0.3)_45%,transparent_75%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(4,6,14,0.55),transparent_20%,transparent_80%,rgba(4,6,14,0.55))]" />
            </div>
          </div>
        </div>

        {/* readability: soft scrim behind the copy, vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(38%_26%_at_50%_50%,rgba(5,5,16,0.55),transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(5,5,16,0.6)_100%)]" />
      </div>

      {/* ================= Copy ================= */}
      <div className="container-cosmic relative z-10 w-full pt-[282px] sm:pt-[clamp(200px,33svh,320px)] text-center">
        <div data-hero-copy data-hero-in className="mx-auto max-w-4xl [text-shadow:0_2px_22px_rgba(5,5,16,0.9)]">
          <p className="mb-5 text-[0.66rem] font-medium uppercase tracking-[0.34em] text-[#F8F7FF]/80 sm:text-xs">
            First Time, Original Intelligence Applied in Vedic Science
          </p>
          <h1 id="hero-title" className="font-display text-[2.45rem] font-semibold leading-[1.06] tracking-[-0.01em] text-[#F8F7FF] xs:text-5xl sm:text-6xl lg:text-[4.1rem]">
            Discover What The Universe
            <br className="hidden sm:block" />{" "}
            Has{" "}
            <span className="bg-[linear-gradient(100deg,#d8b4fe_0%,#a78bfa_45%,#c4b5fd_100%)] bg-clip-text text-transparent [text-shadow:none]">
              Written For You
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-7 text-[#F8F7FF]/80 sm:text-lg">
            30 years of experience in Vedic Astrology, Lal Kitab, KP and Numerology — honest guidance for life’s problems, with no false promises.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 xs:flex-row xs:gap-8">
            <Link
              href="/book-consultation"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-[linear-gradient(100deg,#8b5cf6,#a78bfa)] px-7 text-[0.95rem] font-semibold text-white shadow-[0_10px_30px_-8px_rgba(139,92,246,0.85)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_42px_-6px_rgba(167,139,250,1)]"
            >
              <CalendarDays className="size-4" aria-hidden /> Book Your Consultation
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <Link href="/services" className="group inline-flex items-center gap-3 text-[0.95rem] font-medium text-[#F8F7FF]/90 transition-colors hover:text-white">
              <span className="flex size-9 items-center justify-center rounded-full border border-white/60 transition-[border-color,box-shadow] duration-300 group-hover:border-white group-hover:shadow-[0_0_18px_-2px_rgba(196,181,253,0.8)]">
                <Compass className="size-4" aria-hidden />
              </span>
              Explore Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* ================= Service shortcuts on the horizon ================= */}
      <div className="container-cosmic relative z-10 mt-auto w-full pb-6 pt-16 sm:pb-8">
        <ul data-features className="mx-auto grid max-w-4xl grid-cols-2 gap-y-5 sm:grid-cols-4">
          {FEATURES.map(({ label, href, Icon }, i) => (
            <li key={href} className={i > 0 ? "sm:border-l sm:border-white/15" : undefined}>
              <Link href={href} className="group flex flex-col items-center gap-2.5 px-2 text-center text-[0.8rem] leading-snug text-[#F8F7FF]/85 transition-colors hover:text-white sm:text-sm">
                <Icon className="size-7 stroke-[1.3] text-[#F8F7FF] transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_8px_rgba(196,181,253,0.9))]" aria-hidden />
                <span className="whitespace-pre-line">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
