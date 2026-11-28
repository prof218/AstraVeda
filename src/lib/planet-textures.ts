/**
 * Procedural equirectangular planet textures (2:1), generated once on the
 * client and cached. Each texture is drawn twice side by side into a strip so
 * the planet can spin with a compositor-only translateX animation.
 */
import { createNoise, smoothstep } from "./noise";

export type PlanetKind = "earth" | "jupiter" | "saturn" | "mars" | "neptune" | "venus" | "moon" | "mercury";

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
  const seed = { earth: 21, jupiter: 5, saturn: 9, mars: 13, neptune: 17, venus: 29, moon: 7, mercury: 41 }[kind];
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
          // turbulent eddies along band edges (make rotation readable)
          const edge = Math.abs(Math.cos(sl * 15 + turb * 3.2));
          const eddy = n.fbm3(x * 14 + 3, y * 30, z * 14, 4);
          c = mix(c, [246, 236, 214], smoothstep(0.55, 0.75, eddy) * (1 - edge) * 0.55);
          c = mix(c, [120, 80, 60], smoothstep(0.62, 0.8, n.fbm3(x * 10, y * 22 + 5, z * 10, 3)) * 0.35);
          // dark blue-brown festoons in the equatorial zone
          const fest = smoothstep(0.6, 0.78, n.fbm3(x * 8 + 11, y * 18, z * 8, 3)) * Math.exp(-((lat / 0.12) ** 2));
          c = mix(c, [92, 78, 92], fest * 0.6);
          // white ovals in the southern temperate belt
          for (let o = 0; o < 4; o++) {
            const dl = Math.atan2(Math.sin(lon - (0.9 + o * 1.55)), Math.cos(lon - (0.9 + o * 1.55)));
            const ov = Math.exp(-((dl / 0.13) ** 2 + ((lat - 0.62) / 0.045) ** 2));
            c = mix(c, [250, 246, 236], smoothstep(0.3, 0.8, ov) * 0.85);
          }
          // Great Red Spot
          const sx = Math.atan2(Math.sin(lon - 2.2), Math.cos(lon - 2.2)), sy = lat - 0.38;
          const spot = Math.exp(-((sx / 0.32) ** 2 + (sy / 0.11) ** 2));
          c = mix(c, [190, 96, 62], smoothstep(0.2, 0.75, spot));
          c = mix(c, [236, 214, 186], smoothstep(0.08, 0.2, spot) * (1 - smoothstep(0.2, 0.4, spot)) * 0.5);
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
        case "mercury": {
          const h = n.fbm3(x * 3 + 1, y * 3, z * 3, 6);
          const v = 0.5 + 0.28 * (h - 0.5) + 0.1 * (n.fbm3(x * 12, y * 12, z * 12, 3) - 0.5);
          c = [v * 196, v * 182, v * 168];
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
  if (kind === "moon" || kind === "mercury") stampCraters(ctx, W, H);

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

/* ------------------------------------------------------------------ */
/*  Reference-style scene assets                                       */
/* ------------------------------------------------------------------ */

/** Vivid purple nebula concentrated on the left and right edges. */
export function renderSideNebula(w: number, h: number): HTMLCanvasElement {
  const cvs = document.createElement("canvas");
  cvs.width = w; cvs.height = h;
  const ctx = cvs.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const n = createNoise(91);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w, v = y / h;
      // side masks: left cloud high-middle, right cloud middle-low, faint top wash
      const left = Math.exp(-(((u - 0.05) / 0.27) ** 2) - (((v - 0.42) / 0.36) ** 2));
      const right = Math.exp(-(((u - 0.95) / 0.27) ** 2) - (((v - 0.6) / 0.34) ** 2));
      const top = Math.exp(-(((v - 0.05) / 0.25) ** 2)) * 0.25;
      const mask = Math.min(1, left + right + top);
      const cloud = n.fbm2(u * 4.5, v * 4.5, 6);
      const wisps = n.fbm2(u * 11 + 7, v * 11, 5);
      const dust = smoothstep(0.52, 0.7, n.fbm2(u * 6 + 30, v * 6, 5));
      const dens = Math.max(0, smoothstep(0.32, 0.75, cloud) * 1.05 + smoothstep(0.5, 0.82, wisps) * 0.55) * mask * (1 - 0.65 * dust);
      const hot = smoothstep(0.62, 0.9, cloud * wisps * 1.6) * mask;
      const k = (y * w + x) * 4;
      // violet body, magenta-pink highlights, deep blue edges
      d[k] = Math.min(255, 96 * dens + 120 * hot + 20 * mask);
      d[k + 1] = Math.min(255, 40 * dens + 60 * hot + 10 * mask);
      d[k + 2] = Math.min(255, 210 * dens + 120 * hot + 60 * mask);
      d[k + 3] = Math.min(255, 255 * Math.min(1, dens * 1.05 + hot * 0.6 + mask * 0.12));
    }
  }
  ctx.putImageData(img, 0, 0);
  return cvs;
}

