/**
 * /dev/ascii-whale — a development bench for the 3D ASCII whales (not part of the public page and
 * not in the production build: Vite only builds the root index.html).
 *
 * Inspect one or two whales from any angle (presets or drag to orbit, wheel to zoom), drive their
 * orientation and manoeuvres, and compare luminance, shape-aware and raw (unstylised 3D) output.
 * Every control is also a URL parameter (?view=front&mode=raw&t=0.4 …) and the state is exposed
 * on window.__whale for scripted checks. The optional "play" loop is for inspection only; the
 * site itself is driven by scroll.
 */
import { WhaleAsciiRenderer, type AsciiMode } from './whale3dRenderer.ts';
import {
  articulate,
  qRotate,
  sampleWhalePose,
  vAdd,
  yawPitchRoll,
  type WhaleMotion,
  type WhalePose
} from './whale3dPose.ts';
import type { V3 } from './whale3dAnatomy.ts';

type View = 'left' | 'right' | 'front' | 'rear' | 'top' | 'bottom' | 'threequarter' | 'free';
type Move = 'hold' | 'cruise' | 'turn' | 'dive' | 'surface' | 'bank' | 'pair';

interface BenchState {
  view: View;
  az: number;
  el: number;
  dist: number;
  move: Move;
  t: number;
  yaw: number;
  pitch: number;
  roll: number;
  effort: number;
  mode: AsciiMode | 'compare';
  cell: number;
  dark: boolean;
  whales: number;
  play: boolean;
}

const VIEWS: Record<Exclude<View, 'free'>, [number, number]> = {
  left: [-90, 0],
  right: [90, 0],
  front: [180, 0],
  rear: [0, 0],
  top: [-90, 89],
  bottom: [-90, -89],
  threequarter: [-130, 24]
};

const deg = Math.PI / 180;
const state: BenchState = {
  view: 'left',
  az: -90,
  el: 0,
  dist: 1.85,
  move: 'hold',
  t: 0.25,
  yaw: 0,
  pitch: 0,
  roll: 0,
  effort: 1,
  mode: 'shape',
  cell: 7,
  dark: false,
  whales: 1,
  play: false
};

// URL parameters seed the state (for bookmarked views and scripted screenshots)
const params = new URLSearchParams(location.search);
for (const [k, v] of params) {
  if (!(k in state)) continue;
  const cur = (state as unknown as Record<string, unknown>)[k];
  (state as unknown as Record<string, unknown>)[k] = typeof cur === 'number' ? Number(v) : typeof cur === 'boolean' ? v === '1' || v === 'true' : v;
}
if (params.has('view') && state.view !== 'free') [state.az, state.el] = VIEWS[state.view as Exclude<View, 'free'>];

const canvas = document.getElementById('whale') as HTMLCanvasElement;
const ascii = new WhaleAsciiRenderer(canvas, { maxWhales: 2, gbufferScale: 1 });

// ---- Manoeuvres ---------------------------------------------------------------------------------

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const MOTIONS: Record<Exclude<Move, 'hold' | 'pair'>, WhaleMotion> = {
  cruise: { path: (u) => [0, 0, -3 * u], length: 1 },
  // A full circle: the heading sweeps through 360° while the camera keeps its own orientation
  turn: { path: (u) => [1.1 * (1 - Math.cos(2 * Math.PI * u)), 0, -1.1 * Math.sin(2 * Math.PI * u)], length: 1, effort: () => 0.7 },
  dive: { path: (u) => [0, -1.1 * smooth(0.12, 0.88, u), -3 * u], length: 1, effort: (u) => 0.6 + 0.6 * Math.sin(Math.PI * u) },
  surface: { path: (u) => [0, 1.1 * smooth(0.12, 0.88, u), -3 * u], length: 1, effort: (u) => 1.2 - 0.6 * u },
  bank: { path: (u) => [0.55 * Math.sin(2 * Math.PI * u), 0, -3 * u], length: 1, bankGain: 0.6 }
};
const pairMotion = (i: number): WhaleMotion => ({
  path: (u) => {
    const a = 2 * Math.PI * u + i * Math.PI;
    return [0.95 * Math.sin(a), (i === 0 ? 0.12 : -0.12) + 0.06 * Math.sin(2 * a), 0.95 * Math.cos(a)];
  },
  length: i === 0 ? 1 : 0.92,
  phase: i * 2.1,
  stride: i === 0 ? 0.95 : 0.88,
  effort: () => 0.75
});

