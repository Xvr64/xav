/** Two gesture-triggered timelines. Elapsed time drives playback; document scroll is its output.
 * Renderers continue using that synchronized scroll position, preserving the existing visuals.
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

/** Choreography knots are timing cues, never input checkpoints. */
export interface CinematicStops {
  y: number[];
  dur: number[];
  /** The Earth is complete and resting at Doha at this knot. */
  earth: number;
}

export interface CinematicScroll {
  goTo(index: number): void;
  skip(): void;
  destroy(): void;
}

export const CINEMATIC_SPEED = 1.5;
/** A reversal mid-film turns the playback round over about this long (s): heavy, never a snap. */
const RATE_EASE_SECONDS = 0.28;
/** How long after a film ends any input still belongs to the gesture that played it (ms): a fast
 * trackpad's next flick or a spun wheel can never launch the next film the moment one arrives. */
export const SETTLE_MS = 700;
/** How long the browser may still be animating a wheel's native smooth scroll after it (ms). */
const NATIVE_GLIDE_MS = 500;

export const timelineTimes = (st: CinematicStops): number[] => {
  const t = [0];
  for (const d of st.dur) t.push(t[t.length - 1] + d);
  return t;
};

/** Continuous whale choreography; gentle, automatic slow arrivals at each city. */
export function timelineY(st: CinematicStops, time: number): number {
  const times = timelineTimes(st);
  let i = 0;
  while (i < st.dur.length - 1 && time > times[i + 1]) i++;
  const u = Math.max(0, Math.min(1, (time - times[i]) / st.dur[i]));
  const slope = (k: number) => {
    if (k === 0 || k >= st.earth) return 0;
    const a = (st.y[k] - st.y[k - 1]) / st.dur[k - 1];
    const b = (st.y[k + 1] - st.y[k]) / st.dur[k];
    // Harmonic mean is monotone and shares velocity across choreography knots.
    return 2 * a * b / (a + b || 1);
  };
  const u2 = u * u, u3 = u2 * u;
  return (2*u3 - 3*u2 + 1) * st.y[i] + (u3 - 2*u2 + u) * st.dur[i] * slope(i)
    + (-2*u3 + 3*u2) * st.y[i + 1] + (u3 - u2) * st.dur[i] * slope(i + 1);
}

