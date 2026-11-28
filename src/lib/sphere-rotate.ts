/**
 * Real axial rotation for canvas-rendered spheres.
 *
 * Each disc pixel is mapped once to (latitude, longitude) plus any constant
 * lighting terms. Every frame only the longitude offset ("phase", 0..1)
 * changes, so surface features travel across the globe exactly like a
 * rotating sphere — fast through the centre, foreshortened at the limb —
 * instead of sliding like a flat image.
 */
import { buildMoonMaps } from "./celestial-render";
import { smoothstep } from "./noise";

export type SphereRenderer = { canvas: HTMLCanvasElement; render: (phase: number) => void };

type Lut = {
  n: number;
  pix: Int32Array; // byte offset into ImageData
  u: Float32Array; // longitude fraction 0..1 for phase 0
  y0: Int32Array;
  y1: Int32Array;
  fy: Float32Array;
  nz: Float32Array;
  edge: Float32Array;
};

function buildLut(size: number, texW: number, texH: number, extra?: (i: number, x: number, y: number, nz: number, lat: number, lon: number) => void): Lut {
  const R = size / 2 - 0.5;
  const cap = size * size;
  const pix = new Int32Array(cap), u = new Float32Array(cap), y0 = new Int32Array(cap), y1 = new Int32Array(cap);
  const fy = new Float32Array(cap), nzA = new Float32Array(cap), edge = new Float32Array(cap);
  let n = 0;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = (px - size / 2 + 0.5) / R;
      const y = -(py - size / 2 + 0.5) / R;
      const rr = x * x + y * y;
      if (rr > 1.004) continue;
      const nz = Math.sqrt(Math.max(0, 1 - rr));
      const lat = Math.asin(Math.max(-1, Math.min(1, y)));
      const lon = Math.atan2(x, nz);
      pix[n] = (py * size + px) * 4;
      u[n] = (lon + Math.PI) / (Math.PI * 2);
      // texture rows run north (top) to south (bottom)
      const v = (0.5 - lat / Math.PI) * (texH - 1);
      y0[n] = Math.floor(v);
      y1[n] = Math.min(texH - 1, y0[n] + 1);
      fy[n] = v - y0[n];
      nzA[n] = nz;
      edge[n] = Math.min(1, Math.max(0, (1 - Math.sqrt(rr)) * R + 0.5));
      extra?.(n, x, y, nz, lat, lon);
      n++;
    }
  }
  return { n, pix, u, y0, y1, fy, nz: nzA, edge };
}

/**
 * The Moon, lit by a fixed light direction (towards the Sun), with crater
 * relief re-shaded every frame as the surface turns.
 */
