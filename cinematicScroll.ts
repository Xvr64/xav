/**
 * Assisted scrolling for the one cinematic stretch of the page: the whales becoming the Earth and
 * the Globe's city journey. Everything there is already a pure function of the document's scroll
 * position, so this controller never keeps a progress of its own: one deliberate gesture picks
 * the next checkpoint (a resting point of the choreography) and the controller glides the real
 * scroll position to it over a scene-appropriate time. The visuals, the white-to-black descent,
 * reloads and history all follow the scroll, so nothing can drift out of sync and no scroll debt
 * builds up. Outside the stretch, and past either end of it, native scrolling is untouched.
 *
 *   gestures   wheel (mouse or trackpad, momentum filtered), keys, touch swipes
 *   stepping   one checkpoint per gesture; a gesture during a glide extends it by at most one
 *              more; a reversal turns back from wherever the glide is to the checkpoint behind
 *   motion     a cubic Hermite from the current position and velocity to rest on the target
 */

/** Recognises deliberate wheel gestures in a stream of deltas (momentum tails are not new input). */
export interface WheelGestures {
  /** Feed one wheel event (px, + down) at time `now` (ms); returns ±1 when a new gesture is recognised. */
  feed(delta: number, now: number): -1 | 0 | 1;
}

/** Pixels of travel that make an intentional gesture: one mouse-wheel notch, a short trackpad stroke. */
export const GESTURE_PX = 28;
/** A pause this long ends a gesture (trackpad momentum and a spinning wheel never pause this long). */
export const GESTURE_GAP_MS = 190;
/** Inside one gesture, a fresh impulse may start a new one only after this long. */
export const GESTURE_REFIRE_MS = 480;

export function createWheelGestures(): WheelGestures {
  let armed = true;
  let acc = 0;
  let dir = 0;
  let last = -Infinity;
  let fired = -Infinity;
  let prev = 0;
  let decaying = false;
  return {
    feed(delta, now) {
      const d = Math.sign(delta);
      if (d === 0) return 0;
      const mag = Math.abs(delta);
      // A pause, or a reversal, always begins a new gesture
      if (now - last >= GESTURE_GAP_MS || d !== dir) {
        armed = true;
        acc = 0;
        decaying = false;
      } else if (!armed && decaying && now - fired >= GESTURE_REFIRE_MS && mag > prev * 1.8 && mag >= 12) {
        // Momentum only ever fades; a delta that jumps back up after fading is the hand again
        armed = true;
        acc = 0;
      }
      if (mag < prev) decaying = true;
      dir = d;
      last = now;
      prev = mag;
      if (!armed) return 0;
      acc += mag;
      if (acc < GESTURE_PX) return 0;
      armed = false;
      acc = 0;
      fired = now;
      decaying = false;
      return d as -1 | 1;
    }
  };
}

/** Index of the checkpoint a step in `dir` should aim for, from position `pos` (and a glide's target). */
export function nextCheckpoint(cps: readonly number[], pos: number, dir: -1 | 1, target: number | null, eps = 2): number | null {
  if (!cps.length) return null;
  if (dir > 0) {
    let next = cps.findIndex((y) => y > pos + eps);
    if (next < 0) return null;
    // Extending a glide in the same direction: one beyond its target, never further than one
    // beyond the checkpoint the glide is about to reach
    if (target !== null && cps[target] > pos + eps) next = Math.min(target + 1, next + 1, cps.length - 1);
    return next;
  }
  let prev = -1;
  for (let i = cps.length - 1; i >= 0; i--) if (cps[i] < pos - eps) { prev = i; break; }
  if (prev < 0) return null;
  if (target !== null && cps[target] < pos - eps) prev = Math.max(target - 1, prev - 1, 0);
  return prev;
}

