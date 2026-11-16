/**
 * WAKE MEMORY — what the whales do to the water, in numbers (asciiOcean.ts draws it).
 *
 * Each whale is read as four round bodies along its spine (rostrum, the girth behind the
 * flippers, the tail stock, the flukes), taken from the spine the whale layer already publishes
 * (oceanDirection.ts). A body moving through still water sets up the flow of a doublet: the water
 * inside it travels with it, the water ahead is pushed on, the water at its sides slips back
 * around it. The ocean relaxes a small field toward that flow where the whale is and lets it
 * fade where the whale has been, so the water remembers a passage for a few seconds.
 *
 * Direction and strength come from each projected point's measured velocity. Scroll alone
 * never emits a wake. The renderer stores the disturbance on the document's water lattice,
 * reprojecting the memory when that lattice scrolls. Nothing here changes how the whales swim.
 */
export const WAKE = {
  /** Spine nodes read (0 is the snout, 47 the notch of the flukes). */
  nodes: [6, 17, 29, 42],
  /** The whale's greatest girth radius as a share of its length on screen (a stout humpback). */
  girthOfLength: 0.115,
  /** Each body's radius as a share of that. */
  girth: [0.72, 1, 0.68, 0.5],
  /**
   * How much each body stirs the water it passes through. What is stirred stays where it was
   * left and fades there, so this is the trail: the flukes lay most of it, the tail stock some,
   * and the body itself little (the animal covers that water for a long while after).
   */
  churn: [0, 0, 0.5, 1],
  /**
   * What the bodies that part the water shed instead: a crescent pressed ahead of the head, and
   * a thin band slipping back along each flank of the head and the girth, just outside the
   * animal's outline (`shedAt` radii out, this sharply drawn). The water there runs astern, so
   * the bands stream back along the body and into the flukes' wash.
   */
  bow: [0.2, 0, 0, 0],
  flank: [0.16, 0.18, 0, 0],
  shedAt: 1.22,
  shedFall: 7,
  /** How far the shader's flow outside a body is drawn from the doublet toward its heading (lower: the flanks slip back faster). */
  slip: 0.2,
  /** How fast the stir falls off around a body (per radius squared): it reaches about a radius beyond it. */
  stirFall: 1.4,
  /**
   * How far each body's stir reaches, in its own radii. The flukes are far wider than the tail
   * stock that carries them, and their trail is the part of a wake the animal never covers.
   */
  stirReach: [1, 1, 1, 1.15],
  /**
   * Speed through the water (whale lengths per second) at which a body moves it about two thirds
   * as fast as it can. A cruising humpback covers a twentieth of its length a second and its
   * flukes beat three times as fast: measured against a brisker animal, as it first was, the
   * wake never rose above a third of its strength and could not be seen.
   */
  speed: 0.05,
  /**
   * Outside a body, how far the water's flow is drawn from the pure doublet toward the body's own
   * heading: the doublet turns a quarter circle off the bow and the quarter, which reads as
   * chevrons in glyphs; this keeps a flare.
   */
  along: 0.55,
  /**
   * Which bodies drive the animal: the tail stock and the flukes. They do not push the water on
   * as the head and the girth do; they throw it astern. A whale on this page mostly holds its
   * place on screen while it swims (the reader travels with it), so water left where it has been
   * would never trail far: what is seen behind a swimming whale is the water its flukes send
   * back, beat after beat.
   */
  wash: [false, false, true, true],
  /** How far astern a driving body's wash runs before it slackens (radii), and how it widens on the way (radii per radius). */
  washLength: 6,
  washFlare: 0.2,
  /** Beyond this many radii a body no longer moves the water. */
  reach: 3.6,
  /** A body that travels further than this share of the screen in one step has been moved, not swum. */
  jump: 0.3
} as const;

export const WAKE_BODIES = 8;