function poses(): WhalePose[] {
  if (state.move === 'pair') return [0, 1].map((i) => sampleWhalePose(state.t, pairMotion(i)));
  if (state.move === 'hold') {
    const q = yawPitchRoll(state.yaw * deg, state.pitch * deg, state.roll * deg);
    const main: WhalePose = {
      position: [0, 0, 0],
      quaternion: q,
      scale: 1,
      bank: 0,
      articulation: articulate({ distance: state.t * 4, effort: state.effort })
    };
    const companion: WhalePose = {
      position: vAdd([0, -0.32, 0], qRotate(q, [0.55, 0, 0.75])),
      quaternion: q,
      scale: 0.86,
      bank: 0,
      articulation: articulate({ distance: state.t * 4 + 0.37, effort: state.effort * 0.85, phase: 2.2, stride: 0.88 })
    };
    return [main, companion];
  }
  const m = MOTIONS[state.move];
  const main = sampleWhalePose(state.t, { ...m, effort: m.effort ? (u) => m.effort!(u) * state.effort : () => state.effort });
  const second = sampleWhalePose(Math.max(0, state.t - 0.04), { ...m, phase: 2.2, stride: 0.88, length: 0.86 });
  second.position = vAdd(second.position, [0.55, -0.3, 0.6]);
  return [main, second];
}

// ---- Frame ------------------------------------------------------------------------------------------

function frame() {
  const ps = poses();
  const count = state.move === 'pair' ? 2 : state.whales;
  ps.forEach((p, i) =>
    ascii.setWhale(i, i < count ? { visible: true, position: p.position, quaternion: p.quaternion, scale: p.scale, articulation: p.articulation, dissolve: 0 } : null)
  );
  for (let i = ps.length; i < 2; i++) ascii.setWhale(i, null);
  // Camera: an orbit around the main whale (or the pair's centre), keeping world up
  const target: V3 = state.move === 'pair' ? [0, 0, 0] : ps[0].position;
  const az = state.az * deg;
  const el = Math.max(-89.5, Math.min(89.5, state.el)) * deg;
  const d = state.move === 'pair' ? state.dist * 1.9 : state.dist;
  const cam = ascii.camera;
  cam.position.set(target[0] + d * Math.cos(el) * Math.sin(az), target[1] + d * Math.sin(el), target[2] + d * Math.cos(el) * Math.cos(az));
  // Near the poles, "up" is the horizontal direction the camera faces, so the view never flips
  const polar = Math.abs(state.el) > 80;
  cam.up.set(polar ? -Math.sin(az) * Math.sign(state.el) : 0, polar ? 0 : 1, polar ? -Math.cos(az) * Math.sign(state.el) : 0);
  cam.lookAt(target[0], target[1], target[2]);
  // Centre the subject in the space beside the control panel
  const W = window.innerWidth;
  const H = window.innerHeight;
  if (W > 520) cam.setViewOffset(W, H, -Math.min(260, W * 0.32) / 2, 0, W, H);
  else cam.clearViewOffset();
  const mode = state.mode === 'compare' ? 'shape' : state.mode;
  ascii.setStyle({
    mode,
    split: state.mode === 'compare' ? 0.5 : 0,
    cellW: state.cell,
    cellH: Math.round(state.cell * 1.72),
    invert: state.dark,
    ink: state.dark ? [214, 228, 232] : [31, 59, 87],
    inkFar: state.dark ? [120, 140, 150] : [118, 140, 156]
  });
  ascii.render();
}

let raf = 0;
const schedule = () => {
  if (!raf) raf = requestAnimationFrame(tick);
};
let last = 0;
function tick(now: number) {
  raf = 0;
  if (state.play) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    state.t = (state.t + dt * 0.05) % 1;
    syncControls();
    schedule();
  }
  last = state.play ? now : 0;
  frame();
}

function resize() {
  ascii.resize(window.innerWidth, window.innerHeight, Math.min(window.devicePixelRatio || 1, 2));
  schedule();
}

// ---- Panel ------------------------------------------------------------------------------------------

