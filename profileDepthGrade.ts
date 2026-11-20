/**
 * The Red Goes First: the Profile's photographs seen from depth.
 *
 * Water absorbs warm light first. Reds and magentas are nearly gone a few metres down, oranges
 * and yellows follow, and what reaches the eye is the green-blue that survives plus the water's
 * own teal. The grade works in OKLab, so lightness and local contrast stay with the photograph
 * while only its hue and chroma go to sea: the subject stays recognisable, the warmth does not.
 *
 * Each photograph is graded once, on decode, into an offscreen canvas at its own resolution.
 * The original stays in its <img> above it, and the diver's light (profileTorch.ts) uncovers it.
 */

const LIN = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const c = i / 255;
  LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Linear → sRGB through a fine table (the cube-root grade lands between table steps smoothly)
const SRGB_STEPS = 4096;
const SRGB = new Uint8ClampedArray(SRGB_STEPS + 1);
for (let i = 0; i <= SRGB_STEPS; i++) {
  const c = i / SRGB_STEPS;
  SRGB[i] = Math.round((c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255);
}
const toSrgb8 = (c: number) => SRGB[c <= 0 ? 0 : c >= 1 ? SRGB_STEPS : Math.round(c * SRGB_STEPS)];

/** The depth grade for one sRGB colour (0–255 each), written into `out`. */
export function gradeDepth(r8: number, g8: number, b8: number, out: Uint8ClampedArray | number[], o = 0) {
  const r = LIN[r8 | 0];
  const g = LIN[g8 | 0];
  const b = LIN[b8 | 0];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  // Warm light is absorbed first: red and magenta almost entirely, orange and yellow next;
  // greens settle toward the water's teal instead of staying leaf-bright
  let a = A > 0 ? A * 0.16 : A * 0.58;
  let bb = B > 0 ? B * 0.34 : B;
  // Whatever was warm also loses part of the light it carried
  let L2 = L - 0.22 * ((A > 0 ? A : 0) * 1.6 + (B > 0 ? B : 0) * 0.5);
  // The water's own colour: teal through the mids, deeper blue in the shadows
  const mid = 4 * L2 * (1 - L2);
  a -= 0.026 * (0.55 + 0.45 * mid);
  bb -= 0.036 * (0.35 + 0.65 * (1 - L2)) + 0.02;
  // No colour runs louder than the water allows
  const C = Math.sqrt(a * a + bb * bb);
  if (C > 0.1) {
    const k = 0.1 / C + (1 - 0.1 / C) * 0.35;
    a *= k;
    bb *= k;
  }
  // Depth's veil lifts the blacks a touch and holds back the highlights; a gentle S-curve keeps
  // the photograph's contrast and detail under it
  L2 = 0.035 + L2 * 0.93;
  const t = L2 <= 0 ? 0 : L2 >= 1 ? 1 : L2;
  L2 = t + 0.18 * (t - 0.5) * (1 - Math.abs(2 * t - 1));

  const l2 = L2 + 0.3963377774 * a + 0.2158037573 * bb;
  const m2 = L2 - 0.1055613458 * a - 0.0638541728 * bb;
  const s2 = L2 - 0.0894841775 * a - 1.291485548 * bb;
  const l3 = l2 * l2 * l2;
  const m3 = m2 * m2 * m2;
  const s3 = s2 * s2 * s2;
  out[o] = toSrgb8(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3);
  out[o + 1] = toSrgb8(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3);
  out[o + 2] = toSrgb8(-0.0041960863 * l3 - 0.5110945655 * m3 + 1.1186737355 * s3);
}

/** Grade RGBA pixels in place (alpha untouched). */
export function gradeDepthPixels(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) gradeDepth(data[i], data[i + 1], data[i + 2], data, i);
}

/** Longest side of the graded copy: the photographs are 480 px and drawn at most ~200 CSS px. */
const MAX_DEPTH_DIM = 480;

const baked = new WeakMap<HTMLImageElement, Promise<HTMLCanvasElement | null>>();

/** Wait for an idle moment so eight grades never stack into one long task. */
const idle = () =>
  new Promise<void>((resolve) => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (ric) ric(() => resolve(), { timeout: 400 });
    else setTimeout(resolve, 16);
  });

/**
 * The depth-graded copy of a decoded photograph (shared by the memory plate and the resting
 * photograph, so the ASCII reveal resolves into exactly the image that then stays on the page).
 */
export function bakeDepthPhoto(image: HTMLImageElement): Promise<HTMLCanvasElement | null> {
  let job = baked.get(image);
  if (job) return job;
  job = (async () => {
    try {
      await image.decode();
    } catch {
      return null;
    }
    await idle();
    const nw = image.naturalWidth;
    const nh = image.naturalHeight;
    if (!nw || !nh) return null;
    const scale = Math.min(1, MAX_DEPTH_DIM / Math.max(nw, nh));
    const w = Math.max(1, Math.round(nw * scale));
    const h = Math.max(1, Math.round(nh * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, w, h);
    try {
      const px = ctx.getImageData(0, 0, w, h);
      gradeDepthPixels(px.data);
      ctx.putImageData(px, 0, 0);
    } catch {
      return null;
    }
    return canvas;
  })();
  baked.set(image, job);
  return job;
}

/** Paint the resting depth photograph of one city frame and mark it ready for the diver's light. */
export async function mountDepthPhoto(frame: HTMLElement): Promise<void> {
  const image = frame.querySelector<HTMLImageElement>('.profile-city-photo-layer img');
  const surface = frame.querySelector<HTMLCanvasElement>('.profile-memory-depth');
  if (!image || !surface) return;
  const graded = await bakeDepthPhoto(image);
  if (!graded || !surface.isConnected) return;
  surface.width = graded.width;
  surface.height = graded.height;
  surface.getContext('2d')?.drawImage(graded, 0, 0);
  frame.dataset.depth = 'ready';
}