/** Face-on purple spiral galaxy; tilt it in CSS and spin the canvas. */
export function renderSpiralGalaxy(size = 520): HTMLCanvasElement {
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = size;
  const ctx = cvs.getContext("2d")!;
  let s = 7;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const c = size / 2;
  const halo = ctx.createRadialGradient(c, c, 0, c, c, c);
  halo.addColorStop(0, "rgba(255,230,250,0.95)");
  halo.addColorStop(0.1, "rgba(236,170,255,0.75)");
  halo.addColorStop(0.35, "rgba(150,90,240,0.32)");
  halo.addColorStop(1, "rgba(80,40,180,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);
  // broad purple disc glow
  const disc = ctx.createRadialGradient(c, c, 0, c, c, c * 0.9);
  disc.addColorStop(0, "rgba(190,140,255,0.55)");
  disc.addColorStop(0.5, "rgba(130,80,230,0.3)");
  disc.addColorStop(1, "rgba(90,50,200,0)");
  ctx.fillStyle = disc;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 16000; i++) {
    const arm = i % 2;
    const t = Math.pow(rand(), 0.8);
    const a = t * 6.4 + arm * Math.PI + (rand() - 0.5) * (0.7 + t * 0.7);
    const r = t * c * 0.92 + (rand() - 0.5) * 6;
    const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r;
    const pink = rand() < 0.12;
    const col = pink ? "255,150,230" : t < 0.25 ? "255,220,250" : rand() < 0.5 ? "170,120,255" : "120,150,255";
    ctx.fillStyle = `rgba(${col},${(0.55 - t * 0.35) * (0.35 + rand() * 0.65)})`;
    const sz = rand() < 0.9 ? 1.2 : 2.2;
    ctx.fillRect(x, y, sz, sz);
  }
  // dust lanes
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 380; i++) {
    const arm = i % 2;
    const t = 0.2 + rand() * 0.7;
    const a = t * 6.4 + arm * Math.PI + 0.5;
    const r = t * c * 0.92;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, 2 + rand() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "lighter";
  const core = ctx.createRadialGradient(c, c, 0, c, c, c * 0.16);
  core.addColorStop(0, "rgba(255,255,255,1)");
  core.addColorStop(0.35, "rgba(255,220,250,0.8)");
  core.addColorStop(1, "rgba(230,160,255,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "source-over";
  return cvs;
}

/** Earth's night side for the horizon: dark oceans, faint land, city lights. Tileable horizontally. */
export function renderNightEarthStrip(w = 2048, h = 360): HTMLCanvasElement {
  const cvs = document.createElement("canvas");
  cvs.width = w; cvs.height = h;
  const ctx = cvs.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const n = createNoise(55);
  const landAt = (u: number, v: number) => {
    const ang = u * Math.PI * 2;
    // sample on a cylinder so the strip tiles seamlessly
    return n.fbm3(Math.cos(ang) * 2.2, v * 3.2, Math.sin(ang) * 2.2, 6);
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const u = x / w, v = y / h;
      const land = smoothstep(0.5, 0.54, landAt(u, v));
      const ang = u * Math.PI * 2;
      const cloud = smoothstep(0.55, 0.75, n.fbm3(Math.cos(ang) * 4 + 9, v * 7, Math.sin(ang) * 4, 5));
      let r = 8 + 10 * land, g = 20 + 14 * land, b = 56 + 6 * land;
      r += cloud * 40; g += cloud * 60; b += cloud * 95;
      const k = (y * w + x) * 4;
      d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // city lights: clustered on land
  let s = 3;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3200; i++) {
    const u = rand(), v = 0.15 + rand() * 0.85;
    if (landAt(u, v) < 0.53) continue;
    const cluster = n.fbm2(u * 40, v * 20, 3);
    if (rand() > cluster * cluster * 1.6) continue;
    const x = u * w, y = v * h;
    const rad = 0.6 + rand() * 1.4;
    const gl = ctx.createRadialGradient(x, y, 0, x, y, rad * 5);
    gl.addColorStop(0, "rgba(255,214,140,0.8)");
    gl.addColorStop(0.3, "rgba(255,160,70,0.25)");
    gl.addColorStop(1, "rgba(255,120,40,0)");
    ctx.fillStyle = gl;
    ctx.fillRect(x - rad * 5, y - rad * 5, rad * 10, rad * 10);
  }
  ctx.globalCompositeOperation = "source-over";
  return cvs;
}