/** Cubic Hermite from (y0, v0) to rest at y1 over `dur` s: position at time t. */
export function glideAt(y0: number, v0: number, y1: number, dur: number, t: number): { y: number; v: number } {
  if (dur <= 0 || t >= dur) return { y: y1, v: 0 };
  const s = Math.max(0, t / dur);
  const s2 = s * s, s3 = s2 * s;
  const m0 = v0 * dur;
  const y = (2 * s3 - 3 * s2 + 1) * y0 + (s3 - 2 * s2 + s) * m0 + (-2 * s3 + 3 * s2) * y1;
  const dy = ((6 * s2 - 6 * s) * y0 + (3 * s2 - 4 * s + 1) * m0 + (-6 * s2 + 6 * s) * y1) / dur;
  return { y, v: dy };
}

export interface CinematicStops {
  /** Document scroll positions of the checkpoints, ascending; the first and last are the stretch's ends. */
  y: number[];
  /** Seconds the choreography takes from checkpoint i to i + 1 (length y.length - 1). */
  dur: number[];
}

export interface CinematicScroll {
  /** Glide to checkpoint `index` (e.g. a city chosen from the timeline). */
  goTo(index: number): void;
  destroy(): void;
}

/**
 * Bind the controller to the window. `stops()` is read live (geometry follows resizes and font
 * loads); it returns null while the stretch is unavailable (reduced motion, not measured yet).
 */
