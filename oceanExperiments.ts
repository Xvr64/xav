/**
 * THE LIVING OCEAN — four behaviours of the water, each on its own switch.
 *
 *   inertia  the water keeps a little of the scroll's momentum when the page stops (waterInertia.ts)
 *   flow     glyphs take the direction of the current they sit in (asciiOcean.ts)
 *   wake     the whales move the water they swim through, and it remembers for a moment (oceanWake.ts)
 *   sea      each section of the CV lies in its own sea state (seaState.ts)
 *
 * `OCEAN_EFFECT_DEFAULTS` is what the site ships: an effect goes to `true` there only once it has
 * been looked at and measured. In development the address bar overrides it, so each one can be
 * judged alone or switched off without touching the build:
 *
 *   ?ocean=all              everything on
 *   ?ocean=none             the ocean as it was
 *   ?ocean=inertia,flow     exactly these
 *   ?ocean=-wake            the defaults, without the wake (and `+wake` to add one)
 *
 * The production build never reads the address bar.
 */
export type OceanEffect = 'inertia' | 'flow' | 'wake' | 'sea';
export type OceanEffects = Record<OceanEffect, boolean>;

export const OCEAN_EFFECTS: readonly OceanEffect[] = ['inertia', 'flow', 'wake', 'sea'];

export const OCEAN_EFFECT_DEFAULTS: OceanEffects = { inertia: false, flow: false, wake: false, sea: false };

const isEffect = (name: string): name is OceanEffect => (OCEAN_EFFECTS as readonly string[]).includes(name);

export function parseOceanEffects(search: string, development: boolean, defaults: OceanEffects = OCEAN_EFFECT_DEFAULTS): OceanEffects {
  const effects = { ...defaults };
  if (!development) return effects;
  const value = new URLSearchParams(search).get('ocean');
  if (value === null) return effects;
  const tokens = value.split(',').map((token) => token.trim().toLowerCase()).filter(Boolean);
  // A plain list names exactly what is on; signed entries adjust the defaults instead
  const relative = tokens.length > 0 && tokens.every((token) => token.startsWith('-') || token.startsWith('+'));
  if (!relative) for (const effect of OCEAN_EFFECTS) effects[effect] = false;
  for (const token of tokens) {
    if (token === 'all' || token === 'none') {
      for (const effect of OCEAN_EFFECTS) effects[effect] = token === 'all';
      continue;
    }
    const off = token.startsWith('-');
    const name = token.replace(/^[-+]/, '');
    if (isEffect(name)) effects[name] = !off;
  }
  return effects;
}

export const oceanEffects: OceanEffects = (import.meta as { env?: { DEV?: boolean } }).env?.DEV
  ? parseOceanEffects(typeof window === 'undefined' ? '' : window.location.search, true)
  : { ...OCEAN_EFFECT_DEFAULTS };
