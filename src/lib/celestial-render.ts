/**
 * Procedural, physically-inspired renderers for the hero sky.
 * Everything is computed once into canvases (no per-frame cost).
 *
 *  - renderMoon:  equirectangular albedo + height maps (maria, craters, ray
 *                 systems), bump-mapped and lit with the Lommel–Seeliger law,
 *                 which is what gives the real Moon its flat, bright look.
 *  - renderSun:   limb-darkened photosphere with granulation, plus a separate
 *                 corona canvas with radial streamers.
 *  - renderSky:   astrophotography-style Milky Way band with dust lanes,
 *                 colour-graded star field and a few bright stars with
 *                 diffraction spikes.
 */
import { createNoise, smoothstep } from "./noise";
import { seededRandom } from "./utils";

/* ------------------------------------------------------------------ */
/*  Moon                                                               */
/* ------------------------------------------------------------------ */

type MoonMaps = { albedo: Float32Array; height: Float32Array; MW: number; MH: number };
let moonMapsCache: MoonMaps | null = null;

/** Equirectangular albedo + height maps for the Moon (built once, cached). */
export function buildMoonMaps(): MoonMaps {
  if (moonMapsCache) return moonMapsCache;
  const noise = createNoise(7);
  const rand = seededRandom(1969);
  const MW = 512, MH = 256;
  const albedo = new Float32Array(MW * MH);
  const height = new Float32Array(MW * MH);

  // --- base maps (3D noise sampled on the sphere = no seams) ---
  for (let j = 0; j < MH; j++) {
    const lat = (j / (MH - 1) - 0.5) * Math.PI;
    const cl = Math.cos(lat), sl = Math.sin(lat);
    for (let i = 0; i < MW; i++) {
      const lon = (i / MW) * Math.PI * 2 - Math.PI;
      const x = cl * Math.sin(lon), y = sl, z = cl * Math.cos(lon);
      const m = noise.fbm3(x * 1.15 + 3, y * 1.15, z * 1.15, 4);
      const maria = smoothstep(0.49, 0.57, m);
      const fine = noise.fbm3(x * 9, y * 9, z * 9, 4) - 0.5;
      const k = j * MW + i;
      albedo[k] = 0.78 - 0.33 * maria + 0.06 * fine * (1 - 0.6 * maria);
      height[k] = 0.02 * (noise.fbm3(x * 5 + 9, y * 5, z * 5, 4) - 0.5);
    }
  }

  // --- craters (power-law sizes) ---
  type Crater = { cx: number; cy: number; cz: number; r: number; young: boolean };
  const craters: Crater[] = [];
  for (let c = 0; c < 240; c++) {
    const u = rand(), v = rand();
    const lat = Math.asin(2 * u - 1);
    const lon = v * Math.PI * 2 - Math.PI;
    const r = 0.007 + 0.09 * Math.pow(rand(), 6);
    craters.push({ cx: Math.cos(lat) * Math.sin(lon), cy: Math.sin(lat), cz: Math.cos(lat) * Math.cos(lon), r, young: rand() < 0.16 });
  }
  // A prominent rayed crater (Tycho-like) in the southern front hemisphere
  craters.push({ cx: Math.cos(-0.75) * Math.sin(-0.2), cy: Math.sin(-0.75), cz: Math.cos(-0.75) * Math.cos(-0.2), r: 0.035, young: true });
  const rayed = craters[craters.length - 1];

  for (const cr of craters) {
    const clat = Math.asin(cr.cy);
    const clon = Math.atan2(cr.cx, cr.cz);
    const reach = cr.r * 1.9;
    const j0 = Math.max(0, Math.floor(((clat - reach) / Math.PI + 0.5) * (MH - 1)));
    const j1 = Math.min(MH - 1, Math.ceil(((clat + reach) / Math.PI + 0.5) * (MH - 1)));
    const lonReach = reach / Math.max(0.15, Math.cos(clat));
    const di = Math.ceil((lonReach / (Math.PI * 2)) * MW);
    const ic = Math.round(((clon + Math.PI) / (Math.PI * 2)) * MW);
    const depth = cr.r * (cr.young ? 0.42 : 0.28);
    for (let j = j0; j <= j1; j++) {
      const lat = (j / (MH - 1) - 0.5) * Math.PI;
      const cl = Math.cos(lat), sl = Math.sin(lat);
      for (let ii = ic - di; ii <= ic + di; ii++) {
        const i = ((ii % MW) + MW) % MW;
        const lon = (i / MW) * Math.PI * 2 - Math.PI;
        const dot = cl * Math.sin(lon) * cr.cx + sl * cr.cy + cl * Math.cos(lon) * cr.cz;
        const ang = Math.acos(Math.min(1, Math.max(-1, dot)));
        const d = ang / cr.r;
        if (d > 1.9) continue;
        const k = j * MW + i;
        let h = 0;
        if (d < 1) h -= depth * (1 - d * d);
        h += depth * 0.45 * Math.exp(-(((d - 1) / 0.16) ** 2));
        height[k] += h;
        albedo[k] += (cr.young ? 0.1 : 0.025) * Math.exp(-(((d - 1.05) / 0.35) ** 2));
      }
    }
  }

  // --- ray system for the young crater ---
  {
    const c = rayed;
    for (let j = 0; j < MH; j++) {
      const lat = (j / (MH - 1) - 0.5) * Math.PI;
      const cl = Math.cos(lat), sl = Math.sin(lat);
      for (let i = 0; i < MW; i++) {
        const lon = (i / MW) * Math.PI * 2 - Math.PI;
        const px = cl * Math.sin(lon), py = sl, pz = cl * Math.cos(lon);
        const dot = px * c.cx + py * c.cy + pz * c.cz;
        if (dot < 0.55) continue;
        const ang = Math.acos(Math.min(1, dot));
        // direction angle around crater using a local tangent basis
        const ex = c.cz, ez = -c.cx; // east-ish
        const nx = -c.cy * c.cx, ny = 1 - c.cy * c.cy, nz = -c.cy * c.cz; // north-ish
        const theta = Math.atan2(px * nx + py * ny + pz * nz, px * ex + pz * ez);
        const rays = Math.pow(Math.abs(Math.sin(theta * 7 + noise.n2(theta * 3, 1) * 3)), 18);
        const fall = smoothstep(0.03, 0.08, ang) * (1 - smoothstep(0.15, 0.95, ang));
        albedo[j * MW + i] += 0.09 * rays * fall * (0.5 + noise.n2(ang * 40, theta * 9));
      }
    }
  }

  moonMapsCache = { albedo, height, MW, MH };
  return moonMapsCache;
}

