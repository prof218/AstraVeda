"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { NightSky } from "@/components/cosmic/night-sky";
import { RealisticMoon, RealisticSun } from "@/components/cosmic/realistic-bodies";
import { stats } from "@/data/astrologer";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Direction from the Moon towards the Sun (view space): the Sun sits up-left of it. */
const SUN_DIRECTION: [number, number, number] = [-0.7, 0.42, 0.58];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-in]", { opacity: 1 });
      if (reduced) return;
      document.documentElement.classList.add("hero-ready");

      // One entrance: the bodies settle in, then the copy fades and rises 10px.
      const ease = "power3.out";
      gsap.from("[data-moon]", { opacity: 0, y: 24, duration: 2.4, ease });
      gsap.from("[data-sun]", { opacity: 0, duration: 2.6, ease, delay: 0.3 });
      gsap.from("[data-copy] > *", { opacity: 0, y: 10, duration: 0.9, ease, stagger: 0.06, delay: 0.25 });

      // Scroll: copy eases out, the sky drifts a little slower than the page.
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: 0.5 };
      gsap.to("[data-copy]", { opacity: 0, y: -40, ease: "none", scrollTrigger: st });
      gsap.to("[data-moon-scroll]", { yPercent: 14, ease: "none", scrollTrigger: st });

      // Very gentle depth on pointer move (a few pixels — the sky is far away).
      if (finePointer) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((node) => ({
          d: Number(node.dataset.depth),
          x: gsap.quickTo(node, "x", { duration: 2, ease }),
          y: gsap.quickTo(node, "y", { duration: 2, ease }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          for (const l of layers) { l.x(-nx * l.d); l.y(-ny * l.d); }
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-void">
      {/* ===== The sky ===== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div data-depth="6" className="absolute -inset-4">
          <NightSky />
        </div>

        <div data-depth="12" className="absolute left-[58%] top-[10%] hidden lg:block">
          <div data-sun><RealisticSun className="w-36 xl:w-44" /></div>
        </div>
        <div data-depth="12" className="absolute left-[56%] top-[15%] hidden sm:block lg:hidden">
          <div data-sun><RealisticSun className="w-24" /></div>
        </div>

        <div data-moon-scroll className="absolute right-[-28vw] top-[9vh] sm:right-[-16vw] sm:top-[14vh] md:right-[-8vw] lg:right-[3vw] lg:top-[19vh]">
          <div data-depth="16">
            <div data-moon>
              <RealisticMoon light={SUN_DIRECTION} className="w-[70vw] opacity-45 sm:w-[54vw] sm:opacity-80 md:w-[44vw] lg:w-[min(34vw,540px)] lg:opacity-100" />
            </div>
          </div>
        </div>

        {/* keep the headline side calm, fade into the page */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,3,11,0.82)_0%,rgba(5,3,11,0.45)_38%,transparent_62%)] lg:bg-[linear-gradient(90deg,rgba(5,3,11,0.7)_0%,rgba(5,3,11,0.25)_40%,transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-void" />
      </div>

      {/* ===== Copy ===== */}
      <div className="container-cosmic relative w-full pb-24 pt-32 sm:pt-36">
        <div data-copy data-hero-in className="max-w-[40rem]">
          <p className="mb-6 text-sm text-star/70">Ancient wisdom · modern guidance</p>
          <h1 id="hero-title" className="text-[2.75rem] leading-[1.02] tracking-[-0.02em] xs:text-6xl sm:text-7xl lg:text-[5.25rem]">
            Discover what the universe has written for you
          </h1>
          <p className="mt-7 max-w-[34rem] text-lg leading-8 text-star/72">
            Explore your cosmic journey through personalized astrology, ancient wisdom, and expert celestial guidance.
          </p>
          <div className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
            <ButtonLink href="/book-consultation" size="lg">
              Book your consultation <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="secondary">Explore our services</ButtonLink>
          </div>
          <dl className="mt-14 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-line pt-6 text-sm">
            <div className="flex items-baseline gap-2">
              <dt className="sr-only">Experience</dt>
              <dd className="font-display text-3xl tabular-nums text-star">{stats[0].value}+</dd>
              <span className="text-star/60">years of practice</span>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="sr-only">Consultations</dt>
              <dd className="font-display text-3xl tabular-nums text-star">{(stats[2].value / 1000).toFixed(0)}k+</dd>
              <span className="text-star/60">consultations</span>
            </div>
            <p className="text-xs text-faint">Placeholder figures</p>
          </dl>
        </div>
      </div>

      <a href="#stats" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-star/50 transition-colors hover:text-star sm:flex">
        Scroll
        <span aria-hidden className="h-9 w-px bg-gradient-to-b from-star/50 to-transparent" />
      </a>
    </section>
  );
}