export function mountCinematicScroll(stops: () => CinematicStops | null): CinematicScroll {
  const gestures = createWheelGestures();
  let raf = 0;
  let driving = false;
  let glide: { from: number; v0: number; to: number; dur: number; t0: number } | null = null;
  let vel = 0;
  let lastY = window.scrollY;
  let lastT = performance.now();
  let settleTimer = 0;
  let nativeDir = 0;
  let pointerHeld = false;

  const scrollTo = (y: number) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  /** Within the stretch, and not at an edge facing out of it (where native scrolling takes over). */
  const captures = (st: CinematicStops, pos: number, dir: number) => {
    const first = st.y[0], last = st.y[st.y.length - 1];
    if (pos < first - 2 || pos > last + 2) return false;
    if (dir < 0 && pos <= first + 2 && !glide) return false;
    if (dir > 0 && pos >= last - 2 && !glide) return false;
    return true;
  };
  /** Choreography time between two positions: the stages' own durations, prorated. */
  const durationBetween = (st: CinematicStops, a: number, b: number) => {
    const lo = Math.min(a, b), hi = Math.max(a, b);
    let sec = 0;
    for (let i = 0; i < st.dur.length; i++) {
      const s0 = st.y[i], s1 = st.y[i + 1];
      const span = s1 - s0;
      if (span <= 0) continue;
      const overlap = Math.min(hi, s1) - Math.max(lo, s0);
      if (overlap > 0) sec += st.dur[i] * (overlap / span);
    }
    return Math.max(0.45, sec);
  };
  const frame = (now: number) => {
    raf = 0;
    const st = stops();
    if (!glide || !st) { glide = null; driving = false; return; }
    const to = st.y[Math.min(glide.to, st.y.length - 1)];
    const { y, v } = glideAt(glide.from, glide.v0, to, glide.dur, (now - glide.t0) / 1000);
    vel = v;
    driving = true;
    scrollTo(y);
    lastY = y;
    if ((now - glide.t0) / 1000 >= glide.dur) {
      glide = null;
      vel = 0;
      // Let the final scroll event pass before native scrolls count again
      requestAnimationFrame(() => (driving = false));
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  const glideTo = (index: number) => {
    const st = stops();
    if (!st) return;
    const i = Math.max(0, Math.min(st.y.length - 1, index));
    const pos = window.scrollY;
    if (Math.abs(st.y[i] - pos) < 1 && !glide) return;
    // From wherever the stage is now, at the speed it is moving: never a snap, never a restart
    const moving = glide && Math.sign(st.y[i] - pos) === Math.sign(vel) ? vel : 0;
    glide = { from: pos, v0: moving, to: i, dur: durationBetween(st, pos, st.y[i]), t0: performance.now() };
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const step = (dir: -1 | 1) => {
    const st = stops();
    if (!st) return;
    const next = nextCheckpoint(st.y, window.scrollY, dir, glide ? glide.to : null);
    if (next !== null) glideTo(next);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // pinch-zoom
    const st = stops();
    if (!st) return;
    const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    if (Math.abs(delta) < Math.abs(e.deltaX) || delta === 0) return;
    const dir = Math.sign(delta);
    const pos = window.scrollY;
    if (!captures(st, pos, dir)) {
      // Native scrolling outside; still listen, so momentum carried in is not a fresh gesture
      gestures.feed(delta, e.timeStamp || performance.now());
      return;
    }
    e.preventDefault();
    const g = gestures.feed(delta, e.timeStamp || performance.now());
    if (g) step(g);
  };

  const editable = (t: EventTarget | null) =>
    t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || editable(e.target)) return;
    let dir = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) dir = -1;
    if (!dir) return;
    // A focused control keeps its own keys (Space on a button)
    if (e.key === ' ' && e.target instanceof HTMLElement && e.target.closest('button, a, summary, [role="button"]')) return;
    const st = stops();
    if (!st || !captures(st, window.scrollY, dir)) return;
    e.preventDefault();
    if (!e.repeat) step(dir as -1 | 1);
  };

  let touchY = 0;
  let touchDir = 0;
  let touchCaptured = false;
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchY = e.touches[0].clientY;
    touchDir = 0;
    touchCaptured = false;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    const dy = touchY - e.touches[0].clientY; // + means the page would scroll down
    if (!touchDir) {
      if (Math.abs(dy) < 6) return;
      touchDir = Math.sign(dy);
      const st = stops();
      touchCaptured = !!st && captures(st, window.scrollY, touchDir);
    }
    if (touchCaptured && e.cancelable) e.preventDefault();
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (!touchCaptured) return;
    const t = e.changedTouches[0];
    const dy = t ? touchY - t.clientY : 0;
    if (Math.abs(dy) >= 24) step(Math.sign(dy) as -1 | 1);
    touchCaptured = false;
  };

  /**
   * A native scroll that ends inside the stretch (the scrollbar, find-in-page, a link, the
   * momentum that carried the visitor in) settles on a checkpoint: onward in the direction it was
   * going, or back to the nearer one if it barely left it.
   */
  const settle = () => {
    settleTimer = 0;
    if (glide || pointerHeld) return;
    const st = stops();
    if (!st) return;
    const pos = window.scrollY;
    const first = st.y[0], last = st.y[st.y.length - 1];
    if (pos <= first + 2 || pos >= last - 2) return;
    let i = 0;
    while (i < st.y.length - 2 && st.y[i + 1] <= pos) i++;
    const a = st.y[i], b = st.y[i + 1];
    if (Math.abs(pos - a) <= 2 || Math.abs(pos - b) <= 2) return;
    const f = (pos - a) / Math.max(1, b - a);
    const target = nativeDir > 0 ? (f < 0.12 ? i : i + 1) : nativeDir < 0 ? (f > 0.88 ? i + 1 : i) : f < 0.5 ? i : i + 1;
    glideTo(target);
  };
  const onScroll = () => {
    const now = performance.now();
    const y = window.scrollY;
    if (!driving) {
      if (y !== lastY) nativeDir = Math.sign(y - lastY);
      vel = ((y - lastY) / Math.max(1, now - lastT)) * 1000;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 220);
    }
    lastY = y;
    lastT = now;
  };
  const onPointerDown = () => (pointerHeld = true);
  const onPointerUp = () => {
    pointerHeld = false;
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 220);
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  // A reload or history step may restore a position between checkpoints
  settleTimer = window.setTimeout(settle, 400);

  return {
    goTo: glideTo,
    destroy() {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    }
  };
}