export interface WakeBody {
  /** Centre on screen (CSS px). */
  x: number;
  y: number;
  /** Radius (CSS px). */
  r: number;
  /** Unit direction of travel on screen. */
  ux: number;
  uy: number;
  /** How strongly it moves the water, 0–1. */
  strength: number;
  churn: number;
  /** How far its stir reaches, in radii. */
  spread: number;
  /** It drives the animal: the water it moves is thrown astern (asciiOcean.ts). */
  wash: boolean;
  /** What it sheds ahead of it and along its flanks, 0–1. */
  bow: number;
  flank: number;
}

/** The bodies as they are now. Written by the ocean every wake step, read by the marine snow. */
export const oceanWake: { bodies: WakeBody[]; count: number } = {
  bodies: Array.from({ length: WAKE_BODIES }, () => ({ x: 0, y: 0, r: 1, ux: 1, uy: 0, strength: 0, churn: 0, spread: 1, wash: false, bow: 0, flank: 0 })),
  count: 0
};

// The existing water step wakes the text controller; no independent polling loop.
const wakeListeners = new Set<() => void>();
export function onWhaleWake(listener: () => void): () => void {
  wakeListeners.add(listener);
  return () => { wakeListeners.delete(listener); };
}

export interface WakeTracker {
  /** Each body's last place on screen (CSS px), NaN before it has one. */
  x: Float64Array;
  y: Float64Array;
  /** Where the water's lattice was then (CSS px). */
  water: number;
}
export const newWakeTracker = (): WakeTracker => ({ x: new Float64Array(WAKE_BODIES).fill(NaN), y: new Float64Array(WAKE_BODIES).fill(NaN), water: NaN });

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Read the whales' spines into bodies. `water` is how far the water's lattice has scrolled (CSS
 * px), used to reject anchor jumps. Velocity is measured in CSS px/s, independent of DPR.
 * `spines` hold 48 screen points per whale (x, y pairs), snout first.
 */
export function trackWake(
  tracker: WakeTracker,
  spines: readonly ArrayLike<number>[],
  presence: number,
  water: number,
  dt: number,
  viewport: number,
  out: { bodies: WakeBody[]; count: number } = oceanWake
): void {
  let count = 0;
  const passed = Number.isFinite(tracker.water) ? water - tracker.water : 0;
  // A page that has jumped (a link, a restore) has not carried the whales through the water between
  const jumped = !Number.isFinite(tracker.water) || Math.abs(passed) > viewport * 0.5;
  tracker.water = water;
  for (let whale = 0; whale < spines.length && whale * WAKE.nodes.length < WAKE_BODIES; whale++) {
    const spine = spines[whale];
    // The whale's length as it is drawn now, along its spine
    let length = 0;
    for (let n = 4; n < 48; n += 4) length += Math.hypot(spine[n * 2] - spine[n * 2 - 8], spine[n * 2 + 1] - spine[n * 2 - 7]);
    const girth = Number.isFinite(length) ? length * WAKE.girthOfLength : 0;
    for (let k = 0; k < WAKE.nodes.length; k++) {
      const slot = whale * WAKE.nodes.length + k;
      const n = WAKE.nodes[k];
      const x = spine[n * 2];
      const y = spine[n * 2 + 1];
      // Toward the head: the whale swims snout first
      const ax = spine[(n - 3) * 2] - spine[(n + 3) * 2];
      const ay = spine[(n - 3) * 2 + 1] - spine[(n + 3) * 2 + 1];
      const axis = Math.hypot(ax, ay);
      const r = girth * WAKE.girth[k];
      const px = tracker.x[slot];
      const py = tracker.y[slot];
      const valid = Number.isFinite(x) && Number.isFinite(y) && axis > 1e-3 && r > 1;
      tracker.x[slot] = valid ? x : NaN;
      tracker.y[slot] = valid ? y : NaN;
      if (!valid || jumped || !Number.isFinite(px) || !(dt > 0) || !(presence > 0.05)) continue;
      if (Math.hypot(x - px, y - py) > viewport * WAKE.jump) continue;
      const travelled = Math.hypot(x - px, y - py);
      const strength = (1 - Math.exp(-travelled / dt / (WAKE.speed * length))) * Math.min(1, presence);
      if (strength < 0.02) continue;
      const body = out.bodies[count++];
      body.x = x;
      body.y = y;
      body.r = r;
      body.ux = (x - px) / travelled;
      body.uy = (y - py) / travelled;
      body.strength = strength;
      const stirs = strength;
      body.churn = WAKE.churn[k] * stirs;
      body.spread = WAKE.stirReach[k];
      body.wash = WAKE.wash[k];
      body.bow = WAKE.bow[k] * stirs;
      body.flank = WAKE.flank[k] * stirs;
    }
  }
  const previousCount = out.count;
  out.count = count;
  if (out === oceanWake && (count || previousCount)) wakeListeners.forEach(listener => listener());
}


