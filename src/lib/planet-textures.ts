/**
 * Procedural equirectangular planet textures (2:1), generated once on the
 * client and cached. Each texture is drawn twice side by side into a strip so
 * the planet can spin with a compositor-only translateX animation.
 */
import { createNoise, smoothstep } from "./noise";

export type PlanetKind = "earth" | "jupiter" | "saturn" | "mars" | "neptune" | "venus" | "moon";

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const cache = new Map<string, HTMLCanvasElement>();

/** Returns a strip canvas (texture × 2 horizontally). */
export function planetStrip(kind: PlanetKind, height = 256): HTMLCanvasElement {
  const key = `${kind}-${height}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const H = height, W = height * 2;
  const tex = document.createElement("canvas");
  tex.width = W; tex.height = H;
  const ctx = tex.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const seed = { earth: 21, jupiter: 5, saturn: 9, mars: 13, neptune: 17, venus: 29, moon: 7 }[kind];
  const n = createNoise(seed);

  for (let j = 0; j < H; j++) {
    const lat = (j / (H - 1) - 0.5) * Math.PI; // -pi/2 (top) .. pi/2
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let i = 0; i < W; i++) {
      const lon = (i / W) * Math.PI * 2;
      // sample on the sphere so the seam wraps cleanly
      const x = cl * Math.cos(lon), y = sl, z = cl * Math.sin(lon);
      let c: RGB;
      switch (kind) {
        case "earth": {
          const h = n.fbm3(x * 1.6 + 4, y * 1.6, z * 1.6, 6);
          const land = smoothstep(0.52, 0.56, h);
          const deep: RGB = [14, 46, 108], shallow: RGB = [38, 104, 178];
          const ocean = mix(deep, shallow, smoothstep(0.4, 0.52, h));
          const green: RGB = [52, 96, 48], desert: RGB = [168, 140, 92], dark: RGB = [34, 62, 36];
          const dry = smoothstep(0.45, 0.62, n.fbm3(x * 3 + 9, y * 3, z * 3, 4)) * (1 - Math.abs(sl) * 0.8);
          let ground = mix(mix(dark, green, smoothstep(0.56, 0.7, h)), desert, dry);
          const ice = smoothstep(0.82, 0.9, Math.abs(sl) + 0.05 * n.n3(x * 8, y * 8, z * 8));
          ground = mix(ground, [235, 240, 245], ice);
          c = mix(ocean, ground, land);
          c = mix(c, [236, 240, 246], ice * 0.9);
          const cloud = smoothstep(0.5, 0.72, n.fbm3(x * 3.2 + 20, y * 4.5, z * 3.2, 5));
          c = mix(c, [245, 247, 250], cloud * 0.85);
          break;
        }
        case "jupiter": {
          const turb = n.fbm3(x * 4, y * 9, z * 4, 5) - 0.5;
          const band = Math.sin(sl * 15 + turb * 3.2) * 0.5 + 0.5;
          const band2 = Math.sin(sl * 34 + turb * 5) * 0.5 + 0.5;
          const cream: RGB = [236, 220, 192], tan: RGB = [200, 158, 112], brown: RGB = [142, 98, 70];
          c = mix(mix(cream, tan, band), brown, band2 * 0.35 * (1 - band));
          // Great Red Spot
          const sx = lon - 2.2, sy = lat - 0.38;
          const spot = Math.exp(-((sx / 0.32) ** 2 + (sy / 0.11) ** 2));
          c = mix(c, [196, 108, 72], smoothstep(0.25, 0.75, spot));
          break;
        }
        case "saturn": {
          const turb = n.fbm3(x * 3, y * 7, z * 3, 4) - 0.5;
          const band = Math.sin(sl * 11 + turb * 1.6) * 0.5 + 0.5;
          c = mix([232, 212, 168], [204, 176, 128], band * 0.7);
          c = mix(c, [182, 160, 124], smoothstep(0.75, 0.95, Math.abs(sl)) * 0.6);
          break;
        }
        case "mars": {
          const h = n.fbm3(x * 2.4 + 2, y * 2.4, z * 2.4, 6);
          c = mix([196, 98, 58], [120, 58, 38], smoothstep(0.42, 0.62, h));
          c = mix(c, [228, 150, 104], smoothstep(0.6, 0.75, n.fbm3(x * 6, y * 6, z * 6, 3)) * 0.4);
          c = mix(c, [240, 232, 228], smoothstep(0.88, 0.95, Math.abs(sl)));
          break;
        }
        case "neptune": {
          const turb = n.fbm3(x * 3, y * 8, z * 3, 4) - 0.5;
          const band = Math.sin(sl * 9 + turb * 2) * 0.5 + 0.5;
          c = mix([46, 92, 210], [72, 128, 236], band);
          const spot = Math.exp(-(((lon - 4) / 0.25) ** 2 + ((lat + 0.3) / 0.1) ** 2));
          c = mix(c, [22, 42, 120], spot * 0.8);
          c = mix(c, [190, 214, 255], smoothstep(0.62, 0.8, n.fbm3(x * 5 + 3, y * 12, z * 5, 3)) * 0.35);
          break;
        }
        case "venus": {
          const swirl = n.fbm3(x * 2.5 + 7, y * 5, z * 2.5, 5);
          c = mix([214, 160, 72], [250, 214, 140], smoothstep(0.35, 0.7, swirl));
          break;
        }
        case "moon": {
          const m = smoothstep(0.49, 0.57, n.fbm3(x * 1.15 + 3, y * 1.15, z * 1.15, 4));
          const fine = n.fbm3(x * 9, y * 9, z * 9, 4) - 0.5;
          const v = 0.78 - 0.33 * m + 0.08 * fine;
          c = [v * 232, v * 228, v * 220];
          break;
        }
      }
      const k = (j * W + i) * 4;
      d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  if (kind === "moon") stampCraters(ctx, W, H);

  const strip = document.createElement("canvas");
  strip.width = W * 2; strip.height = H;
  const sctx = strip.getContext("2d")!;
  sctx.drawImage(tex, 0, 0);
  sctx.drawImage(tex, W, 0);
  cache.set(key, strip);
  return strip;
}

/** Shaded crater bowls with bright rims, drawn onto the moon texture. */
function stampCraters(ctx: CanvasRenderingContext2D, W: number, H: number) {
  let s = 42;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let c = 0; c < 170; c++) {
    const r = (2 + Math.pow(rand(), 4) * 16) * (H / 256);
    const x = rand() * W, y = H * 0.1 + rand() * H * 0.8;
    const rx = r / Math.max(0.35, Math.cos(((y / H) - 0.5) * Math.PI)); // stretch toward poles
    for (const ox of [0, -W, W]) {
      const g = ctx.createRadialGradient(x + ox - rx * 0.25, y - r * 0.25, 0, x + ox, y, rx);
      g.addColorStop(0, "rgba(40,38,46,0.42)");
      g.addColorStop(0.7, "rgba(60,58,66,0.18)");
      g.addColorStop(0.86, "rgba(255,255,255,0.22)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x + ox, y, rx, r, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Top-down ring texture for Saturn (square canvas). */
export function ringTexture(size = 512): HTMLCanvasElement {
  const key = `ring-${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = size;
  const ctx = cvs.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const d = img.data;
  const n = createNoise(33);
  const c = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - c + 0.5, dy = y - c + 0.5;
      const r = Math.hypot(dx, dy) / c; // 0..1
      if (r < 0.5 || r > 1) continue;
      const ang = Math.atan2(dy, dx);
      const bands = n.fbm2(r * 60, 0.5, 3);
      let a = smoothstep(0.5, 0.54, r) * (1 - smoothstep(0.97, 1, r));
      a *= 0.35 + 0.65 * bands;
      a *= 1 - 0.92 * Math.exp(-(((r - 0.79) / 0.012) ** 2)); // Cassini division
      a *= r > 0.88 ? 0.6 : 1;
      const grain = 0.85 + 0.3 * n.n2(Math.cos(ang) * 40 + r * 30, Math.sin(ang) * 40); // visible when spinning
      const k = (y * size + x) * 4;
      const t = smoothstep(0.55, 0.95, r);
      d[k] = (226 - 30 * t) * grain;
      d[k + 1] = (204 - 34 * t) * grain;
      d[k + 2] = (160 - 40 * t) * grain;
      d[k + 3] = 255 * Math.min(1, a);
    }
  }
  ctx.putImageData(img, 0, 0);
  cache.set(key, cvs);
  return cvs;
}

