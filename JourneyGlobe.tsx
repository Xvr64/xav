import React, { useEffect, useMemo, useRef, useState } from 'react';
import { loadLandDots, type LandDots } from './glyphcssGlobe';
import type { LocationItem } from './cvData';
import { abyssFromProgress, globeScrollGeometry, globeScrollProgress, lerpN } from './abyssPalette';
import { convergence, convergenceProgress, diveWake, globeRevealAt, setGlobeZone } from './oceanDirection';
import { mountCinematicScroll, type CinematicStops } from './cinematicScroll';

const PlainText = ({ text }: { text: string }) => <>{text}</>;

export interface JourneyGlobeProps {
  locations: LocationItem[];
}

/**
 * Journey timeline shared by the camera, routes and overlays: alternating DWELLS (camera
 * rests on a city) and LEGS (camera travels to the next city). A leg's share of the scroll
 * grows gently with the years spent in the city it leaves, parsed from the existing `period`.
 */
export type JourneySeg = { kind: 'dwell' | 'leg'; i: number; start: number; end: number };
export function buildJourneyTimeline(locations: LocationItem[]): JourneySeg[] {
  const yearsIn = (loc: LocationItem): number => {
    const ys = (loc.period.match(/\d{4}/g) || []).map(Number);
    return ys.length >= 2 ? Math.max(1, ys[1] - ys[0]) : 1;
  };
  const raw: { kind: 'dwell' | 'leg'; i: number; w: number }[] = [];
  locations.forEach((loc, i) => {
    raw.push({ kind: 'dwell', i, w: 0.8 });
    if (i < locations.length - 1) raw.push({ kind: 'leg', i, w: 1 + yearsIn(loc) * 0.25 });
  });
  const total = raw.reduce((a, s) => a + s.w, 0);
  let acc = 0;
  return raw.map((s) => {
    const seg = { kind: s.kind, i: s.i, start: acc / total, end: (acc + s.w) / total };
    acc += s.w;
    return seg;
  });
}

// ---- Spherical geometry (unit vectors; no longitude wrap-around issues) -----
export type Vec3 = [number, number, number];
export const GEO_RAD = Math.PI / 180;
export const lonLatToVec = (lon: number, lat: number): Vec3 => [
  Math.cos(lat * GEO_RAD) * Math.cos(lon * GEO_RAD),
  Math.cos(lat * GEO_RAD) * Math.sin(lon * GEO_RAD),
  Math.sin(lat * GEO_RAD)
];
export const vecDot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const vecNormalize = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
/** Great-circle interpolation between two unit vectors (always the short way round) */
export const vecSlerp = (a: Vec3, b: Vec3, t: number): Vec3 => {
  const omega = Math.acos(Math.max(-1, Math.min(1, vecDot(a, b))));
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const k1 = Math.sin((1 - t) * omega) / s;
  const k2 = Math.sin(t * omega) / s;
  return vecNormalize([k1 * a[0] + k2 * b[0], k1 * a[1] + k2 * b[1], k1 * a[2] + k2 * b[2]]);
};
/** Orthographic camera: local east / north on screen for a view direction */
export const cameraBasis = (view: Vec3): { east: Vec3; north: Vec3 } => {
  let east: Vec3 = [-view[1], view[0], 0];
  if (Math.hypot(east[0], east[1]) < 1e-6) east = [1, 0, 0];
  east = vecNormalize(east);
  return {
    east,
    north: [
      view[1] * east[2] - view[2] * east[1],
      view[2] * east[0] - view[0] * east[2],
      view[0] * east[1] - view[1] * east[0]
    ]
  };
};
/** Globe placement inside its pinned stage (before the camera's zoom) */
export const globeFrame = (W: number, H: number) => {
  const mobile = W < 768;
  return {
    cx: mobile ? W * 0.5 : W * 0.64,
    cy: mobile ? H * 0.34 : H * 0.47,
    baseR: mobile ? Math.min(W * 0.4, H * 0.26) : Math.min(W * 0.27, H * 0.39)
  };
};