/**
 * The flow one body sets up at a point `dx, dy` from its centre, as a share of its own speed:
 * with it at its surface, and less and less toward its middle (that water is the animal, and
 * what the ocean draws there would only muddy it); outside, between a doublet (pushed on ahead and astern, slipping back abeam)
 * and the body's own heading, falling with distance (not its square: a body this size moves
 * water a good way off, and what it moves must reach past its own outline to be seen) and
 * fading out by `WAKE.reach` radii. This is the flow the marine snow rides. The ocean's own
 * memory (WAKE_STEP in asciiOcean.ts) starts from the same arithmetic and then lets the flanks
 * slip back faster and the tail throw its water astern.
 */
export function bodyFlow(body: WakeBody, dx: number, dy: number, out: [number, number]): [number, number] {
  const d2 = dx * dx + dy * dy;
  const r2 = d2 / (body.r * body.r);
  const edge = WAKE.reach * WAKE.reach;
  if (r2 >= edge) {
    out[0] = 0;
    out[1] = 0;
    return out;
  }
  if (r2 <= 1) {
    out[0] = body.ux * r2;
    out[1] = body.uy * r2;
    return out;
  }
  const inv = 1 / Math.sqrt(d2);
  const nx = dx * inv;
  const ny = dy * inv;
  const along = body.ux * nx + body.uy * ny;
  const fall = (1 - smoothstep(edge * 0.45, edge, r2)) / Math.sqrt(r2);
  out[0] = ((2 * along * nx - body.ux) * (1 - WAKE.along) + body.ux * WAKE.along) * fall;
  out[1] = ((2 * along * ny - body.uy) * (1 - WAKE.along) + body.uy * WAKE.along) * fall;
  return out;
}

/** The water's movement at a screen point from every body, each weighted by its strength. */
export function wakeFlowAt(x: number, y: number, out: [number, number], wake: { bodies: WakeBody[]; count: number } = oceanWake): [number, number] {
  let vx = 0;
  let vy = 0;
  for (let i = 0; i < wake.count; i++) {
    const body = wake.bodies[i];
    bodyFlow(body, x - body.x, y - body.y, out);
    vx += out[0] * body.strength;
    vy += out[1] * body.strength;
  }
  out[0] = vx;
  out[1] = vy;
  return out;
}

/** Marine snow in a wake: how fast a fleck is carried (CSS px/s at full flow) and how long it takes to drift home (s). */
export const SNOW_CARRY = 46;
export const SNOW_RETURN = 2.4;
/** The furthest a fleck is ever carried from its own path (CSS px). */
export const SNOW_LIMIT = 34;

/** One frame of a fleck's drift: carried by the flow where it is now, easing back to its path. */
export function driftSnow(offset: [number, number], flowX: number, flowY: number, dt: number): [number, number] {
  const keep = Math.exp(-dt / SNOW_RETURN);
  let x = offset[0] * keep + flowX * SNOW_CARRY * dt;
  let y = offset[1] * keep + flowY * SNOW_CARRY * dt;
  const far = Math.hypot(x, y);
  if (far > SNOW_LIMIT) {
    x *= SNOW_LIMIT / far;
    y *= SNOW_LIMIT / far;
  }
  offset[0] = x;
  offset[1] = y;
  return offset;
}