/** Soft purple/blue nebula clouds (low resolution, scaled up). */
export function renderNebula(w: number, h: number): HTMLCanvasElement {
  const cvs = document.createElement("canvas");
  cvs.width = w; cvs.height = h;
  const ctx = cvs.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const n = createNoise(77);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w, v = y / h;
      const a = n.fbm2(u * 3.2, v * 2.2, 6);
      const b = n.fbm2(u * 2.4 + 10, v * 3 + 4, 6);
      const purple = smoothstep(0.5, 0.82, a) * (0.55 + 0.45 * Math.sin(u * Math.PI));
      const blue = smoothstep(0.52, 0.85, b) * (0.4 + 0.6 * (1 - Math.abs(u - 0.5) * 1.4));
      const dust = smoothstep(0.55, 0.75, n.fbm2(u * 7 + 3, v * 7, 5));
      const k = (y * w + x) * 4;
      d[k] = 139 * purple + 37 * blue;
      d[k + 1] = 92 * purple + 99 * blue;
      d[k + 2] = 246 * purple + 235 * blue;
      d[k + 3] = Math.min(255, (purple * 0.5 + blue * 0.42) * 255 * (1 - 0.6 * dust));
    }
  }
  ctx.putImageData(img, 0, 0);
  return cvs;
}

/** A small spiral galaxy (square canvas). */
export function renderGalaxy(size = 420): HTMLCanvasElement {
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = size;
  const ctx = cvs.getContext("2d")!;
  let s = 99;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const c = size / 2;
  const core = ctx.createRadialGradient(c, c, 0, c, c, size * 0.22);
  core.addColorStop(0, "rgba(255,236,200,0.9)");
  core.addColorStop(0.25, "rgba(245,196,106,0.35)");
  core.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const arm = i % 2;
    const t = Math.pow(rand(), 0.7) * 3.4;
    const a = t * 1.9 + arm * Math.PI + (rand() - 0.5) * 0.55;
    const r = (t / 3.4) * c * 0.95 + (rand() - 0.5) * 10;
    const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r * 0.62;
    const blue = r / c;
    ctx.fillStyle = `rgba(${Math.round(255 - 120 * blue)},${Math.round(225 - 60 * blue)},255,${(0.75 - blue * 0.5) * (0.4 + rand() * 0.6)})`;
    const sz = rand() < 0.94 ? 1 : 1.8;
    ctx.fillRect(x, y, sz, sz);
  }
  return cvs;
}
