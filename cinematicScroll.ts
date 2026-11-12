/** Two gesture-triggered timelines. Elapsed time drives playback; document scroll is its output.
 * Renderers continue using that synchronized scroll position, preserving the existing visuals.
 */

/** Recognises deliberate wheel gestures in a stream of deltas (momentum tails are not new input). */
export interface WheelGestures {
  /** Feed one wheel event (px, + down) at time `now` (ms); returns ±1 when a new gesture is recognised. */
  feed(delta: number, now: number): -1 | 0 | 1;
  /** Mark the current uninterrupted stream in `direction` as already consumed so leftover momentum cannot refire. */
  disarm?(direction: -1 | 1, now?: number): void;
  /** True when an uninterrupted wheel stream has already fired a gesture in `direction`. */
  activeIn?(direction: -1 | 1, now: number): boolean;
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
  let firedDir = 0;
  let last = -Infinity;
  let fired = -Infinity;
  let prev = 0;
  let env = 0;
  let decaying = false;
  return {
    feed(delta, now) {
      const d = Math.sign(delta);
      if (d === 0) return 0;
      const mag = Math.abs(delta);
      if (now - last >= GESTURE_GAP_MS) {
        armed = true;
        acc = 0;
        firedDir = 0;
        env = 0;
        decaying = false;
      } else if (d !== dir) {
        // Reversal vs unconfirmed sign bounce: only arm if opposite to the direction that already fired
        armed = d !== firedDir;
        acc = 0;
        env = 0;
        decaying = false;
      } else if (!armed && decaying && now - fired >= GESTURE_REFIRE_MS && mag > Math.max(prev, env) * 1.8 && mag >= 18) {
        // Momentum only ever fades; a delta that jumps back up after fading is the hand again
        armed = true;
        acc = 0;
      }
      if (mag < prev) decaying = true;
      dir = d;
      last = now;
      prev = mag;
      env = Math.max(mag, env * 0.82);
      if (!armed) return 0;
      acc += mag;
      if (acc < GESTURE_PX) return 0;
      armed = false;
      acc = 0;
      fired = now;
      firedDir = d;
      decaying = false;
      return d as -1 | 1;
    },
    disarm(direction, now = last) {
      armed = false;
      acc = 0;
      dir = direction;
      firedDir = direction;
      if (Number.isFinite(now)) fired = now;
      decaying = false;
    },
    activeIn(direction, now) {
      return now - last < GESTURE_GAP_MS && firedDir === direction;
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
  snapshot(): CinematicSnapshot;
  refresh(): void;
}

export type MobileOwnership = 'document' | 'ready' | 'playing' | 'draining';
export interface CinematicSnapshot {
  ownership: MobileOwnership | 'desktop';
  owner: MobileOwnership | 'desktop';
  playing: boolean;
  time: number | null;
  target: number | null;
  direction: number;
  timelineY: number | null;
  expectedY: number | null;
  documentY: number;
  actualY: number;
  scrollDivergencePx: number | null;
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

export function mountCinematicScroll(
  stops: () => CinematicStops | null,
  onLockY?: (y: number | null, playing?: boolean) => void,
  onSample?: (sample: CinematicSnapshot) => void
): CinematicScroll {
  let gestures = createWheelGestures();
  let raf = 0;
  let play: {
    time: number;
    target: number;
    direction: -1 | 1;
    rate: number;
    last: number;
    lo: number;
    hi: number;
    entryY: number;
  } | null = null;
  let lastWheel = -Infinity;
  let wheelLocked = false;
  let entryGesture: -1 | 0 | 1 = 0;
  let lastDirection: -1 | 1 = 1;
  let expectedY: number | null = null;
  let lastScrollY = window.scrollY;
  let scrollbarDrag = false;
  let settleUntil = -Infinity;
  let mobile = window.matchMedia('(pointer: coarse)').matches;
  let ownership: MobileOwnership = 'document';
  let touchDown = false;
  let readyTime = 0;
  let escapeSince: number | null = null;
  let restoreNative: (() => void) | null = null;
  // Mobile ownership is a gesture lifecycle, not a timer. A finger already down at
  // an endpoint must lift before the next gesture can leave or start another film.
  const own = (next: MobileOwnership) => {
    ownership = next;
    if (next === 'document') { restoreNative?.(); restoreNative = null; return; }
    if (restoreNative) return;
    const style = document.documentElement.style;
    const properties = ['overflow-y', 'touch-action', 'overscroll-behavior'] as const;
    const saved = properties.map(p => [p, style.getPropertyValue(p), style.getPropertyPriority(p)]);
    const restoration = window.history.scrollRestoration;
    // Keep the document scrollable by the clock (sticky geometry stays unchanged),
    // but remove native panning/scroll chaining. Never turn body into a scroll container.
    document.documentElement.setAttribute?.('data-globe-scroll', 'locked');
    style.setProperty('overflow-y', 'hidden', 'important');
    style.setProperty('touch-action', 'none', 'important');
    style.setProperty('overscroll-behavior', 'none', 'important');
    window.history.scrollRestoration = 'manual';
    restoreNative = () => {
      document.documentElement.removeAttribute?.('data-globe-scroll');
      for (const [p, value, priority] of saved) {
        if (value) style.setProperty(p, value, priority); else style.removeProperty(p);
      }
      window.history.scrollRestoration = restoration;
    };
  };
  const snapshot = (): CinematicSnapshot => {
    const owner = mobile ? ownership : 'desktop';
    const actualY = window.scrollY;
    return {
      ownership: owner,
      owner,
      playing: play !== null,
      time: play?.time ?? null,
      target: play?.target ?? null,
      direction: play?.direction ?? lastDirection,
      timelineY: expectedY,
      expectedY,
      documentY: actualY,
      actualY,
      scrollDivergencePx: expectedY !== null ? actualY - expectedY : null
    };
  };
  const publish = () => { onLockY?.(expectedY, play !== null); onSample?.(snapshot()); };
  /** Where the browser's own smooth scrolling of recent, uncaptured wheel events is heading. */
  let native: { target: number; until: number } | null = null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const geometry = () => reduced.matches ? null : stops();
  const scrollTo = (y: number) => {
    // Publish the clock's output, never a possibly stale Safari scroll readback.
    expectedY = y;
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    lastScrollY = window.scrollY;
    publish();
  };
  const releaseLock = () => {
    wheelLocked = false;
    expectedY = null;
    escapeSince = null;
    if (mobile) own('document');
    publish();
  };
  const cancel = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    play = null;
    releaseLock();
  };
  const releaseWhenCommitted = () => {
    raf = 0;
    if (ownership !== 'draining' || play) return;
    // Safari may acknowledge scrollTo on a later frame. Do not drop the final
    // renderer position until that position is also the document's position.
    if (expectedY !== null && Math.abs(window.scrollY - expectedY) > 2) {
      raf = requestAnimationFrame(releaseWhenCommitted);
    } else if (!touchDown) releaseLock();
  };
  const finish = () => {
    const lockedY = expectedY;
    cancelAnimationFrame(raf);
    raf = 0;
    play = null;
    if (mobile) {
      own('draining'); publish();
      releaseWhenCommitted();
      return;
    }
    // Events seen during playback never queue the next film, including momentum at its end.
    wheelLocked = true;
    expectedY = lockedY;
    publish();
    settleUntil = performance.now() + SETTLE_MS;
    gestures.disarm?.(lastDirection, performance.now());
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
    const times = timelineTimes(st);
    const last = st.y.length - 1;
    const preEntryY = window.scrollY;

    let time: number;
    let lo: number;
    let hi: number;

    if (play) {
      time = play.time;
      lo = play.lo;
      hi = play.hi;
    } else {
      if (target === st.earth) {
        if (window.scrollY > st.y[st.earth] + 2) {
          lo = st.earth;
          hi = last;
          time = window.scrollY >= st.y[last] - 10 ? times[hi] : timelineTime(st, window.scrollY);
        } else {
          lo = 0;
          hi = st.earth;
          time = times[0];
        }
      } else if (target === last) {
        lo = st.earth;
        hi = last;
        time = window.scrollY <= st.y[st.earth] + 10 ? times[st.earth] : timelineTime(st, window.scrollY);
      } else if (target === 0) {
        lo = 0;
        hi = st.earth;
        time = window.scrollY >= st.y[st.earth] - 10 ? times[st.earth] : timelineTime(st, window.scrollY);
      } else {
        time = timelineTime(st, window.scrollY);
        lo = Math.min(target, window.scrollY >= st.y[st.earth] - 2 ? st.earth : 0);
        hi = Math.max(target, window.scrollY <= st.y[st.earth] + 2 ? st.earth : last);
      }
    }

    const end = times[target];
    if (Math.abs(end - time) < 0.0001) return;
    const direction = end > time ? 1 : -1;
    lastDirection = direction;
    if (!play) {
      // Mark any ongoing wheel stream as consumed so incoming scroll speed never accelerates or queues playback
      gestures.disarm?.(direction, performance.now());
    }
    // From rest at a film's start or end the timeline itself eases in, so playback runs at full
    // rate at once and every film keeps its exact length; anywhere else it gathers its pace
    const resting = times.some((t, k) => (k === 0 || k >= st.earth) && Math.abs(t - time) < 1e-6);
    play = {
      time,
      target,
      direction,
      rate: play?.rate ?? (resting ? direction : 0),
      last: performance.now(),
      lo,
      hi,
      entryY: play?.entryY ?? preEntryY
    };
    if (mobile) own('playing');
    // Take the scroll now: programmatic scroll pins position to the start of this film
    const outY = timelineY(st, time);
    scrollTo(outY);
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
  // Wheel, native inertia and touch must enter through the same resting state. In the
  // current film earth === 0: goTo(0) alone is a no-op, not a landing on Doha.
  const enterFromAbove = (st: CinematicStops, entryY: number) => {
    if (mobile) { readyTime = 0; own('ready'); }
    scrollTo(st.y[0]);
    lastDirection = 1;
    if (st.earth > 0) {
      goTo(st.earth);
      if (play) play.entryY = Math.min(play.entryY, entryY);
    } else {
      wheelLocked = true;
      settleUntil = performance.now() + SETTLE_MS;
      gestures.disarm?.(1, performance.now());
    }
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
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX) || !delta) {
      if (delta && (play || wheelLocked)) e.preventDefault();
      return;
    }
    const now = performance.now();
    if (mobile && ownership !== 'document') {
      e.preventDefault();
      if (ownership === 'draining') return;
      const g = gestures.feed(delta, now);
      if (g) {
        if (!play && sequenceTarget(st, expectedY ?? window.scrollY, g) === null) {
          const y = expectedY ?? window.scrollY;
          releaseLock();
          window.scrollTo({ top: y + delta, behavior: 'instant' as ScrollBehavior });
        } else step(g);
      }
      return;
    }
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
      releaseLock();
      if (captures(st, window.scrollY, g, delta)) { e.preventDefault(); step(g); }
      return;
    }
    if (wheelLocked) { releaseLock(); gestures = createWheelGestures(); }
    // Outside the films, judge where the page is heading, not where it is: the browser may still
    // be gliding toward the targets of earlier notches, and would carry the page into a film
    if (native && (now > native.until || Math.sign(native.target - window.scrollY) !== dir)) native = null;
    const rawHeading = native ? native.target : window.scrollY;
    const maxLead = 120;
    const heading = dir > 0
      ? Math.min(rawHeading, window.scrollY + maxLead)
      : Math.max(rawHeading, window.scrollY - maxLead);
    if (!captures(st, heading, dir, delta)) {
      const g = gestures.feed(delta, now);
      if (g) entryGesture = g;
      native = { target: heading + delta, until: now + NATIVE_GLIDE_MS };
      return;
    }
    e.preventDefault();
    const g = gestures.feed(delta, now);
    const activeStream = gestures.activeIn?.(dir, now) ?? false;
    const enteringFromAbove =
      heading < st.y[0] - 2 ||
      window.scrollY < st.y[0] - 2 ||
      ((entryGesture > 0 || activeStream) && !play && window.scrollY < st.y[st.earth] - 2);
    const enteringFromBelow =
      heading > st.y[st.y.length - 1] + 2 ||
      window.scrollY > st.y[st.y.length - 1] + 2 ||
      ((entryGesture < 0 || activeStream) && !play && window.scrollY > st.y[st.earth] + 2);
    const entering = enteringFromAbove || enteringFromBelow;
    if (g || (entering && (entryGesture === dir || activeStream)) || (entering && native)) {
      if (enteringFromAbove && dir > 0) {
        enterFromAbove(st, window.scrollY);
      } else if (enteringFromBelow && dir < 0) {
        const entryY = window.scrollY;
        scrollTo(st.y[st.y.length - 1]);
        goTo(st.earth);
        if (play) play.entryY = Math.max(play.entryY, entryY);
      } else {
        step(g || dir);
      }
      entryGesture = 0;
    }
    if (entering) {
      native = { target: expectedY ?? window.scrollY, until: now + NATIVE_GLIDE_MS };
    } else if (!play) {
      native = null;
    }
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
    if (!st || !captures(st, window.scrollY, dir, distance)) {
      releaseLock();
      return;
    }
    e.preventDefault();
    if (!e.repeat) step(dir);
  };

