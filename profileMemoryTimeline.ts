/** Shared between the magnetic timeline, the plate renderer, and the ambient whale render loop. */
export const memoryWater = {
  consumed: 0,         // 0..8: completed city units plus fraction released in the active Wave 1 city
  city: 0,             // 0..7: currently receiving destination during Wave 1
  phase: 0,            // 0..1: normalized phase within the active Wave 1 city
  running: false,      // true during forward reveal or reverse restoration
  transferring: false, // true strictly during Wave 1 while whale glyphs are detaching/flying
  framed: false,       // true while Profile is the active section
  reversing: false,    // true during reverse restoration (photographs -> whales)
  target: { x: 0, y: 0, width: 1, height: 1 },
  // Ordered normalized landing sites (RGBA8: R=x, G=y), populated by the plate renderer.
  landings: null as Uint8Array<ArrayBuffer> | null,
  refresh: null as (() => void) | null
};

export const CITY_COUNT = 8;

/** Within each Wave 1 city slot (0..1), 100% of the beat is whale detachment -> flight -> ASCII build. */
export const RELEASE_SPAN = 0.42;
export const FLIGHT_SPAN = 0.52;
export const LAND_END = RELEASE_SPAN + FLIGHT_SPAN; // 0.94
/** Gentle ease-in exponent for Doha (city 0) so the very first clusters loosen gracefully before surging. */
export const DOHA_RELEASE_EXP = 0.86;

/**
 * Two-wave cinematic choreography (~5.82 seconds total):
 *   Wave 1 (2.96s): Whale glyphs detach and assemble all eight city photographs in ASCII, Doha -> Shanghai.
 *   Hold   (0.34s): Brief deliberate beat perceiving all eight completed ASCII images together.
 *   Wave 2 (2.52s): All eight ASCII images transform sequentially into their real photographs, Doha -> Shanghai.
 */
export const WAVE1_DURATIONS = [450, 350, 345, 345, 345, 345, 350, 430] as const;
export const WAVE1_DURATION = WAVE1_DURATIONS.reduce((sum, d) => sum + d, 0); // 2960 ms
export const ASCII_HOLD_DURATION = 340;                                      //  340 ms
export const WAVE2_DURATIONS = [340, 300, 300, 300, 300, 300, 305, 375] as const;
export const WAVE2_DURATION = WAVE2_DURATIONS.reduce((sum, d) => sum + d, 0); // 2520 ms

export const MEMORY_DURATION = WAVE1_DURATION + ASCII_HOLD_DURATION + WAVE2_DURATION; // 5820 ms
export const MEMORY_RETURN_DURATION = 2900;

/** Narrow screens only: on wide screens the photographs are already read at full size. */
export const MEMORY_INSPECT_QUERY = '(max-width: 850px)';

/** A photograph can be opened for inspection once every plate has resolved, on narrow screens. */
export function canInspectMemory(plates: string | undefined, narrow: boolean): boolean {
  return narrow && plates === 'revealed';
}

export type MemoryInspectEvent =
  | { readonly type: 'open'; readonly id: string; readonly plates: string | undefined; readonly narrow: boolean }
  | { readonly type: 'close' };

/**
 * The open photograph (a city id) or null. Opening is refused until the reveal has finished
 * and on wide screens; any close (a tap, Escape, the screen widening) clears it.
 */
export function nextMemoryInspection(current: string | null, event: MemoryInspectEvent): string | null {
  if (event.type === 'close') return null;
  return canInspectMemory(event.plates, event.narrow) ? event.id : current;
}

export type MemoryWave = 'wave1' | 'hold' | 'wave2';

export interface MemorySlotSample {
  readonly assembled: number;
  readonly color: number;
}

export interface MemorySample {
  readonly wave: MemoryWave;
  /** Active city index (0..7 during wave1/wave2; -1 during the collective ASCII hold). */
  readonly city: number;
  /** Normalized phase (0..1) inside the active city's Wave 1 or Wave 2 slice, or inside the Hold. */
  readonly phase: number;
  /** 0..8 whale glyph consumption progress (reaches 8 by end of Wave 1 and stays 8 through Hold & Wave 2). */
  readonly consumed: number;
  /** True only while whale glyphs are actively detaching/flying (Wave 1). */
  readonly transferring: boolean;
  /** Exact (assembled, color) state for all eight city slots at this timestamp. */
  readonly slots: readonly MemorySlotSample[];
}

const unit = (n: number) => (n <= 0 ? 0 : n >= 1 ? 1 : n);

function locateSegment(ms: number, durations: readonly number[]) {
  let city = 0;
  let remaining = ms;
  while (city < durations.length - 1 && remaining >= durations[city]) {
    remaining -= durations[city++];
  }
  return { city, phase: unit(remaining / durations[city]) };
}

/**
 * Pure, invertible two-wave choreography sampler shared by forward reveal (0 -> 1)
 * and reverse restoration (1 -> 0).
 */
export function sampleMemory(time: number): MemorySample {
  const t = unit(time);
  const ms = t * MEMORY_DURATION;

  // ---- WAVE 1: All eight photographs assemble in ASCII (no real photo reveals yet) ----
  if (ms < WAVE1_DURATION) {
    const { city, phase } = locateSegment(ms, WAVE1_DURATIONS);
    const releaseRaw = unit(phase / RELEASE_SPAN);
    const releaseFrac = city === 0 ? Math.pow(releaseRaw, 1 / DOHA_RELEASE_EXP) : releaseRaw;
    const arriveStart = FLIGHT_SPAN - 0.04;
    const arriveRaw = unit((phase - arriveStart) / (LAND_END - arriveStart));
    const assembled = city === 0 ? Math.pow(arriveRaw, 1 / DOHA_RELEASE_EXP) : arriveRaw;

    const slots: MemorySlotSample[] = new Array(CITY_COUNT);
    for (let i = 0; i < CITY_COUNT; i++) {
      slots[i] =
        i < city
          ? { assembled: 1, color: 0 }
          : i === city
            ? { assembled, color: 0 }
            : { assembled: 0, color: 0 };
    }

    return {
      wave: 'wave1',
      city,
      phase,
      consumed: city + releaseFrac,
      transferring: phase < LAND_END + 0.04,
      slots
    };
  }

  // ---- SHORT COLLECTIVE HOLD: All eight photographs stand together in crisp ASCII ----
  const holdEnd = WAVE1_DURATION + ASCII_HOLD_DURATION;
  if (ms < holdEnd) {
    const holdPhase = unit((ms - WAVE1_DURATION) / ASCII_HOLD_DURATION);
    const slots: MemorySlotSample[] = Array.from({ length: CITY_COUNT }, () => ({
      assembled: 1,
      color: 0
    }));
    return {
      wave: 'hold',
      city: -1,
      phase: holdPhase,
      consumed: CITY_COUNT,
      transferring: false,
      slots
    };
  }

  // ---- WAVE 2: All eight ASCII photographs transform top-to-bottom into real photographs ----
  const { city, phase } = locateSegment(ms - holdEnd, WAVE2_DURATIONS);
  const slots: MemorySlotSample[] = new Array(CITY_COUNT);
  for (let i = 0; i < CITY_COUNT; i++) {
    slots[i] =
      i < city
        ? { assembled: 1, color: 1 }
        : i === city
          ? { assembled: 1, color: phase }
          : { assembled: 1, color: 0 };
  }

  return {
    wave: 'wave2',
    city,
    phase,
    consumed: CITY_COUNT,
    transferring: false,
    slots
  };
}
