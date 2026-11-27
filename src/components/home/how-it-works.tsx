"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { IconName } from "@/types";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/common/section";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const steps: { title: string; text: string; icon: IconName }[] = [
  { title: "Choose Your Service", text: "Pick the consultation that fits your question — or a general session if you're unsure.", icon: "sparkles" },
  { title: "Share Your Birth Details", text: "Date, exact time and place of birth let us prepare your chart in advance.", icon: "scroll" },
  { title: "Schedule Your Consultation", text: "Select a date, a time slot and how you'd like to talk — video, audio or chat.", icon: "calendar" },
  { title: "Receive Personal Guidance", text: "A focused, unhurried session with clear insights and practical next steps.", icon: "star" },
];

export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: "[data-steps]", start: "top 78%", end: "bottom 60%", scrub: 0.8 },
      });
      tl.fromTo("[data-line]", { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: "none", duration: 1 }, 0);
      gsap.utils.toArray<HTMLElement>("[data-node]").forEach((node, i) => {
        tl.fromTo(node, { scale: 0.4, opacity: 0.2 }, { scale: 1, opacity: 1, ease: "back.out(2)", duration: 0.25 }, i * 0.25);
      });
      gsap.from("[data-step]", {
        opacity: 0, y: 30, stagger: 0.12, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: "[data-steps]", start: "top 80%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="how-title" className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <div className="container-cosmic relative">
        <SectionHeading
          id="how-title"
          eyebrow="How Consultation Works"
          title={<>Four steps to <em className="text-gradient">clarity</em></>}
          description="A simple, calm process from the moment you choose a service to the guidance you take away."
        />

        <ol data-steps className="relative mt-20 grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* constellation line: horizontal on desktop, vertical on mobile */}
          <span aria-hidden data-line className="absolute left-[1.75rem] top-7 hidden h-px origin-left bg-lavender/40 lg:left-[12.5%] lg:right-[12.5%] lg:block" />
          <span aria-hidden data-line className="absolute bottom-10 left-7 top-7 w-px origin-top bg-lavender/40 lg:hidden" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-6 lg:flex-col lg:items-center lg:text-center">
              <span data-node className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border border-lavender/40 bg-abyss text-lavender">
                <Icon name={s.icon} className="size-5" />
                <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-star text-[0.65rem] font-bold text-void">{i + 1}</span>
              </span>
              <div data-step className="lg:mt-8">
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted lg:mx-auto lg:max-w-[15rem]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
