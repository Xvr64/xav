import { INTRO_STORAGE_KEY, JOURNEY_STORAGE_KEY, creation, setCreationJourney, type JourneyId } from './creationTimeline.ts';

/**
 * THE ARRIVAL — three ways into the same story.
 *
 * The arrival sits in front of the opening. Every journey enters through enterJourney, which
 * hands the opening its route (creationTimeline's JOURNEY_ROUTES) and steps aside; the opening
 * then waits at that route's first frame for its own "scroll once" gesture:
 *   direct   EARTH -> OCEAN -> CV HERO
 *   passage  EYE -> STAR TUNNEL -> EARTH -> OCEAN -> CV HERO (recommended)
 *   odyssey  the complete Eye of Creation opening, unchanged
 * One clock, one renderer, one hero: the journeys differ only in the scenes they pass through.
 */
export type { JourneyId };
export { JOURNEY_STORAGE_KEY };

export interface Journey {
  id: JourneyId;
  index: string;
  title: string;
  line: string;
  recommended?: boolean;
}

export const JOURNEYS: readonly Journey[] = [
  { id: 'direct', index: '01', title: 'Direct', line: 'Straight to the story.' },
  { id: 'passage', index: '02', title: 'The Passage', line: 'A journey through space and sea.', recommended: true },
  { id: 'odyssey', index: '03', title: 'The Odyssey', line: 'The complete cinematic experience.' }
];

export const RECOMMENDED_JOURNEY: JourneyId = 'passage';

/**
 * Offered on a fresh arrival at the top of the page: the same conditions as the opening
 * (creationTimeline's shouldPlayCreation), except that reduced motion still gets the choice;
 * the page underneath then simply has no opening, as before. index.html mirrors this pre-paint.
 */
export function shouldOfferJourneys(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(location.search);
  const dev = !!(import.meta as any).env?.DEV;
  if (dev && params.has('journeys')) return true;
  // The opening's own QA tooling seeks its timeline directly
  if (dev && params.has('creationqa')) return false;
  if (location.hash || scrollY > 20) return false;
  if (performance.getEntriesByType('navigation').some(e => (e as PerformanceNavigationTiming).type === 'back_forward')) return false;
  try { return sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1'; } catch { return true; }
}

export const arrival = {
  open: shouldOfferJourneys(),
  selected: null as JourneyId | null,
  listeners: new Set<() => void>(),
  /** The arrival's own keyboard navigation, fed by the gate (see installArrivalGate). */
  onKey: null as ((key: string) => void) | null
};
// While the arrival is open the renderer compiles the likeliest journey's programs first
creation.choosing = arrival.open;

/**
 * Keys the opening's controller would read (forward/back, Home/End, Escape to skip) are kept
 * from it while the visitor chooses. Enter and Space on a journey stay the journey's own.
 */
const GATED_KEYS = new Set(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', 'Home', 'End', 'Escape', ' ']);
export function isGatedKey(key: string, onButton: boolean): boolean {
  if (onButton && (key === ' ' || key === 'Enter')) return false;
  return GATED_KEYS.has(key);
}

let releaseGate: (() => void) | null = null;

/**
 * Called once, before React renders: listeners on the same target and phase run in the order
 * they were added, so these capture listeners on window run ahead of every controller the site
 * mounts and stop wheel, touch and navigation keys from reaching them. The opening's gesture
 * state is never fed, so it stays at its first frame. Nothing is prevented here except the
 * gated keys' defaults, so the arrival itself can still scroll natively on a short screen.
 * Removed the moment a journey is chosen; nothing of it outlives the arrival.
 */
export function installArrivalGate() {
  if (!arrival.open || releaseGate || typeof window === 'undefined') return;
  const swallow = (event: Event) => { if (arrival.open) event.stopImmediatePropagation(); };
  const onKey = (event: KeyboardEvent) => {
    if (!arrival.open || !isGatedKey(event.key, event.target instanceof HTMLButtonElement)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    arrival.onKey?.(event.key);
  };
  const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'] as const;
  window.addEventListener('wheel', swallow, { capture: true, passive: true });
  touch.forEach(type => window.addEventListener(type, swallow, { capture: true, passive: true }));
  window.addEventListener('keydown', onKey, true);
  releaseGate = () => {
    window.removeEventListener('wheel', swallow, true);
    touch.forEach(type => window.removeEventListener(type, swallow, true));
    window.removeEventListener('keydown', onKey, true);
    releaseGate = null;
  };
}

/** The one way in, whichever journey was chosen. */
export function enterJourney(id: JourneyId) {
  if (!arrival.open) return;
  arrival.selected = id;
  // The opening takes the journey's route (and records it, so Skip intro can reverse back into it)
  setCreationJourney(id);
  launchJourney();
}

/**
 * The arrival stops holding input and steps aside; the opening, already set on the chosen route,
 * waits on its first frame, and every scroll controller carries on untouched.
 */
function launchJourney() {
  arrival.open = false;
  releaseGate?.();
  arrival.listeners.forEach(fn => fn());
}
