"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { planetStrip, ringTexture, type PlanetKind } from "@/lib/planet-textures";
import { cn } from "@/lib/utils";

const ATMOSPHERE: Record<PlanetKind, string> = {
  earth: "0 0 18px 2px rgba(96,165,250,0.55), 0 0 60px 6px rgba(37,99,235,0.25)",
  jupiter: "0 0 26px 2px rgba(245,196,106,0.25)",
  saturn: "0 0 24px 2px rgba(245,196,106,0.25)",
  mars: "0 0 14px 1px rgba(251,146,60,0.35)",
  neptune: "0 0 18px 2px rgba(96,165,250,0.5), 0 0 40px 4px rgba(37,99,235,0.3)",
  venus: "0 0 18px 4px rgba(245,196,106,0.65), 0 0 50px 10px rgba(245,196,106,0.25)",
  moon: "0 0 40px 6px rgba(226,232,255,0.22), 0 0 120px 24px rgba(139,92,246,0.18)",
};

/**
 * A spinning planet: a procedural equirectangular texture strip slides behind
 * a circular mask (compositor-only translateX), with sphere shading on top and
 * a day/night terminator the parent rotates toward the Sun via `data-terminator`.
 */
export function Planet({
  kind, size, spin = 40, className, style, terminatorAngle = 0,
}: {
  kind: PlanetKind;
  size: number | string;
  /** seconds per full rotation */
  spin?: number;
  className?: string;
  style?: CSSProperties;
  /** initial direction (deg) towards the light source */
  terminatorAngle?: number;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const strip = planetStrip(kind, kind === "moon" ? 384 : 256);
    strip.className = "planet-strip";
    strip.style.cssText = `position:absolute;inset:0 auto 0 0;height:100%;width:400%;animation:planet-spin ${spin}s linear infinite;`;
    const slot = el.querySelector("[data-strip]");
    slot?.appendChild(strip);
    return () => { strip.remove(); };
  }, [kind, spin]);

  return (
    <div
      ref={host}
      aria-hidden
      className={cn("relative rounded-full", className)}
      style={{ width: size, height: size, boxShadow: ATMOSPHERE[kind], ...style }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-full bg-[#0a0a18]">
        <div data-strip className="absolute inset-0" />
        {/* sphere curvature: soft specular + limb darkening */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.22),transparent_42%),radial-gradient(circle_at_50%_50%,transparent_52%,rgba(0,0,8,0.55)_100%)]" />
        {/* day / night side, rotated toward the Sun by the orbit system */}
        <div
          data-terminator
          className="absolute -inset-[2%] bg-[radial-gradient(115%_115%_at_14%_50%,transparent_40%,rgba(3,3,14,0.55)_58%,rgba(3,3,14,0.92)_74%)]"
          style={{ transform: `rotate(${terminatorAngle + 180}deg)` }}
        />
      </div>
    </div>
  );
}

/** Saturn with 3D-tilted, spinning rings that pass in front of and behind the globe. */
export function Saturn({ size, className, terminatorAngle = 180 }: { size: number | string; className?: string; terminatorAngle?: number }) {
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringTexture(512);
    const add = (slot: HTMLDivElement | null) => {
      if (!slot) return () => {};
      const c = document.createElement("canvas");
      c.width = c.height = 512;
      c.getContext("2d")!.drawImage(ring, 0, 0);
      c.style.cssText = "width:100%;height:100%;animation:spin 90s linear infinite;";
      slot.appendChild(c);
      return () => c.remove();
    };
    const a = add(back.current), b = add(front.current);
    return () => { a(); b(); };
  }, []);

  const ringBox = "pointer-events-none absolute left-1/2 top-1/2 h-[250%] w-[250%]";
  return (
    <div aria-hidden className={cn("relative", className)} style={{ width: size, height: size }}>
      <div className={ringBox} style={{ transform: "translate(-50%,-50%) rotate(-20deg)" }}>
        <div ref={back} className="h-full w-full" style={{ transform: "rotateX(76deg)" }} />
      </div>
      <Planet kind="saturn" size="100%" spin={34} terminatorAngle={terminatorAngle} className="absolute inset-0" />
      <div className={ringBox} style={{ transform: "translate(-50%,-50%) rotate(-20deg)", clipPath: "inset(50% 0 0 0)" }}>
        <div ref={front} className="h-full w-full" style={{ transform: "rotateX(76deg)" }} />
      </div>
    </div>
  );
}
