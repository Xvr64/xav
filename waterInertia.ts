/**
 * WATER INERTIA — the ocean has mass; the page does not.
 *
 * The page starts and stops at once; the water cannot. While the page travels the water follows a
 * little way behind it, further behind the faster it goes (up to `limit`), and when the page stops
 * the water carries on the same way, slowing, until it has caught up. It is one movement in one
 * direction: the water never runs past the page and comes back, which would read as elastic, not
 * as mass.
 *
 * How far behind the water wants to be is a plain function of the scroll's speed, and it is taken
 * there by a critically damped spring, so the water has no sudden starts of its own. Nothing in
 * it treats speeding up and slowing down differently (anything that does turns the unevenness of
 * real frames into a steady push), and a steady scroll holds the water at a steady distance, so
 * it never reads as parallax: while the page moves, the water moves exactly as fast.
 *
 * Only the ocean's glyph lattice is offset by this. The document's scroll, the cinematic
 * controllers and every other layer never see it.
 */
export const WATER_INERTIA = {
  /** Seconds of travel the water hangs behind a slow scroll (px behind per px/s). */
  delay: 0.06,
  /** The furthest the water may fall behind (CSS px), approached softly as the scroll gets faster. */
  limit: 84,
  /** Natural frequency of the water's own movement (rad/s): caught up about a second after a stop. */
  omega: 4.4,
  /**
   * Share of the water's travel speed it keeps at the instant the page changes speed, as a share
   * of the most the spring could take without running past (below 1: it never overshoots).
   */
  carry: 0.55,
  /** Smoothing of the measured scroll speed (s): wheel notches and uneven frames arrive as steps. */
  smoothing: 0.085,
  /** Below this (px, and px/s over omega) the water is at rest and stops asking for frames. */
  rest: 0.03
} as const;

export interface WaterInertia {
  /** Where the water is relative to the page (px; negative is behind a page travelling down). */
  offset: number;
  /** Its speed relative to the page (px/s). */
  speed: number;
  /** The smoothed scroll speed it last saw (px/s). */
  scrollSpeed: number;
  /** The last scroll position, or null before the first frame. */
  scroll: number | null;
}

export const newWaterInertia = (): WaterInertia => ({ offset: 0, speed: 0, scrollSpeed: 0, scroll: null });

export const resetWaterInertia = (state: WaterInertia, scroll: number | null = null) => {
  state.offset = 0;
  state.speed = 0;
  state.scrollSpeed = 0;
  state.scroll = scroll;
};

/** True while the water has not come back to rest (the ocean must keep drawing). */
export const waterSettling = (state: WaterInertia) => state.offset !== 0 || state.speed !== 0;

/** How far behind the page the water wants to be at a scroll speed (px, signed like the speed). */
export const waterLag = (scrollSpeed: number) => WATER_INERTIA.limit * Math.tanh((WATER_INERTIA.delay * scrollSpeed) / WATER_INERTIA.limit);

/**
 * Advance by one frame: `scroll` is the document's position now, `dt` the seconds since the last
 * call, `viewport` the screen height (a jump of more than half of it is a link, not a scroll).
 * Returns the offset to draw with (CSS px).
 */
export function stepWaterInertia(state: WaterInertia, scroll: number, dt: number, viewport: number): number {
  if (state.scroll === null || !(dt > 0) || !Number.isFinite(scroll)) {
    state.scroll = Number.isFinite(scroll) ? scroll : state.scroll;
    return state.offset;
  }
  const travelled = scroll - state.scroll;
  state.scroll = scroll;
  if (Math.abs(travelled) > viewport * 0.5) {
    resetWaterInertia(state, scroll);
    return 0;
  }
  const before = waterLag(state.scrollSpeed);
  state.scrollSpeed += (travelled / dt - state.scrollSpeed) * (1 - Math.exp(-dt / WATER_INERTIA.smoothing));
  const lag = waterLag(state.scrollSpeed);
  const w = WATER_INERTIA.omega;
  // A page that changes speed leaves the water travelling: it keeps part of that speed at once
  state.speed += WATER_INERTIA.carry * w * (before - lag);

  // Critically damped spring toward the place the water wants, integrated exactly: stable at
  // any frame length
  const decay = Math.exp(-w * dt);
  const away = state.offset + lag;
  const k = state.speed + w * away;
  state.offset = (away + k * dt) * decay - lag;
  state.speed = (state.speed - w * k * dt) * decay;

  if (Math.abs(state.offset) < WATER_INERTIA.rest && Math.abs(state.speed) < WATER_INERTIA.rest * w && Math.abs(state.scrollSpeed) < 1) {
    state.offset = 0;
    state.speed = 0;
    state.scrollSpeed = 0;
  }
  return state.offset;
}
