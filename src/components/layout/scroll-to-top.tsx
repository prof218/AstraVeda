"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setShow(window.scrollY > 700);
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const c = 2 * Math.PI * 20;
  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={cn(
        "fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full border border-line bg-abyss/80 text-lavender backdrop-blur-md transition-colors duration-500 hover:text-star sm:bottom-7 sm:right-7",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="22" cy="22" r="20" fill="none" stroke="url(#stt)" strokeWidth="1.5" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} strokeLinecap="round" />
        <defs>
          <linearGradient id="stt"><stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#38bdf8" /></linearGradient>
        </defs>
      </svg>
      <ArrowUp className="size-4" />
    </button>
  );
}
