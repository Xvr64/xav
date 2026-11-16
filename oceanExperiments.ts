/**
 * THE LIVING OCEAN — four behaviours of the water, each on its own switch.
 *
 *   inertia  the water keeps a little of the scroll's momentum when the page stops (waterInertia.ts)
 *   flow     glyphs take the direction of the current they sit in (asciiOcean.ts)
 *   wake     the whales move the water they swim through, and it remembers for a moment (oceanWake.ts)
 *   sea      each section of the CV lies in its own sea state (seaState.ts)
 *
 * `OCEAN_EFFECT_DEFAULTS` is what the site ships. The address bar overrides it, on the live site
 * as well as in development, so the new water can be set beside the old on any device:
 *
 *   (no parameter)          the shipped ocean: every effect in the defaults
 *   ?ocean=original         the ocean as it was before these effects (also `none` or `off`)
 *   ?ocean=all              everything on
 *   ?ocean=inertia,flow     exactly these
 *   ?ocean=-wake            the defaults, without the wake (and `+wake` to add one)
 *
 * Unknown names are ignored, so a typo in a link never breaks the page.
 */
export type OceanEffect = 'inertia' | 'flow' | 'wake' | 'sea';
export type OceanEffects = Record<OceanEffect, boolean>;

export const OCEAN_EFFECTS: readonly OceanEffect[] = ['inertia', 'flow', 'wake', 'sea'];

// Global stroke bands and section-wide texture changes are opt-in comparisons only.
// ?ocean=wake isolates the whale disturbance; ?ocean=-wake keeps only gentle inertia.
export const OCEAN_EFFECT_DEFAULTS: OceanEffects = { inertia: true, flow: false, wake: true, sea: false };

const isEffect = (name: string): name is OceanEffect => (OCEAN_EFFECTS as readonly string[]).includes(name);

export function parseOceanEffects(search: string, defaults: OceanEffects = OCEAN_EFFECT_DEFAULTS): OceanEffects {
  const effects = { ...defaults };
  const value = new URLSearchParams(search).get('ocean');
  if (value === null) return effects;
  const known = (token: string) => ['all', 'none', 'original', 'off'].includes(token.replace(/^[-+]/, '')) || isEffect(token.replace(/^[-+]/, ''));
  const tokens = value.split(',').map((token) => token.trim().toLowerCase()).filter(known);
  if (tokens.length === 0) return effects;
  // A plain list names exactly what is on; signed entries adjust the defaults instead
  const relative = tokens.length > 0 && tokens.every((token) => token.startsWith('-') || token.startsWith('+'));
  if (!relative) for (const effect of OCEAN_EFFECTS) effects[effect] = false;
  for (const token of tokens) {
    if (token === 'all') {
      for (const effect of OCEAN_EFFECTS) effects[effect] = true;
      continue;
    }
    if (token === 'none' || token === 'original' || token === 'off') {
      for (const effect of OCEAN_EFFECTS) effects[effect] = false;
      continue;
    }
    const off = token.startsWith('-');
    const name = token.replace(/^[-+]/, '');
    if (isEffect(name)) effects[name] = !off;
  }
  return effects;
}

export const oceanEffects: OceanEffects = parseOceanEffects(typeof window === 'undefined' ? '' : window.location.search);