export function createRotatingMoon(size: number, light: [number, number, number]): SphereRenderer {
  const { albedo, height, MW, MH } = buildMoonMaps();
  // The shared maps store row 0 at the south pole; flip to north-up once.
  const A = new Float32Array(MW * MH), GU = new Float32Array(MW * MH), GV = new Float32Array(MW * MH);
  for (let j = 0; j < MH; j++) {
    const src = (MH - 1 - j) * MW, dst = j * MW;
    for (let i = 0; i < MW; i++) A[dst + i] = albedo[src + i];
  }
  for (let j = 0; j < MH; j++) {
    const s = MH - 1 - j;
    for (let i = 0; i < MW; i++) {
      const h = height[s * MW + i];
      GU[j * MW + i] = (height[s * MW + ((i + 1) % MW)] - h) * (MW / (Math.PI * 2));
      GV[j * MW + i] = (height[Math.min(MH - 1, s + 1) * MW + i] - h) * (MH / Math.PI);
    }
  }

  const ll = Math.hypot(...light);
  const L = light.map((v) => v / ll) as [number, number, number];
  const cap = size * size;
  const geo = new Float32Array(cap), eL = new Float32Array(cap), tL = new Float32Array(cap);
  const term = new Float32Array(cap), earthW = new Float32Array(cap);
  const lut = buildLut(size, MW, MH, (i, x, y, nz, lat, lon) => {
    const g = x * L[0] + y * L[1] + nz * L[2];
    const cl = Math.max(0.12, Math.cos(lat));
    const sLon = Math.sin(lon), cLon = Math.cos(lon), sLat = Math.sin(lat);
    geo[i] = g;
    eL[i] = (cLon * L[0] - sLon * L[2]) / cl;
    tL[i] = -sLat * sLon * L[0] + Math.cos(lat) * L[1] - sLat * cLon * L[2];
    term[i] = smoothstep(-0.04, 0.12, g);
    earthW[i] = 0.035 * (1 - smoothstep(-0.05, 0.1, g));
  });

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const bump = 1.0;

  const render = (phase: number) => {
    for (let k = 0; k < lut.n; k++) {
      let uu = lut.u[k] - phase;
      uu -= Math.floor(uu);
      const xf = uu * MW;
      const x0 = xf | 0, x1 = (x0 + 1) % MW, fx = xf - x0;
      const r0 = lut.y0[k] * MW, r1 = lut.y1[k] * MW, fyy = lut.fy[k];
      const a0 = A[r0 + x0] + (A[r0 + x1] - A[r0 + x0]) * fx;
      const a1 = A[r1 + x0] + (A[r1 + x1] - A[r1 + x0]) * fx;
      const a = Math.max(0.05, a0 + (a1 - a0) * fyy);
      const row = fyy < 0.5 ? r0 : r1;
      const gu = GU[row + x0] + (GU[row + x1] - GU[row + x0]) * fx;
      const gv = GV[row + x0] + (GV[row + x1] - GV[row + x0]) * fx;
      const mu0 = Math.max(0, geo[k] - bump * (gu * eL[k] + gv * tL[k]));
      const mu = Math.max(0.02, lut.nz[k]);
      const I = a * (2.05 * (mu0 / (mu0 + mu)) + 0.18 * mu0) * term[k];
      const e = a * earthW[k];
      const p = lut.pix[k];
      d[p] = Math.min(255, I * 236 + e * 150);
      d[p + 1] = Math.min(255, I * 229 + e * 170);
      d[p + 2] = Math.min(255, I * 216 + e * 210);
      d[p + 3] = 255 * lut.edge[k];
    }
    ctx.putImageData(img, 0, 0);
  };
  return { canvas, render };
}

/**
 * A rotating textured globe (unlit albedo with gentle limb falloff). Lighting
 * and the day/night terminator stay on fixed overlay layers above it.
 */
export function createRotatingGlobe(size: number, texture: HTMLCanvasElement, texW: number, texH: number): SphereRenderer {
  const tex = texture.getContext("2d")!.getImageData(0, 0, texW, texH).data;
  const lut = buildLut(size, texW, texH);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const render = (phase: number) => {
    for (let k = 0; k < lut.n; k++) {
      let uu = lut.u[k] - phase;
      uu -= Math.floor(uu);
      const xf = uu * texW;
      const x0 = xf | 0, x1 = (x0 + 1) % texW, fx = xf - x0;
      const r0 = lut.y0[k] * texW, r1 = lut.y1[k] * texW, fyy = lut.fy[k];
      const i00 = (r0 + x0) * 4, i01 = (r0 + x1) * 4, i10 = (r1 + x0) * 4, i11 = (r1 + x1) * 4;
      const shade = 0.8 + 0.2 * lut.nz[k];
      const p = lut.pix[k];
      for (let c = 0; c < 3; c++) {
        const top = tex[i00 + c] + (tex[i01 + c] - tex[i00 + c]) * fx;
        const bot = tex[i10 + c] + (tex[i11 + c] - tex[i10 + c]) * fx;
        d[p + c] = (top + (bot - top) * fyy) * shade;
      }
      d[p + 3] = 255 * lut.edge[k];
    }
    ctx.putImageData(img, 0, 0);
  };
  return { canvas, render };
}

/**
 * Drives a renderer at ~30fps with a linear rotation; pauses offscreen and in
 * hidden tabs, renders a single frame when the user prefers reduced motion.
 * Returns a cleanup function.
 */
export function animateRotation(r: SphereRenderer, periodSec: number, observe: Element): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = performance.now() - Math.random() * periodSec * 1000;
  r.render(((performance.now() - start) / 1000 / periodSec) % 1);
  if (reduced) return () => {};
  let raf = 0, last = 0, visible = true;
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden || t - last < 33) return;
    last = t;
    r.render(((t - start) / 1000 / periodSec) % 1);
  };
  raf = requestAnimationFrame(loop);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(observe);
  return () => { cancelAnimationFrame(raf); io.disconnect(); };
}