export function renderMoon(size: number, light: [number, number, number] = [-0.62, 0.38, 0.69]) {
  const { albedo, height, MW, MH } = buildMoonMaps();
  const sample =(map: Float32Array, u: number, v: number) => {
    const x = u * (MW - 1), y = v * (MH - 1);
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = Math.min(MW - 1, x0 + 1), y1 = Math.min(MH - 1, y0 + 1);
    const fx = x - x0, fy = y - y0;
    const a = map[y0 * MW + x0], b = map[y0 * MW + x1], c = map[y1 * MW + x0], d = map[y1 * MW + x1];
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  };

  // --- render the visible hemisphere ---
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const data = img.data;
  const ll = Math.hypot(...light);
  const L = light.map((v) => v / ll) as [number, number, number];
  const R = size / 2 - 1;
  const bump = 1.0;
  const du = 1 / MW, dv = 1 / MH;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = (px - size / 2 + 0.5) / R;
      const y = -(py - size / 2 + 0.5) / R;
      const rr = x * x + y * y;
      if (rr > 1.004) continue;
      const nz = Math.sqrt(Math.max(0, 1 - rr));
      const lat = Math.asin(Math.max(-1, Math.min(1, y)));
      const lon = Math.atan2(x, nz);
      const u = (lon + Math.PI) / (Math.PI * 2);
      const v = lat / Math.PI + 0.5;

      const h0 = sample(height, u, v);
      const dhdu = (sample(height, Math.min(1, u + du), v) - h0) * MW / (Math.PI * 2);
      const dhdv = (sample(height, u, Math.min(1, v + dv)) - h0) * MH / Math.PI;
      const cl = Math.max(0.12, Math.cos(lat));
      const sinLon = Math.sin(lon), cosLon = Math.cos(lon), sinLat = Math.sin(lat);
      // tangent vectors
      const ex = cosLon, ey = 0, ez = -sinLon;
      const tx = -sinLat * sinLon, ty = Math.cos(lat), tz = -sinLat * cosLon;
      let nx = x - bump * (dhdu / cl * ex + dhdv * tx);
      let ny = y - bump * (dhdu / cl * ey + dhdv * ty);
      let nzz = nz - bump * (dhdu / cl * ez + dhdv * tz);
      const nl = Math.hypot(nx, ny, nzz);
      nx /= nl; ny /= nl; nzz /= nl;

      const geo = x * L[0] + y * L[1] + nz * L[2];
      const mu0 = Math.max(0, nx * L[0] + ny * L[1] + nzz * L[2]);
      const mu = Math.max(0.02, nz);
      const a = Math.max(0.05, sample(albedo, u, v));
      // Lommel–Seeliger + a little Lambert for a soft terminator
      let I = a * (2.05 * (mu0 / (mu0 + mu)) + 0.18 * mu0);
      I *= smoothstep(-0.04, 0.12, geo);
      // faint earthshine on the night side
      const earth = a * 0.035 * (1 - smoothstep(-0.05, 0.1, geo));
      const edge = Math.min(1, Math.max(0, (1 - Math.sqrt(rr)) * R * 0.9 + 0.5));
      const k = (py * size + px) * 4;
      data[k] = Math.min(255, (I * 236 + earth * 150) * 1.0);
      data[k + 1] = Math.min(255, I * 229 + earth * 170);
      data[k + 2] = Math.min(255, I * 216 + earth * 210);
      data[k + 3] = 255 * edge;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/* ------------------------------------------------------------------ */
/*  Sun                                                                */
/* ------------------------------------------------------------------ */

export function renderSun(size: number) {
  const noise = createNoise(11);
  const disc = document.createElement("canvas");
  const corona = document.createElement("canvas");
  disc.width = disc.height = corona.width = corona.height = size;
  const dctx = disc.getContext("2d")!;
  const cctx = corona.getContext("2d")!;
  const dImg = dctx.createImageData(size, size);
  const cImg = cctx.createImageData(size, size);
  const R = size * 0.16;
  const c = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - c + 0.5, dy = y - c + 0.5;
      const dist = Math.hypot(dx, dy);
      const r = dist / R;
      const k = (y * size + x) * 4;
      if (r <= 1.01) {
        const mu = Math.sqrt(Math.max(0, 1 - r * r));
        // quadratic limb darkening
        const limb = 1 - 0.58 * (1 - mu) - 0.2 * (1 - mu) ** 2;
        const gran = 1 + 0.07 * (noise.fbm2(dx * 0.55, dy * 0.55, 3) - 0.5);
        const I = Math.min(1.18, limb * gran * 1.18);
        const t = 1 - mu;
        data(dImg.data, k,
          Math.min(255, I * (255 - 4 * t)),
          Math.min(255, I * (246 - 70 * t)),
          Math.min(255, I * (228 - 140 * t)),
          255 * Math.min(1, (1 - r) * R + 0.5),
        );
      }
      if (r > 0.9) {
        const theta = Math.atan2(dy, dx);
        const fall = Math.exp(-(r - 1) * 2.6);
        const streams = Math.pow(noise.fbm2(Math.cos(theta) * 2.2 + 5, Math.sin(theta) * 2.2 + r * 0.25, 4), 2.2);
        const fine = Math.pow(noise.n2(theta * 18, r * 0.6), 6);
        const alpha = Math.min(1, fall * 0.55 + Math.exp(-(r - 1) * 0.95) * (0.55 * streams + 0.12 * fine)) * smoothstep(0.9, 1.02, r);
        data(cImg.data, k, 255, 238, 214, 255 * alpha * (1 - smoothstep(0.8 * (size / 2 / R), size / 2 / R, r)));
      }
    }
  }
  dctx.putImageData(dImg, 0, 0);
  cctx.putImageData(cImg, 0, 0);
  return { disc, corona };
}