/** Resume a deep link / native scrollbar position without snapping to a timing cue. */
export function timelineTime(st: CinematicStops, y: number): number {
  const times = timelineTimes(st);
  let lo = 0, hi = times[times.length - 1];
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (timelineY(st, mid) < y) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Only the section start, Doha, and section end can be gesture destinations. */
export function sequenceTarget(st: CinematicStops, y: number, dir: -1 | 1): number | null {
  const last = st.y.length - 1;
  if (dir > 0) return y < st.y[st.earth] - 2 ? st.earth : y < st.y[last] - 2 ? last : null;
  return y > st.y[st.earth] + 2 ? st.earth : y > st.y[0] + 2 ? 0 : null;
}

export function mountCinematicScroll(stops: () => CinematicStops | null): CinematicScroll {
  let gestures = createWheelGestures();
  let raf = 0;
  let play: { time: number; target: number; direction: -1 | 1; rate: number; last: number; lo: number; hi: number } | null = null;
  let lastWheel = -Infinity;
  let wheelLocked = false;
  let entryGesture: -1 | 0 | 1 = 0;
  let lastDirection: -1 | 1 = 1;
  let expectedY: number | null = null;
  let settleUntil = -Infinity;
  /** Where the browser's own smooth scrolling of recent, uncaptured wheel events is heading. */
  let native: { target: number; until: number } | null = null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const geometry = () => reduced.matches ? null : stops();
  const scrollTo = (y: number) => {
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    expectedY = window.scrollY;
  };
  const cancel = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    play = null;
  };
  const finish = () => {
    cancel();
    // Events seen during playback never queue the next film, including momentum at its end.
    wheelLocked = true;
    settleUntil = performance.now() + SETTLE_MS;
    gestures = createWheelGestures();
  };
  const frame = (now: number) => {
    raf = 0;
    const st = geometry();
    if (!play || !st) { cancel(); return; }
    const times = timelineTimes(st);
    const dt = Math.max(0, (now - play.last) / 1000);
    play.last = now;
    // Integrate a short velocity transition exactly: direction changes keep position AND speed.
    const decay = Math.exp(-dt / RATE_EASE_SECONDS);
    const distance = play.direction * dt + (play.rate - play.direction) * RATE_EASE_SECONDS * (1 - decay);
    play.rate = play.direction + (play.rate - play.direction) * decay;
    play.time = Math.max(times[play.lo], Math.min(times[play.hi], play.time + distance));
    const end = times[play.target];
    const done = play.direction > 0 ? play.time >= end : play.time <= end;
    scrollTo(timelineY(st, done ? end : play.time));
    if (done) { finish(); return; }
    raf = requestAnimationFrame(frame);
  };
  const goTo = (index: number) => {
    const st = geometry();
    if (!st) return;
    const target = Math.max(0, Math.min(st.y.length - 1, index));
    const time = play?.time ?? timelineTime(st, window.scrollY);
    const end = timelineTimes(st)[target];
    if (Math.abs(end - time) < 0.0001) return;
    const direction = end > time ? 1 : -1;
    lastDirection = direction;
    const times = timelineTimes(st);
    // From rest at a film's start or end the timeline itself eases in, so playback runs at full
    // rate at once and every film keeps its exact length; anywhere else it gathers its pace
    const resting = times.some((t, k) => (k === 0 || k >= st.earth) && Math.abs(t - time) < 1e-6);
    play = { time, target, direction, rate: play?.rate ?? (resting ? direction : 0), last: performance.now(),
      lo: Math.min(target, window.scrollY >= st.y[st.earth] - 2 ? st.earth : 0),
      hi: Math.max(target, window.scrollY <= st.y[st.earth] + 2 ? st.earth : st.y.length - 1) };
    // Take the scroll now: a programmatic scroll ends any smooth scroll the browser is still
    // animating, so it can neither carry the page on into the film nor cancel it
    scrollTo(timelineY(st, time));
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const step = (dir: -1 | 1) => {
    const st = geometry();
    if (!st) return;
    if (play) {
      if (dir === play.direction) return; // no extension, restart or queued input
      lastDirection = dir;
      play.direction = dir;
      play.target = dir > 0 ? play.hi : play.lo;
      return;
    }
    const target = sequenceTarget(st, window.scrollY, dir);
    if (target !== null) goTo(target);
  };
  const captures = (st: CinematicStops, pos: number, dir: number, distance = 0) => {
    if (play) return true;
    const first = st.y[0], last = st.y[st.y.length - 1];
    if (pos < first - 2) return dir > 0 && pos + distance >= first;
    if (pos > last + 2) return dir < 0 && pos + distance <= last;
    return dir > 0 ? pos < last - 2 : pos > first + 2;
  };
  const editable = (t: EventTarget | null) =>
    t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  const nestedScroller = (t: EventTarget | null) => {
    let el = t instanceof HTMLElement ? t : null;
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollHeight > el.clientHeight && /auto|scroll/.test(getComputedStyle(el).overflowY)) return true;
      el = el.parentElement;
    }
    return false;
  };
  const onWheel = (e: WheelEvent) => {
    if (e.defaultPrevented || e.ctrlKey || editable(e.target) || nestedScroller(e.target)) return;
    const st = geometry();
    if (!st) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const delta = e.deltaY * unit;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX) || !delta) return;
    const now = performance.now();
    const quiet = now - lastWheel >= GESTURE_GAP_MS;
    if (quiet) entryGesture = 0;
    lastWheel = now;
    const dir = Math.sign(delta) as -1 | 1;
    // Keep an uninterrupted tail captured even at the outer endpoints, until a new gesture; and
    // just after a film ends, even a fresh one in the same direction belongs to the last
    if (wheelLocked && (!quiet || now < settleUntil)) {
      const g = gestures.feed(delta, now);
      if (!g || g === lastDirection) { e.preventDefault(); return; }
      // A reversal needs the full intent threshold too: tiny trackpad sign bounces cannot unlock.
      wheelLocked = false;
      if (captures(st, window.scrollY, g, delta)) { e.preventDefault(); step(g); }
      return;
    }
    if (wheelLocked) { wheelLocked = false; gestures = createWheelGestures(); }
    // Outside the films, judge where the page is heading, not where it is: the browser may still
    // be gliding toward the targets of earlier notches, and would carry the page into a film
    if (native && (now > native.until || Math.sign(native.target - window.scrollY) !== dir)) native = null;
    const heading = native ? native.target : window.scrollY;
    if (!captures(st, heading, dir, delta)) {
      const g = gestures.feed(delta, now);
      if (g) entryGesture = g;
      native = { target: heading + delta, until: now + NATIVE_GLIDE_MS };
      return;
    }
    e.preventDefault();
    const g = gestures.feed(delta, now);
    const entering = window.scrollY < st.y[0] - 2 || window.scrollY > st.y[st.y.length - 1] + 2;
    if (g || (entering && entryGesture === dir) || (entering && native)) {
      step(g || dir);
      entryGesture = 0;
    }
    native = null;
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || editable(e.target) || nestedScroller(e.target)) return;
    if (e.key === 'Escape' && play) {
      const st = geometry();
      if (st) scrollTo(st.y[play.direction > 0 ? st.y.length - 1 : 0]);
      finish();
      e.preventDefault();
      return;
    }
    // Home / End / Tab retain native navigation and release the animation immediately.
    if (['Home', 'End', 'Tab'].includes(e.key)) { cancel(); return; }
    let dir: -1 | 0 | 1 = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) dir = -1;
    if (!dir) return;
    if (e.key === ' ' && e.target instanceof HTMLElement && e.target.closest('button, a, summary, [role="button"]')) return;
    const st = geometry();
    const distance = dir * (e.key.startsWith('Arrow') ? 40 : window.innerHeight * 0.85);
    if (!st || !captures(st, window.scrollY, dir, distance)) return;
    e.preventDefault();
    if (!e.repeat) step(dir);
  };

  let touchY = 0, touchX = 0;
  let touchCaptured = false, touchEligible = false, touchStartedPlaying = false;
  const onTouchStart = (e: TouchEvent) => {
    touchEligible = e.touches.length === 1 && !editable(e.target) && !nestedScroller(e.target);
    touchCaptured = false;
    touchStartedPlaying = !!play;
    if (!touchEligible) return;
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!touchEligible || e.touches.length !== 1) return;
    const dy = touchY - e.touches[0].clientY;
    if (Math.abs(dy) < 6 || Math.abs(dy) < Math.abs(touchX - e.touches[0].clientX)) return;
    const st = geometry();
    touchCaptured ||= !!st && captures(st, window.scrollY, Math.sign(dy), dy);
    if (touchCaptured && e.cancelable) e.preventDefault();
  };
  const onTouchEnd = (e: TouchEvent) => {
    const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
    if (touchCaptured && (!touchStartedPlaying || play) && Math.abs(dy) >= 24) step(Math.sign(dy) as -1 | 1);
    touchCaptured = false;
    touchEligible = false;
  };
  const onTouchCancel = () => { touchCaptured = false; touchEligible = false; };
  // Scrollbar drags, anchors and assistive navigation always override playback; the last of a
  // smooth scroll the browser was animating as a film began does not, the film's frames keep the page
  const onScroll = () => {
    if (play && expectedY !== null && Math.abs(window.scrollY - expectedY) > 2 && !(native && performance.now() < native.until)) cancel();
  };
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.clientX >= document.documentElement.clientWidth) cancel();
  };
  const onReduced = () => { if (reduced.matches) cancel(); };
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchCancel, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  reduced.addEventListener('change', onReduced);
  return {
    goTo,
    skip: cancel,
    destroy() {
      cancel();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      reduced.removeEventListener('change', onReduced);
    }
  };
}
