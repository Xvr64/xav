/**
 * WATER INERTIA — the ocean has mass; the page does not.
 *
 * The water is drawn in the page's frame, and a page that speeds up or stops is an accelerating
 * frame: the water feels that as a push the other way. So it is modelled as a mass on a
 * critically damped spring, tied to the page and kicked by every change in the scroll's speed.
 * While the page moves steadily the water moves with it exactly (no lag, so it never reads as
 * parallax). When the page stops, the water carries on a few pixels and eases back.
 *
 * The spring itself treats speeding up and slowing down alike: anything else would turn the
 * unevenness of real frames into a steady push. What differs is how much of it is shown: all of
 * the water running on after a stop, only a little of it hanging back at a start, where it would
 * read as the page being late.
 *
 * Only the ocean's glyph lattice is offset by this. The document's scroll, the cinematic
 * controllers and every other layer never see it.
 */
export const WATER_INERTIA = {
  /** Share of a change in scroll speed that the water keeps (px/s per px/s). */
  share: 0.14,
  /** How much of the water hanging back against the travel is shown (it runs on in full). */
  lag: 0.3,
  /** Natural frequency of the return (rad/s): settled in about two thirds of a second. */
  omega: 7.5,
  /** The furthest the water may run on (CSS px), approached softly. */
  limit: 16,
  /** Smoothing of the measured scroll speed (s): wheel notches and uneven frames arrive as steps. */
  smoothing: 0.085,
  /** A scroll slower than this (px/s) does not say which way the page is travelling. */
  heading: 24,
  /** Below this (px, and px/s over omega) the water is at rest and stops asking for frames. */
  rest: 0.03
} as const;

export interface WaterInertia {
  /** How far the water is ahead of the page (px, + is further down the document). */
  offset: number;
  /** Its speed relative to the page (px/s). */
  speed: number;
  /** The smoothed scroll speed it last saw (px/s). */
  scrollSpeed: number;
  /** The way the page last travelled: +1 down, -1 up, 0 before it has moved. */
  heading: number;
  /** The last scroll position, or null before the first frame. */
  scroll: number | null;
}

export const newWaterInertia = (): WaterInertia => ({ offset: 0, speed: 0, scrollSpeed: 0, heading: 0, scroll: null });

export const resetWaterInertia = (state: WaterInertia, scroll: number | null = null) => {
  state.offset = 0;
  state.speed = 0;
  state.scrollSpeed = 0;
  state.heading = 0;
  state.scroll = scroll;
};

/** True while the water has not come back to rest (the ocean must keep drawing). */
export const waterSettling = (state: WaterInertia) => state.offset !== 0 || state.speed !== 0;

/** The offset the ocean draws with: the spring's, within the limit, and mostly withheld while it lags. */
export const waterOffset = (state: WaterInertia) => {
  const shown = WATER_INERTIA.limit * Math.tanh(state.offset / WATER_INERTIA.limit);
  return shown * state.heading < 0 ? shown * WATER_INERTIA.lag : shown;
};

/**
 * Advance by one frame: `scroll` is the document's position now, `dt` the seconds since the last
 * call, `viewport` the screen height (a jump of more than half of it is a link, not a scroll).
 * Returns the offset to draw with (CSS px).
 */
export function stepWaterInertia(state: WaterInertia, scroll: number, dt: number, viewport: number): number {
  if (state.scroll === null || !(dt > 0) || !Number.isFinite(scroll)) {
    state.scroll = Number.isFinite(scroll) ? scroll : state.scroll;
    return waterOffset(state);
  }
  const travelled = scroll - state.scroll;
  state.scroll = scroll;
  if (Math.abs(travelled) > viewport * 0.5) {
    resetWaterInertia(state, scroll);
    return 0;
  }
  const before = state.scrollSpeed;
  state.scrollSpeed += (travelled / dt - before) * (1 - Math.exp(-dt / WATER_INERTIA.smoothing));
  if (Math.abs(state.scrollSpeed) > WATER_INERTIA.heading) state.heading = Math.sign(state.scrollSpeed);
  // The frame's acceleration pushes the water the other way: slowing down throws it forward
  state.speed -= WATER_INERTIA.share * (state.scrollSpeed - before);

  // Critically damped spring, integrated exactly: stable at any frame length
  const w = WATER_INERTIA.omega;
  const decay = Math.exp(-w * dt);
  const k = state.speed + w * state.offset;
  state.offset = (state.offset + k * dt) * decay;
  state.speed = (state.speed - w * k * dt) * decay;

  if (Math.abs(state.offset) < WATER_INERTIA.rest && Math.abs(state.speed) < WATER_INERTIA.rest * w && Math.abs(state.scrollSpeed) < 1) {
    state.offset = 0;
    state.speed = 0;
    state.scrollSpeed = 0;
  }
  return waterOffset(state);
}