const panel = document.getElementById('panel')!;
const controls: { sync: () => void }[] = [];
function row(label: string, el: HTMLElement) {
  const r = document.createElement('label');
  r.className = 'row';
  const s = document.createElement('span');
  s.textContent = label;
  r.append(s, el);
  panel.append(r);
}
function slider(label: string, key: keyof BenchState, min: number, max: number, step: number, onInput?: () => void) {
  const el = document.createElement('input');
  el.type = 'range';
  el.min = String(min);
  el.max = String(max);
  el.step = String(step);
  el.addEventListener('input', () => {
    (state as unknown as Record<string, number>)[key] = Number(el.value);
    onInput?.();
    schedule();
  });
  controls.push({ sync: () => (el.value = String(state[key])) });
  row(label, el);
}
function select(label: string, key: keyof BenchState, options: string[], onChange?: () => void) {
  const el = document.createElement('select');
  for (const o of options) el.append(new Option(o, o));
  el.addEventListener('change', () => {
    const cur = state[key];
    (state as unknown as Record<string, unknown>)[key] = typeof cur === 'number' ? Number(el.value) : el.value;
    onChange?.();
    syncControls();
    schedule();
  });
  controls.push({ sync: () => (el.value = String(state[key])) });
  row(label, el);
}
function check(label: string, key: 'dark' | 'play') {
  const el = document.createElement('input');
  el.type = 'checkbox';
  el.addEventListener('change', () => {
    state[key] = el.checked;
    if (key === 'dark') document.body.classList.toggle('dark', state.dark);
    schedule();
  });
  controls.push({ sync: () => (el.checked = state[key]) });
  row(label, el);
}
function syncControls() {
  for (const c of controls) c.sync();
}

select('view', 'view', ['left', 'right', 'front', 'rear', 'top', 'bottom', 'threequarter', 'free'], () => {
  if (state.view !== 'free') [state.az, state.el] = VIEWS[state.view];
});
slider('orbit', 'az', -180, 180, 1, () => (state.view = 'free'));
slider('elevation', 'el', -89, 89, 1, () => (state.view = 'free'));
slider('zoom', 'dist', 1.2, 6, 0.05);
select('motion', 'move', ['hold', 'cruise', 'turn', 'dive', 'surface', 'bank', 'pair']);
slider('progress', 't', 0, 1, 0.001);
slider('yaw', 'yaw', -180, 180, 1);
slider('pitch', 'pitch', -90, 90, 1);
slider('roll', 'roll', -180, 180, 1);
slider('effort', 'effort', 0, 1.5, 0.01);
select('render', 'mode', ['shape', 'luminance', 'compare', 'raw']);
slider('glyph', 'cell', 4, 14, 1);
select('whales', 'whales', ['1', '2']);
check('dark water', 'dark');
check('play', 'play');
syncControls();
document.body.classList.toggle('dark', state.dark);

// Drag to orbit, wheel to zoom
let drag: { x: number; y: number; az: number; el: number } | null = null;
canvas.addEventListener('pointerdown', (e) => {
  drag = { x: e.clientX, y: e.clientY, az: state.az, el: state.el };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  state.view = 'free';
  state.az = ((drag.az - (e.clientX - drag.x) * 0.4 + 540) % 360) - 180;
  state.el = Math.max(-89, Math.min(89, drag.el + (e.clientY - drag.y) * 0.3));
  syncControls();
  schedule();
});
canvas.addEventListener('pointerup', () => (drag = null));
canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    state.dist = Math.max(1.2, Math.min(6, state.dist * Math.exp(e.deltaY * 0.001)));
    syncControls();
    schedule();
  },
  { passive: false }
);

window.addEventListener('resize', resize);
ascii.onContextLost = () => (document.getElementById('lost')!.hidden = false);
resize();
document.fonts?.load('500 16px "JetBrains Mono"').then(() => {
  ascii.invalidateAtlas();
  schedule();
});

// Scripted access for checks: __whale.set({ view: 'front', t: 0.3 }) renders synchronously
(window as unknown as { __whale: unknown }).__whale = {
  state,
  set(patch: Partial<BenchState>) {
    Object.assign(state, patch);
    if (patch.view && patch.view !== 'free') [state.az, state.el] = VIEWS[patch.view];
    document.body.classList.toggle('dark', state.dark);
    syncControls();
    frame();
  },
  renderer: ascii
};