  let touchY = 0, touchX = 0;
  let touchCaptured = false, touchEligible = false, touchStartedPlaying = false;
  let touchEntryY = 0;
  const onTouchStart = (e: TouchEvent) => {
    mobile = true;
    touchDown = true;
    touchEligible = !e.defaultPrevented && e.touches.length === 1 && !editable(e.target) && !nestedScroller(e.target);
    touchCaptured = false;
    touchStartedPlaying = !!play;
    touchEntryY = window.scrollY;
    // Adopt playback started by keyboard/city selection before any touch arrives.
    if (play) own('playing');
    if (!touchEligible) return;
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
    const st = geometry();
    const pos = ownership !== 'document' && expectedY !== null ? expectedY : window.scrollY;
    if (st && pos >= st.y[0] - 2 && pos < st.y[st.y.length - 1] - 2) {
      touchCaptured = true;
      if (!play) {
        readyTime = timelineTime(st, pos);
        own('ready'); scrollTo(pos);
      }
    }
  };
  const onTouchMove = (e: TouchEvent) => {
    // Cancel the FIRST move, including a 1px/horizontal move, while owned. Waiting
    // for the intent threshold lets iOS commit a native pan that cannot be cancelled later.
    if (ownership !== 'document' && e.cancelable) e.preventDefault();
    if (e.touches.length !== 1) { touchEligible = false; touchCaptured = false; return; }
    if (!touchEligible) return;
    const st = geometry();
    if (st && window.scrollY >= st.y[0] - 2 && window.scrollY < st.y[st.y.length - 1] - 2) {
      touchCaptured = true;
      if (e.cancelable) e.preventDefault();
    }
    const dy = touchY - e.touches[0].clientY;
    if (Math.abs(dy) < 6 || Math.abs(dy) < Math.abs(touchX - e.touches[0].clientX)) return;
    const pos = ownership !== 'document' && expectedY !== null ? expectedY : window.scrollY;
    touchCaptured ||= !!st && captures(st, pos, Math.sign(dy), dy);
    if (touchCaptured && e.cancelable) e.preventDefault();
  };
  const onTouchEnd = (e: TouchEvent) => {
    const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
    const dir = Math.sign(dy) as -1 | 1;
    const st = geometry();
    touchDown = e.touches?.length > 0;
    if (ownership === 'draining') {
      if (!touchDown && !raf) releaseWhenCommitted();
      touchCaptured = false;
      touchEligible = false;
      return;
    }
    if (touchEligible && touchCaptured && !e.defaultPrevented && st &&
        (!touchStartedPlaying || play) && Math.abs(dy) >= 24 &&
        Math.abs(dy) >= Math.abs(touchX - (e.changedTouches[0]?.clientX ?? touchX))) {
      if (!touchStartedPlaying && touchEntryY < st.y[0] - 2 && dir > 0) {
        // The same finger may already have crossed natively and been pinned by onScroll.
        // It still owns only the entry, never the next film.
        if (!play) enterFromAbove(st, touchEntryY);
      } else if (!touchStartedPlaying && touchEntryY > st.y[st.y.length - 1] + 2 && dir < 0) {
        if (!play) {
          scrollTo(st.y[st.y.length - 1]);
          goTo(st.earth);
        }
      } else {
        if (!play && sequenceTarget(st, expectedY ?? window.scrollY, dir) === null) {
          // The outward gesture at a resting endpoint hands back native navigation.
          const y = expectedY ?? window.scrollY;
          releaseLock();
          window.scrollTo({ top: y + dy, behavior: 'instant' as ScrollBehavior });
        } else step(dir);
      }
    }
    touchCaptured = false;
    touchEligible = false;
  };
  const onTouchCancel = () => {
    touchCaptured = false; touchEligible = false; touchDown = false;
    if (ownership === 'draining' && !raf) releaseWhenCommitted();
  };
  // Scrollbar drags, anchors and assistive navigation always override playback; incoming
  // smooth scrolls or trackpad momentum from before entering do not: the film's frames keep the page
  const onScroll = () => {
    const st = geometry();
    const prevY = lastScrollY;
    const curY = window.scrollY;
    lastScrollY = curY;
    if (!st) return;
    const first = st.y[0];
    const last = st.y[st.y.length - 1];

    if (mobile && ownership !== 'document' && expectedY !== null) {
      // Native inertia is never interpreted as navigation while mobile owns the scene,
      // including at Doha and for jumps beyond the runway. However, if native scrolling
      // stays escaped past the runway bounds after scrollTo across sustained events (>= 120ms),
      // release ownership instead of leaving controlledY frozen on Doha.
      if (Math.abs(curY - expectedY) > 2) {
        const outOfBounds = curY < first - 120 || curY > last + 120;
        scrollTo(expectedY);
        const afterY = window.scrollY;
        if (!outOfBounds || Math.abs(afterY - expectedY) <= 2) {
          escapeSince = null;
        } else {
          const now = performance.now();
          if (escapeSince === null) escapeSince = now;
          else if (now - escapeSince >= 120 && Math.abs(afterY - expectedY) > 120) {
            escapeSince = null;
            cancel();
            window.scrollTo({ top: afterY, behavior: 'instant' as ScrollBehavior });
            lastScrollY = window.scrollY;
          }
        }
      } else {
        escapeSince = null;
      }
      return;
    }

    if (play && expectedY !== null) {
      const diff = Math.abs(curY - expectedY);
      if (diff <= 2) return;
      const minAllowed = Math.min(first, play.entryY) - 100;
      const maxAllowed = Math.max(last, play.entryY) + 100;
      // Jumps far outside the section (e.g. anchor navigation) override playback
      if (curY < minAllowed || curY > maxAllowed) {
        cancel();
        return;
      }
      // Inside or near the section, scroll events that diverge from expectedY are residual native
      // momentum from entry or trackpad inertia. Pin back to expectedY so the cinematic timeline
      // is never accelerated or skipped by scroll velocity.
      scrollTo(expectedY);
      return;
    }

    if (wheelLocked && expectedY !== null && !scrollbarDrag) {
      const now = performance.now();
      const quiet = now - lastWheel >= GESTURE_GAP_MS;
      if (!quiet || now < settleUntil || (expectedY > first + 2 && expectedY < last - 2)) {
        if (Math.abs(curY - expectedY) > 2 && curY >= first - 100 && curY <= last + 100) {
          scrollTo(expectedY);
        }
        return;
      }
      if (curY < first - 2 || curY > last + 2) {
        releaseLock();
        return;
      }
      // A resting renderer lock must never outlive its document ownership.
      if (Math.abs(curY - expectedY) > 2) scrollTo(expectedY);
      return;
    }

    // If native scrolling / inertia from outside crosses into the section while idle,
    // immediately hand ownership to the Doha entry film so momentum never coasts through cities.
    if (!play && !wheelLocked && !scrollbarDrag) {
      if (prevY <= first + 2 && curY > first + 2 && curY < last - 2) {
        entryGesture = 0;
        native = null;
        enterFromAbove(st, prevY);
      } else if (prevY >= last - 2 && curY < last - 2 && curY > first + 2) {
        entryGesture = 0;
        native = null;
        scrollTo(last);
        goTo(st.earth);
        if (play) play.entryY = Math.max(play.entryY, prevY);
      }
    }
  };
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.clientX >= document.documentElement.clientWidth) {
      scrollbarDrag = true;
      cancel();
    }
  };
  const onPointerUp = () => {
    scrollbarDrag = false;
  };
  const onReduced = () => { if (reduced.matches) cancel(); };
  const onNavigation = (e: Event) => {
    if (e.type !== 'click' || (e.target instanceof HTMLElement && e.target.closest('a[href]'))) cancel();
  };
  const onVisibility = () => { if (play) play.last = performance.now(); };
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchCancel, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  window.addEventListener('pagehide', onNavigation);
  window.addEventListener('hashchange', onNavigation);
  window.addEventListener('click', onNavigation);
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', onReduced);
  return {
    goTo,
    snapshot,
    refresh() {
      const st = geometry();
      if (!st) { cancel(); return; }
      if (play) scrollTo(timelineY(st, play.time));
      else if (ownership === 'ready') scrollTo(timelineY(st, readyTime));
    },
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
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('pagehide', onNavigation);
      window.removeEventListener('hashchange', onNavigation);
      window.removeEventListener('click', onNavigation);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onReduced);
    }
  };
}
