/**
 * The living horizon: the cover's hairline as a damped string of water. A pointer crossing the
 * line, or the surface starting to lift as the visitor begins to descend, sends a slow ripple
 * along it; the ripple spreads, softens and settles back to a straight line. Never more than
 * MAX_AMP px. The loop runs only while the line holds energy, and sleeps otherwise.
 *
 * The CSS hairline (.hero-horizon::before) stays the fallback: this only takes over once mounted.
 */

const NODES = 97;
const MAX_AMP = 3;
/** Wave speed (nodes² / s²), the water's pull back to flat (1 / s²) and damping (1 / s): a slow,
 * soft travel that dies out in about two seconds */
const STIFFNESS = 2600;
const GRAVITY = 30;
const DAMPING = 5;
/** Below this the line is drawn straight and the loop sleeps (well under a tenth of a pixel). */
const REST = 0.02;

export interface HorizonRipple {
  /** The horizon's viewport y and the cover's progress, every drawn cover frame. */
  setY(y: number, progress: number): void;
  destroy(): void;
}

/** What is drawn for a displacement: soft-limited, so the line never strays past MAX_AMP. */
export const drawnAmplitude = (u: number) => MAX_AMP * Math.tanh(u / MAX_AMP);

/** One step of the damped string (exported for tests). Ends are held still (shores). */
export function stepString(u: Float32Array, v: Float32Array, dt: number) {
  const n = u.length;
  for (let i = 1; i < n - 1; i++) {
    const lap = u[i - 1] + u[i + 1] - 2 * u[i];
    v[i] += (lap * STIFFNESS - u[i] * GRAVITY - v[i] * DAMPING) * dt;
  }
  let energy = 0;
  for (let i = 1; i < n - 1; i++) {
    u[i] += v[i] * dt;
    energy += Math.abs(u[i]) + Math.abs(v[i]) * 0.05;
  }
  return energy / n;
}

export function createHorizonRipple(horizon: HTMLElement): HorizonRipple {
  const SVG = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'hero-horizon-wave');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('viewBox', `0 ${-MAX_AMP - 1} ${NODES - 1} ${MAX_AMP * 2 + 2}`);
  const path = document.createElementNS(SVG, 'path');
  path.setAttribute('vector-effect', 'non-scaling-stroke');
  svg.appendChild(path);
  horizon.appendChild(svg);
  horizon.classList.add('hero-horizon--live');

  const u = new Float32Array(NODES);
  const v = new Float32Array(NODES);
  let frame = 0;
  let last = 0;
  let lineY = NaN;
  let lastPointerY = NaN;
  let lastProgress = 0;

  const draw = () => {
    let d = `M0 ${drawnAmplitude(u[0]).toFixed(2)}`;
    for (let i = 1; i < NODES; i++) d += `L${i} ${drawnAmplitude(u[i]).toFixed(2)}`;
    path.setAttribute('d', d);
  };
  draw();

  const tick = (now: number) => {
    const dt = Math.min(0.033, Math.max(0.004, (now - last) / 1000 || 0.016));
    last = now;
    // Sub-steps keep the stiff string stable at a 60 Hz frame
    let energy = 0;
    for (let s = 0; s < 4; s++) energy = stepString(u, v, dt / 4);
    draw();
    if (energy < REST) {
      u.fill(0);
      v.fill(0);
      draw();
      frame = 0;
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  /** A push at x (0..1) of the line, spread over a few nodes */
  const disturb = (x: number, strength: number) => {
    const c = Math.round(Math.max(0.02, Math.min(0.98, x)) * (NODES - 1));
    for (let k = -3; k <= 3; k++) {
      const i = c + k;
      if (i <= 0 || i >= NODES - 1) continue;
      v[i] += strength * Math.exp(-(k * k) / 4);
    }
    wake();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const y = e.clientY;
    if (Number.isFinite(lastPointerY) && Number.isFinite(lineY)) {
      const crossed = (lastPointerY - lineY) * (y - lineY) < 0;
      if (crossed) {
        // Crossing downward presses the surface down; upward lifts it
        const speed = Math.max(-1, Math.min(1, (y - lastPointerY) / 24));
        disturb(e.clientX / Math.max(1, window.innerWidth), speed * 190);
      }
    }
    lastPointerY = y;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  return {
    setY(y, progress) {
      lineY = y;
      // The surface starts to lift as the descent begins: one soft swell travels outward
      if (lastProgress <= 0.002 && progress > 0.002 && progress < 0.1) {
        disturb(0.32, -110);
        disturb(0.71, 75);
      }
      lastProgress = progress;
    },
    destroy() {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      svg.remove();
      horizon.classList.remove('hero-horizon--live');
    }
  };
}