/** Canvas label placement per city (keeps Paris/Pau and Singapore/Jakarta apart) */
export const JOURNEY_LABEL_OFFSETS: Record<string, { dx: number; dy: number; align: CanvasTextAlign }> = {
  doha: { dx: 13, dy: 17, align: 'left' },
  paris: { dx: 13, dy: -11, align: 'left' },
  jakarta: { dx: 13, dy: 18, align: 'left' },
  moscow: { dx: 13, dy: -11, align: 'left' },
  singapore: { dx: -13, dy: -11, align: 'right' },
  pau: { dx: -13, dy: 17, align: 'right' },
  shanghai: { dx: 13, dy: -11, align: 'left' }
};

/**
 * JourneyGlobe — a clean orthographic globe drawn on one transparent canvas.
 *
 * A single scroll-progress value p ∈ [0, 1] (the pinned runway around the stage) is the
 * only source of truth. It deterministically yields the camera (great-circle position +
 * zoom), the route drawing, the destination markers, the active city, the dates, the
 * description and the timeline. Rendering happens on demand (one frame per scroll /
 * resize change) — no timers, no autoplay, nothing moves once scrolling stops.
 */
export const JourneyGlobe: React.FC<JourneyGlobeProps> = React.memo(({ locations }) => {
  const [activeId, setActiveId] = useState<string>(() => locations[0]?.id || 'doha');
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  // Hidden while the convergence's whales are forming this Earth (see WhaleConvergence.tsx)
  const veilRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const goToCityRef = useRef<(id: string) => void>((id) => setActiveId(id));
  const requestRenderRef = useRef<() => void>(() => {});
  const segs = useMemo(() => buildJourneyTimeline(locations), [locations]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const domCtx = canvas.getContext('2d', { alpha: true });
    if (!domCtx) return;

    // Offscreen drawing buffer disconnected from Document so font/text ops never trigger Blink style recalcs
    const offCanvas = document.createElement('canvas');
    const ctx = offCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;

    // Pre-measured city label widths (zero ctx.measureText calls during scroll)
    const activeLabelWidths = new Float32Array(locations.length);
    const inactiveLabelWidths = new Float32Array(locations.length);
    const measureCityLabels = () => {
      ctx.save();
      ctx.font = '14px "JetBrains Mono", monospace';
      for (let i = 0; i < locations.length; i++) {
        activeLabelWidths[i] = ctx.measureText(locations[i].city.toUpperCase()).width;
      }
      ctx.font = '11.5px "JetBrains Mono", monospace';
      for (let i = 0; i < locations.length; i++) {
        inactiveLabelWidths[i] = ctx.measureText(locations[i].city).width;
      }
      ctx.restore();
    };
    measureCityLabels();

    // ---- Static geometry -----------------------------------------------------
    const cityVecs = locations.map((l) => lonLatToVec(l.lon, l.lat));
    const legCount = locations.length - 1;
    const ROUTE_SAMPLES = 96;
    const routes: Vec3[][] = [];
    const legAngleDeg: number[] = [];
    for (let i = 0; i < legCount; i++) {
      const pts: Vec3[] = [];
      for (let k = 0; k <= ROUTE_SAMPLES; k++) pts.push(vecSlerp(cityVecs[i], cityVecs[i + 1], k / ROUTE_SAMPLES));
      routes.push(pts);
      legAngleDeg.push(Math.acos(Math.max(-1, Math.min(1, vecDot(cityVecs[i], cityVecs[i + 1])))) / GEO_RAD);
    }
    // Faint graticule every 30°
    const graticule: Vec3[][] = [];
    for (let lon = -180; lon < 180; lon += 30) {
      const line: Vec3[] = [];
      for (let lat = -80; lat <= 80; lat += 4) line.push(lonLatToVec(lon, lat));
      graticule.push(line);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const line: Vec3[] = [];
      for (let lon = -180; lon <= 180; lon += 4) line.push(lonLatToVec(lon, lat));
      graticule.push(line);
    }
    const overviewVec = vecNormalize(
      cityVecs.reduce<Vec3>((acc, v) => [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]], [0, 0, 0])
    );

    let land: LandDots | null = null;
    let dotBuckets: [Float32Array, Float32Array, Float32Array, Float32Array] | null = null;
    const DOT_BUCKET_ALPHAS = [0.13, 0.34, 0.56, 0.78] as const;
    loadLandDots()
      .then((dots) => {
        if (disposed) return;
        land = dots;
        const maxPerBand = Math.max(64, Math.ceil(dots.xyz.length / 3));
        dotBuckets = [
          new Float32Array(maxPerBand * 3),
          new Float32Array(maxPerBand * 3),
          new Float32Array(maxPerBand * 3),
          new Float32Array(maxPerBand * 3)
        ];
        requestRender();
      })
      .catch(() => {
        /* the globe still renders (sphere, graticule, route, markers) without land dots */
      });

    // ---- Journey state from the single progress value -----------------------
    type JourneyState = {
      p: number;
      routeFrac: number[];
      reveal: number[];
      active: number;
      cam: Vec3;
      zoom: number;
      tracing: number; // index of the leg currently being drawn, or -1
    };
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const stateAt = (p: number): JourneyState => {
      const pc = Math.max(0, Math.min(1, p));
      let seg = segs[segs.length - 1];
      for (const s of segs) {
        if (pc <= s.end) {
          seg = s;
          break;
        }
      }
      const local = seg.end > seg.start ? Math.max(0, Math.min(1, (pc - seg.start) / (seg.end - seg.start))) : 1;
      const routeFrac = routes.map((_, j) => {
        if (seg.kind === 'dwell') return j < seg.i ? 1 : 0;
        if (j < seg.i) return 1;
        if (j > seg.i) return 0;
        return Math.min(1, local * 1.25); // the route draws slightly ahead of the camera
      });
      const reveal = locations.map((_, k) =>
        k === 0 ? 1 : Math.max(0, Math.min(1, (routeFrac[k - 1] - 0.9) / 0.1))
      );
      if (seg.kind === 'dwell') {
        return { p: pc, routeFrac, reveal, active: seg.i, cam: cityVecs[seg.i], zoom: 1.08, tracing: -1 };
      }
      const pull = Math.sin(Math.PI * local) * Math.min(1, legAngleDeg[seg.i] / 80);
      return {
        p: pc,
        routeFrac,
        reveal,
        active: local < 0.55 ? seg.i : seg.i + 1,
        cam: vecSlerp(cityVecs[seg.i], cityVecs[seg.i + 1], smooth(local)),
        zoom: 1.08 - 0.24 * pull, // pull back on long legs so both ends stay in frame
        tracing: routeFrac[seg.i] < 1 ? seg.i : -1
      };
    };
    const reducedState = (): JourneyState => ({
      p: 1,
      routeFrac: routes.map(() => 1),
      reveal: locations.map(() => 1),
      active: Math.max(0, locations.findIndex((l) => l.id === activeIdRef.current)),
      cam: overviewVec,
      zoom: 0.92,
      tracing: -1
    });

    // ---- Cached geometry (zero forced layout / getComputedStyle during scroll) ----
    const runway = stage.closest('[data-journey-runway]') as HTMLElement | null;
    const pinned = runway?.firstElementChild as HTMLElement | null;
    let runwayDocTop = 0;
    let runwayTravel = 1;
    // The convergence's share of the runway, before the journey's own scroll (0 when absent)
    const leadEl = runway?.querySelector<HTMLElement>('[data-journey-lead]') ?? null;
    let leadPx = 0;
    let stickyTop = 0;
    let stageDocLeft = 0;
    let cachedDocScrollable = 1;
    let globeInView = true;

    // ---- Canvas sizing ---------------------------------------------------------
    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      const sy = window.scrollY;
      const sx = window.scrollX;
      const rect = stage.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      stageDocLeft = rect.left + sx;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pw = Math.max(1, Math.round(W * dpr));
      const ph = Math.max(1, Math.round(H * dpr));
      canvas.width = pw;
      canvas.height = ph;
      offCanvas.width = pw;
      offCanvas.height = ph;
      if (runway && pinned) {
        const rr = runway.getBoundingClientRect();
        const pr = pinned.getBoundingClientRect();
        runwayDocTop = rr.top + sy;
        leadPx = leadEl && !prefersReduced ? leadEl.offsetHeight : 0;
        runwayTravel = Math.max(1, rr.height - pr.height - leadPx);
        stickyTop = parseFloat(getComputedStyle(pinned).top) || 0;
        convergence.start = runwayDocTop - stickyTop;
        convergence.length = leadPx;
        globeScrollGeometry.start = runwayDocTop - stickyTop + leadPx;
        globeScrollGeometry.travel = runwayTravel;
      }
      cachedDocScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const measureProgress = (): number => {
      return globeScrollProgress();
    };

    const drawOrderBuf = locations.map((_, k) => k);

    // ---- Drawing -----------------------------------------------------------------
    const draw = (st: JourneyState) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const { cx, cy, baseR } = globeFrame(W, H);
      const R = baseR * st.zoom;

      // Camera basis (orthographic): view direction + local east/north on screen
      const view = st.cam;
      const { east, north } = cameraBasis(view);
      const px = (v: Vec3) => cx + R * vecDot(v, east);
      const py = (v: Vec3) => cy - R * vecDot(v, north);

      // Keep globe labels legible on the same descent as the surrounding page.
      const nt = abyssFromProgress(measureProgress());
      const mc = (l: number[], d: number[]) =>
        `rgba(${Math.round(lerpN(l[0], d[0], nt))}, ${Math.round(lerpN(l[1], d[1], nt))}, ${Math.round(lerpN(l[2], d[2], nt))}, ${lerpN(l[3] ?? 1, d[3] ?? 1, nt).toFixed(3)})`;

      // Sphere: soft paper disc (separates the globe from the whales) + hairline limb
      const ocean = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      ocean.addColorStop(0, mc([249, 248, 245, 0.95], [150, 172, 170, 0.6]));
      ocean.addColorStop(1, mc([231, 235, 236, 0.95], [112, 134, 132, 0.66]));
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = ocean;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = mc([31, 59, 87, 0.22], [200, 218, 216, 0.32]);
      ctx.stroke();

      // Graticule (front hemisphere only, batched into 1 stroke call)
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = mc([31, 59, 87, 0.08], [16, 34, 30, 0.12]);
      ctx.beginPath();
      for (const line of graticule) {
        let pen = false;
        for (const v of line) {
          if (vecDot(v, view) > 0) {
            if (pen) ctx.lineTo(px(v), py(v));
            else ctx.moveTo(px(v), py(v));
            pen = true;
          } else pen = false;
        }
      }
      ctx.stroke();

      // Land: fine dot-matrix batched into 4 alpha buckets per relief band (<=12 fill calls instead of ~2,000)
      if (land && dotBuckets) {
        const { xyz, bands } = land;
        const ex = east[0], ey = east[1], ez = east[2];
        const nx = north[0], ny = north[1], nz = north[2];
        const vx = view[0], vy = view[1], vz = view[2];
        const dotScale = Math.max(0.75, Math.min(1.6, R / 300));
        const bandColors = [
          mc([86, 99, 109], [36, 60, 54]),
          mc([60, 72, 82], [22, 44, 38]),
          mc([38, 49, 58], [10, 26, 22])
        ];
        const bCounts = [0, 0, 0, 0];
        for (let b = 0; b < 3; b++) {
          ctx.fillStyle = bandColors[b];
          bCounts[0] = 0;
          bCounts[1] = 0;
          bCounts[2] = 0;
          bCounts[3] = 0;
          for (let d = bands[b]; d < bands[b + 1]; d++) {
            const o = d * 3;
            const x = xyz[o], y = xyz[o + 1], z = xyz[o + 2];
            const depth = x * vx + y * vy + z * vz;
            if (depth <= 0.14) continue;
            const sx = cx + R * (x * ex + y * ey + z * ez);
            const sy = cy - R * (x * nx + y * ny + z * nz);
            const s = (0.75 + depth * 1.0) * dotScale;
            const limb = Math.min(1, (depth - 0.14) / 0.3);
            const alpha = (0.2 + depth * 0.65) * limb;
            const tIdx = Math.min(3, (alpha * 4.5) | 0);
            const pos = bCounts[tIdx] * 3;
            const arr = dotBuckets[tIdx];
            arr[pos] = sx - s * 0.5;
            arr[pos + 1] = sy - s * 0.5;
            arr[pos + 2] = s;
            bCounts[tIdx]++;
          }
          for (let t = 0; t < 4; t++) {
            const cnt = bCounts[t];
            if (cnt === 0) continue;
            ctx.globalAlpha = DOT_BUCKET_ALPHAS[t];
            ctx.beginPath();
            const arr = dotBuckets[t];
            for (let m = 0; m < cnt; m++) {
              const p = m * 3;
              const s = arr[p + 2];
              ctx.rect(arr[p], arr[p + 1], s, s);
            }
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      // Routes: completed legs a quiet hairline, the current leg slightly stronger
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      let head: { x: number; y: number } | null = null;
      for (let j = 0; j < routes.length; j++) {
        const f = st.routeFrac[j];
        if (f <= 0) continue;
        const pts = routes[j];
        const end = f * ROUTE_SAMPLES;
        const whole = Math.floor(end);
        ctx.beginPath();
        let pen = false;
        let last: { x: number; y: number } | null = null;
        for (let k = 0; k <= whole; k++) {
          const v = pts[k];
          if (vecDot(v, view) > 0) {
            const x = px(v), y = py(v);
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
            last = { x, y };
          } else pen = false;
        }
        const frac = end - whole;
        if (frac > 0 && whole < ROUTE_SAMPLES) {
          const v = vecSlerp(pts[whole], pts[whole + 1], frac);
          if (vecDot(v, view) > 0 && pen) {
            const x = px(v), y = py(v);
            ctx.lineTo(x, y);
            last = { x, y };
          }
        }
        const isCurrent = j === st.tracing;
        ctx.strokeStyle = isCurrent
          ? mc([22, 38, 51, 0.85], [6, 20, 16, 0.9])
          : mc([31, 59, 87, 0.55], [14, 38, 32, 0.6]);
        ctx.lineWidth = isCurrent ? 1.8 : 1.3;
        ctx.stroke();
        if (isCurrent) head = last;
      }
      // The whales' wake lands here: a dotted line from where the lead whale's wake reaches into
      // the stage, onto the journey's first city, while they dive into the Globe
      if (diveWake.strength > 0.01 && vecDot(cityVecs[0], view) > 0.15) {
        const sr = stage.getBoundingClientRect();
        const fromX = diveWake.x - sr.left;
        const fromY = diveWake.y - sr.top;
        const toX = px(cityVecs[0]);
        const toY = py(cityVecs[0]);
        ctx.save();
        ctx.setLineDash([1.5, 5]);
        ctx.lineWidth = 1.3;
        ctx.globalAlpha = Math.min(1, diveWake.strength);
        ctx.strokeStyle = mc([31, 59, 87, 0.8], [14, 38, 32, 0.8]);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(fromX + (toX - fromX) * diveWake.reach, fromY + (toY - fromY) * diveWake.reach);
        ctx.stroke();
        ctx.restore();
      }

      if (head) {
        ctx.beginPath();
        ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = mc([22, 38, 51], [6, 20, 16]);
        ctx.fill();
      }

      // Destination markers: future = faint ring, reached = solid, active = solid + ring
      const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
      for (let i = 0; i < locations.length; i++) drawOrderBuf[i] = i;
      drawOrderBuf.sort((a, b) => (a === st.active ? 1 : b === st.active ? -1 : 0));
      for (let oi = 0; oi < drawOrderBuf.length; oi++) {
        const k = drawOrderBuf[oi];
        const v = cityVecs[k];
        const depth = vecDot(v, view);
        if (depth <= 0.02) continue;
        const x = px(v);
        const y = py(v);
        const rv = st.reveal[k];
        const isActive = k === st.active && rv > 0.5;
        if (rv <= 0.01) {
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.strokeStyle = mc([31, 59, 87, 0.35], [14, 38, 32, 0.45]);
          ctx.lineWidth = 1;
          ctx.stroke();
          continue;
        }
        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = mc([22, 38, 51, 0.45], [6, 20, 16, 0.55]);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.globalAlpha = 0.35 + 0.65 * rv;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 4.5 : 3.4, 0, Math.PI * 2);
        ctx.fillStyle = mc([22, 38, 51], [6, 20, 16]);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = mc([247, 246, 242, 0.95], [200, 218, 216, 0.9]);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Label (reached cities only), with collision avoidance — active wins
        if (rv < 0.5) continue;
        const off = JOURNEY_LABEL_OFFSETS[locations[k].id] || { dx: 13, dy: -11, align: 'left' as CanvasTextAlign };
        ctx.font = isActive ? '14px "JetBrains Mono", monospace' : '11.5px "JetBrains Mono", monospace';
        const label = isActive ? locations[k].city.toUpperCase() : locations[k].city;
        const tw = isActive ? activeLabelWidths[k] : inactiveLabelWidths[k];
        let align: CanvasTextAlign = off.align;
        if (align === 'left' && x + off.dx + tw > W - 6) align = 'right';
        else if (align === 'right' && x + off.dx - tw < 6) align = 'left';
        const dx = align === off.align ? off.dx : -off.dx;
        const lx = x + dx;
        const ly = y + off.dy;
        const box = {
          x0: align === 'right' ? lx - tw - 3 : lx - 3,
          x1: align === 'right' ? lx + 3 : lx + tw + 3,
          y0: ly - 14,
          y1: ly + 6
        };
        if (!isActive && placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) continue;
        placed.push(box);
        ctx.textAlign = align;
        ctx.textBaseline = 'alphabetic';
        ctx.lineWidth = 4;
        ctx.strokeStyle = mc([245, 243, 238, 0.92], [168, 190, 188, 0.88]);
        ctx.strokeText(label, lx, ly);
        ctx.fillStyle = isActive ? mc([22, 38, 51], [4, 16, 13]) : mc([43, 53, 59], [14, 32, 28]);
        ctx.fillText(label, lx, ly);
      }
      blit();
    };
    // Single 1:1 device-pixel blit to DOM canvas (zero DOM style/font access)
    const blit = () => {
      ctx.globalAlpha = 1;
      domCtx.setTransform(1, 0, 0, 1, 0, 0);
      domCtx.clearRect(0, 0, canvas.width, canvas.height);
      domCtx.drawImage(offCanvas, 0, 0);
    };

    // ---- Apply one state everywhere (canvas + imperative DOM + React milestone) ----
    const cityStopEls: HTMLElement[][] = locations.map((loc) =>
      Array.from(stage.querySelectorAll<HTMLElement>(`[data-journey-city="${loc.id}"]`))
    );
    const lastCityOpacities = new Float32Array(locations.length).fill(-1);
    let lastActive = Math.max(0, locations.findIndex((l) => l.id === activeIdRef.current));

    let lastReveal = -1;
    const apply = (st: JourneyState) => {
      draw(st);
      // The convergence's Earth becomes this one: canvas, washes and caption appear as it hands over
      const reveal = prefersReduced ? 1 : globeRevealAt(convergenceProgress(window.scrollY));
      if (Math.abs(reveal - lastReveal) > 0.002 || (reveal !== lastReveal && (reveal === 0 || reveal === 1))) {
        lastReveal = reveal;
        const op = reveal >= 1 ? '' : reveal.toFixed(3);
        canvas.style.opacity = op;
        if (captionRef.current) captionRef.current.style.opacity = op;
        for (const v of veilRefs.current) if (v) v.style.opacity = op;
      }
      if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${st.p.toFixed(4)})`;
      for (let idx = 0; idx < cityStopEls.length; idx++) {
        const op = 0.4 + st.reveal[idx] * 0.6;
        if (Math.abs(op - lastCityOpacities[idx]) > 0.008) {
          lastCityOpacities[idx] = op;
          const opStr = op.toFixed(3);
          const els = cityStopEls[idx];
          for (let j = 0; j < els.length; j++) els[j].style.opacity = opStr;
        }
      }
      if (!prefersReduced && st.active !== lastActive) {
        lastActive = st.active;
        setActiveId(locations[st.active].id);
      }
    };

    // While the stage is on screen, its disc and caption are calm zones for the ocean layers
    // (fluid, whales, jellyfish), so nothing swims across the globe or the city name
    const publishZone = (st: JourneyState) => {
      const sr = stage.getBoundingClientRect();
      if (sr.bottom <= 0 || sr.top >= window.innerHeight) {
        setGlobeZone([]);
        return;
      }
      const { cx, cy, baseR } = globeFrame(W, H);
      const R = baseR * st.zoom;
      const rects = [{ left: sr.left + cx - R, top: sr.top + cy - R, width: R * 2, height: R * 2 }];
      // While the convergence plays, its whales circle the whole stage: keep the water calm there
      if (lastReveal < 1) rects.push({ left: sr.left + W * 0.04, top: sr.top + H * 0.06, width: W * 0.92, height: H * 0.88 });
      const caption = captionRef.current?.getBoundingClientRect();
      if (caption && caption.width > 0) {
        rects.push({ left: caption.left, top: caption.top, width: caption.width, height: caption.height });
      }
      // The journey's first city on screen, while it faces the viewer: where the whales' wake lands
      const first = cityVecs[0];
      let origin: { x: number; y: number } | null = null;
      if (vecDot(first, st.cam) > 0.15) {
        const { east, north } = cameraBasis(st.cam);
        origin = { x: sr.left + cx + R * vecDot(first, east), y: sr.top + cy - R * vecDot(first, north) };
      }
      setGlobeZone(rects, origin);
    };

    let raf = 0;
    const frame = () => {
      raf = 0;
      const st = prefersReduced ? reducedState() : stateAt(measureProgress());
      apply(st);
      publishZone(st);
    };
    const requestRender = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      if (globeInView && !raf) raf = requestAnimationFrame(frame);
    };
    requestRenderRef.current = requestRender;

    const globeIo =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                globeInView = entry.isIntersecting;
              }
              if (!globeInView) setGlobeZone([]);
              if (globeInView) {
                resize();
                requestRender();
              }
            },
            { rootMargin: '260px 0px 260px 0px', threshold: 0 }
          )
        : null;
    if (globeIo) globeIo.observe(runway || stage);

    // ---- Assisted scrolling: one gesture, one stage ------------------------------------------
    // The resting points of the whole cinematic stretch, as document scroll positions: the
    // convergence's own phases (approach, first circle, full orbit, sphere and unravelling), the
    // Earth settling on Doha, each city's dwell, then the release into the next section. The
    // durations are the choreography's: the circling takes longer than a short hop between cities.
    const WHALE_STOPS = [0, 0.15, 0.3, 0.45, 0.84];
    const WHALE_SEC = [2.0, 2.6, 2.6, 3.8];
    const EARTH_SEC = 2.6;
    const cinematicStops = (): CinematicStops | null => {
      if (prefersReduced || !runway || !pinned || runwayTravel <= 1 || !Number.isFinite(convergence.start)) return null;
      const y: number[] = [];
      const dur: number[] = [];
      if (convergence.ready && convergence.length > 0) {
        WHALE_STOPS.forEach((p, k) => {
          y.push(convergence.start + p * convergence.length);
          if (k > 0) dur.push(WHALE_SEC[k - 1]);
        });
      } else {
        // Without the 3D layer the Globe shows itself throughout the lead: straight to Doha
        y.push(convergence.start);
      }
      const g0 = globeScrollGeometry.start;
      segs.forEach((seg) => {
        if (seg.kind !== 'dwell') return;
        y.push(g0 + ((seg.start + seg.end) / 2) * runwayTravel);
        dur.push(seg.i === 0 ? (y.length > 2 ? EARTH_SEC : 1.6) : 2.1 + 0.9 * Math.min(1, legAngleDeg[seg.i - 1] / 80));
      });
      // The last city's dwell ends where the stage releases into the following section
      y.push(g0 + runwayTravel);
      dur.push(1.4);
      return { y, dur };
    };
    const cinematic = mountCinematicScroll(cinematicStops);
    // Travel to a city = glide to that city's checkpoint
    goToCityRef.current = (id: string) => {
      const idx = locations.findIndex((l) => l.id === id);
      if (idx < 0) return;
      if (prefersReduced) {
        setActiveId(id);
        return;
      }
      const st = cinematicStops();
      if (!st) return;
      cinematic.goTo(st.y.length - 1 - locations.length + idx);
    };

    const onResize = () => {
      resize();
      requestRender();
    };
    convergence.listeners.add(onResize);
    resize();
    requestRender();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Labels use the editorial web fonts: re-measure & redraw once they are ready
    document.fonts?.ready
      .then(() => {
        if (!disposed) {
          measureCityLabels();
          resize();
          requestRender();
        }
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      cinematic.destroy();
      convergence.listeners.delete(onResize);
      convergence.length = 0;
      if (globeIo) globeIo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      setGlobeZone([]);
      requestRenderRef.current = () => {};
      goToCityRef.current = (id) => setActiveId(id);
    };
  }, [locations, segs]);

  // Reduced motion: the active city changes by selection only — redraw the static view
  useEffect(() => {
    requestRenderRef.current();
  }, [activeId]);

  const activeIdx = Math.max(0, locations.findIndex((l) => l.id === activeId));

  return (
    <div ref={stageRef} className="relative w-full max-w-full h-full overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full max-w-full h-full block" />

      {/* Subtle water-matched veil softens whale glyphs directly behind the destination caption */}
      <div
        ref={(el) => (veilRefs.current[0] = el)}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            'radial-gradient(ellipse 34% 42% at 18% 50%, rgba(var(--abyss-wash), 0.42) 0%, rgba(var(--abyss-wash), 0.18) 62%, rgba(var(--abyss-wash), 0) 100%)'
        }}
      />
      <div
        ref={(el) => (veilRefs.current[1] = el)}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] md:hidden"
        style={{
          background:
            'linear-gradient(0deg, rgba(var(--abyss-wash), 0.52) 0%, rgba(var(--abyss-wash), 0.28) 65%, rgba(var(--abyss-wash), 0) 100%)'
        }}
      />

      {/* Current destination — all 7 captions pre-mounted in a grid stack (zero DOM childList mutations on city change) */}
      <div
        ref={captionRef}
        className="grid items-center absolute left-5 right-5 bottom-24 md:right-auto md:left-[6vw] md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[min(28vw,440px)]"
        aria-live="polite"
      >
        {locations.map((city, cIdx) => {
          const isCityActive = cIdx === activeIdx;
          return (
            <div
              key={city.id}
              aria-hidden={!isCityActive}
              style={{
                visibility: isCityActive ? 'visible' : 'hidden',
                pointerEvents: isCityActive ? 'auto' : 'none'
              }}
              className={`col-start-1 row-start-1 ${isCityActive ? 'globe-caption-in' : 'opacity-0'}`}
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#3E4C52]">
                <PlainText text={`${String(cIdx + 1).padStart(2, '0')} / ${String(locations.length).padStart(2, '0')}`} />
              </p>
              <h3 className="mt-2 font-arch text-[38px] md:text-[54px] lg:text-[62px] leading-[1.02] tracking-[-0.02em] text-[#162633]">
                <PlainText text={city.city} />
              </h3>
              {city.country && city.country !== city.city && (
                <p className="mt-2.5 font-mono text-xs md:text-[13px] uppercase tracking-[0.16em] text-[#3E4C52]">
                  <PlainText text={city.country} />
                </p>
              )}
              <p className="mt-3 font-mono text-lg md:text-[22px] leading-none tracking-[0.06em] text-[#1F3B57]">
                <PlainText text={city.period} />
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
});