function data(d: Uint8ClampedArray, k: number, r: number, g: number, b: number, a: number) {
  d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = a;
}

/* ------------------------------------------------------------------ */
/*  Sky                                                                */
/* ------------------------------------------------------------------ */

export type TwinkleStar = { x: number; y: number; r: number; a: number; s: number; p: number; c: string };

const STAR_COLORS: [number, string][] = [
  [0.08, "170,191,255"], // blue-white (O/B)
  [0.32, "202,215,255"], // A
  [0.62, "248,247,255"], // F/white
  [0.82, "255,244,232"], // G
  [0.94, "255,210,161"], // K
  [1.0, "255,184,128"], // M
];
function starColor(r: number) {
  for (const [t, c] of STAR_COLORS) if (r <= t) return c;
  return "255,255,255";
}

/**
 * Renders the static sky into `ctx` (already sized; w/h in CSS pixels) and
 * returns the stars that should twinkle on the animated layer.
 */
export function renderSky(ctx: CanvasRenderingContext2D, w: number, h: number, opts: { lowPower: boolean; band: { ax: number; ay: number; bx: number; by: number } }): TwinkleStar[] {
  const noise = createNoise(3);
  const rand = seededRandom(42);
  const { ax, ay, bx, by } = opts.band;
  const A = { x: ax * w, y: ay * h }, B = { x: bx * w, y: by * h };
  const len = Math.hypot(B.x - A.x, B.y - A.y);
  const dirx = (B.x - A.x) / len, diry = (B.y - A.y) / len;
  const nx = -diry, ny = dirx;
  const diag = Math.hypot(w, h);

  const bandInfo = (x: number, y: number) => {
    const rx = x - A.x, ry = y - A.y;
    const t = (rx * dirx + ry * diry) / len;
    const d = rx * nx + ry * ny;
    const width = diag * 0.085 * (1 + 0.45 * (noise.fbm2(t * 3.2, 0.5, 3) - 0.5)) * (0.75 + 0.5 * Math.exp(-(((t - 0.62) / 0.22) ** 2)));
    const g = Math.exp(-((d / width) ** 2));
    const dust = noise.fbm2(x * 0.006 + 20, y * 0.006, 5);
    const lane = smoothstep(0.46, 0.66, dust) * Math.exp(-((d / (width * 0.5)) ** 2));
    return { t, d, width, g, lane };
  };

  // 1) Background + diffuse band glow at reduced resolution
  const scale = opts.lowPower ? 0.25 : 0.4;
  const bw = Math.max(1, Math.round(w * scale)), bh = Math.max(1, Math.round(h * scale));
  const off = document.createElement("canvas");
  off.width = bw; off.height = bh;
  const octx = off.getContext("2d")!;
  const img = octx.createImageData(bw, bh);
  const dd = img.data;
  for (let j = 0; j < bh; j++) {
    for (let i = 0; i < bw; i++) {
      const x = i / scale, y = j / scale;
      const { t, g, lane } = bandInfo(x, y);
      const core = Math.exp(-(((t - 0.62) / 0.16) ** 2));
      const cloud = noise.fbm2(x * 0.004, y * 0.004, 6);
      const clumps = 0.35 + 1.25 * cloud * cloud;
      let I = g * (0.55 + 0.85 * core) * clumps * (1 - 0.88 * lane);
      I = Math.max(0, I) * 0.42;
      const halpha = smoothstep(0.66, 0.78, noise.fbm2(x * 0.009 + 50, y * 0.009, 4)) * g * 0.05;
      // background: deep ink with faint airglow towards the bottom
      const yy = y / h;
      const br = 5 + 6 * yy * yy, bg = 4 + 6 * yy * yy, bb = 11 + 10 * yy * yy;
      const warm = core;
      const k = (j * bw + i) * 4;
      dd[k] = br + I * (175 + 80 * warm) + halpha * 230;
      dd[k + 1] = bg + I * (182 + 38 * warm) + halpha * 90;
      dd[k + 2] = bb + I * (222 - 50 * warm) + halpha * 120;
      dd[k + 3] = 255;
    }
  }
  octx.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(off, 0, 0, w, h);

  // 2) Unresolved star clouds inside the band
  const bandStars = Math.round((opts.lowPower ? 1400 : 5200) * (w * h) / (1440 * 900));
  for (let s = 0; s < bandStars; s++) {
    const t = rand() * 1.1 - 0.05;
    const gauss = (rand() + rand() + rand() - 1.5) / 1.5;
    const baseX = A.x + dirx * len * t, baseY = A.y + diry * len * t;
    const { width } = bandInfo(baseX, baseY);
    const x = baseX + nx * gauss * width * 1.3;
    const y = baseY + ny * gauss * width * 1.3;
    if (x < 0 || y < 0 || x > w || y > h) continue;
    const { lane } = bandInfo(x, y);
    if (rand() < lane * 0.9) continue;
    const a = (0.12 + rand() * 0.45) * (1 - lane * 0.6);
    ctx.fillStyle = `rgba(${starColor(rand())},${a})`;
    const sz = rand() < 0.92 ? 0.7 : 1.1;
    ctx.fillRect(x, y, sz, sz);
  }

  // 3) Field stars — power-law brightness, real stellar colours
  const twinkles: TwinkleStar[] = [];
  const fieldCount = Math.round((opts.lowPower ? 380 : 950) * (w * h) / (1440 * 900));
  for (let s = 0; s < fieldCount; s++) {
    const x = rand() * w, y = rand() * h;
    const m = Math.pow(rand(), 3.2); // most stars faint
    const r = 0.35 + m * 1.35;
    const a = 0.22 + m * 0.78;
    const c = starColor(rand());
    if (m > 0.32 && twinkles.length < (opts.lowPower ? 50 : 140)) {
      twinkles.push({ x, y, r, a, s: 0.6 + rand() * 1.8, p: rand() * Math.PI * 2, c });
      continue;
    }
    ctx.fillStyle = `rgba(${c},${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4) A few bright stars with halo and faint diffraction spikes
  const bright = opts.lowPower ? 4 : 9;
  for (let s = 0; s < bright; s++) {
    const x = rand() * w, y = rand() * h;
    const c = starColor(rand() * 0.9);
    const size = 2 + rand() * 2.2;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, size * 7);
    halo.addColorStop(0, `rgba(${c},0.55)`);
    halo.addColorStop(0.12, `rgba(${c},0.18)`);
    halo.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = halo;
    ctx.fillRect(x - size * 7, y - size * 7, size * 14, size * 14);
    const spike = size * (6 + rand() * 6);
    for (const [sx, sy] of [[1, 0], [0, 1]] as const) {
      const grad = ctx.createLinearGradient(x - sx * spike, y - sy * spike, x + sx * spike, y + sy * spike);
      grad.addColorStop(0, `rgba(${c},0)`);
      grad.addColorStop(0.5, `rgba(${c},0.45)`);
      grad.addColorStop(1, `rgba(${c},0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x - sx * spike, y - sy * spike);
      ctx.lineTo(x + sx * spike, y + sy * spike);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  return twinkles;
}
