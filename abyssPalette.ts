import { setLanternDepth } from './lanternCursor';

// ============================================================================
// ABYSS PALETTE — one shared table for the scroll-driven descent (Stage 5)
// ============================================================================
// Every original dark text colour / hairline / paper panel gets its own CSS variable whose
// light value reads on the sky-blue surface water (the near-black inks are the originals; the
// muted greys take deep navy-slate tints, since grey loses its contrast on blue) and whose
// dark value reads on night water. The whale canvas interpolates them from the same page progress that
// drives the dark water after the Globe section — no independent CSS transitions.
export type AbyssRGB = [number, number, number];
export const ABYSS_TEXT: { hex: string; light: AbyssRGB; dark: AbyssRGB }[] = [
  { hex: '171717', light: [23, 23, 23], dark: [244, 248, 252] },
  { hex: '162633', light: [22, 38, 51], dark: [226, 236, 248] },
  { hex: '1F2428', light: [31, 36, 40], dark: [228, 236, 246] },
  { hex: '2B353B', light: [28, 42, 58], dark: [216, 228, 242] },
  { hex: '1F3B57', light: [31, 59, 87], dark: [196, 220, 244] },
  // The sea accent (roles, asides, italics): a pale sky blue on night water
  { hex: '2F4858', light: [36, 66, 98], dark: [188, 216, 244] },
  { hex: '3E4C52', light: [34, 56, 80], dark: [200, 214, 234] },
  { hex: '3E5666', light: [36, 62, 90], dark: [196, 214, 236] },
  { hex: '49606E', light: [40, 68, 96], dark: [192, 210, 232] },
  { hex: '52595E', light: [38, 62, 88], dark: [196, 210, 230] },
  { hex: '77766F', light: [58, 84, 112], dark: [180, 198, 224] }
];
export const ABYSS_TEXT_ALPHA_VARIANTS = [
  'text-[#171717]/85',
  'text-[#171717]/90',
  'text-[#52595E]/40',
  'text-[#52595E]/50',
  'text-[#52595E]/70',
  'text-[#52595E]/80',
  'text-[#52595E]/90'
];
export const ABYSS_RULE_ALPHAS = [10, 12, 15, 20];
export const ABYSS_FILLS: { token: string; name: string; light: number[]; dark: number[] }[] = [
  { token: 'bg-[#F5F3EE]', name: 'p1', light: [255, 255, 255, 0.28], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#F5F3EE]/90', name: 'p2', light: [255, 255, 255, 0.26], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#EFECE6]', name: 'p3', light: [255, 255, 255, 0.22], dark: [255, 255, 255, 0.05] },
  { token: 'bg-[#EFECE6]/50', name: 'p4', light: [255, 255, 255, 0.18], dark: [255, 255, 255, 0.04] },
  { token: 'bg-[#EFECE6]/90', name: 'p5', light: [255, 255, 255, 0.26], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#EFECE6]/95', name: 'p6', light: [255, 255, 255, 0.28], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#E4EAEB]', name: 'p7', light: [255, 255, 255, 0.34], dark: [255, 255, 255, 0.1] },
  { token: 'bg-[#1F3B57]/15', name: 'a1', light: [31, 59, 87, 0.15], dark: [196, 220, 244, 0.2] },
  { token: 'bg-[#1F3B57]/45', name: 'a2', light: [31, 59, 87, 0.45], dark: [196, 220, 244, 0.55] },
  { token: 'bg-[#1F3B57]/60', name: 'a3', light: [31, 59, 87, 0.6], dark: [210, 228, 246, 0.75] },
  { token: 'bg-[#162633]', name: 'a4', light: [22, 38, 51, 1], dark: [226, 236, 248, 1] }
];
export const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

// Geometry is owned by JourneyGlobe's existing resize/scroll sequence.
export const globeScrollGeometry = { start: Infinity, travel: 1 };
export const globeScrollProgress = () => Math.max(0, Math.min(1,
  (window.scrollY - globeScrollGeometry.start) / globeScrollGeometry.travel));
/** Progressive descent across the complete pinned city sequence. */
export const abyssFromProgress = (progress: number) => {
  const t = Math.max(0, Math.min(1, progress));
  return t ** 1.5;
};
/** Switch ink near the neutral background's equal-contrast midpoint. */
export const inkMixFromAbyss = (abyss: number) => {
  const t = Math.max(0, Math.min(1, (abyss - 0.53) / 0.02));
  return t * t * (3 - 2 * t);
};

export function applyAbyssPalette(t: number) {
  const root = document.documentElement.style;
  // How far the page's ink has turned light (0 on white water, 1 on black): read by CSS to set
  // light type a little thinner and more open on dark water, where it reads heavier
  root.setProperty('--ink-light', t.toFixed(3));
  for (const c of ABYSS_TEXT) {
    root.setProperty(
      `--ink-${c.hex}`,
      `rgb(${Math.round(lerpN(c.light[0], c.dark[0], t))}, ${Math.round(lerpN(c.light[1], c.dark[1], t))}, ${Math.round(lerpN(c.light[2], c.dark[2], t))})`
    );
  }
  for (const a of ABYSS_RULE_ALPHAS) {
    const al = a / 100;
    root.setProperty(
      `--rule-${a}`,
      `rgba(${Math.round(lerpN(23, 214, t))}, ${Math.round(lerpN(23, 226, t))}, ${Math.round(lerpN(23, 242, t))}, ${lerpN(al, al * 1.1, t).toFixed(3)})`
    );
  }
  for (const f of ABYSS_FILLS) {
    root.setProperty(
      `--fill-${f.name}`,
      `rgba(${Math.round(lerpN(f.light[0], f.dark[0], t))}, ${Math.round(lerpN(f.light[1], f.dark[1], t))}, ${Math.round(lerpN(f.light[2], f.dark[2], t))}, ${lerpN(f.light[3], f.dark[3], t).toFixed(3)})`
    );
  }
  root.setProperty('--glass-bg', `rgba(255, 255, 255, ${lerpN(0.28, 0.06, t).toFixed(3)})`);
  root.setProperty('--glass-chip-bg', `rgba(255, 255, 255, ${lerpN(0.2, 0.04, t).toFixed(3)})`);
  root.setProperty(
    '--glass-border',
    `rgba(${Math.round(lerpN(0, 255, t))}, ${Math.round(lerpN(0, 255, t))}, ${Math.round(lerpN(0, 255, t))}, ${lerpN(0.1, 0.18, t).toFixed(3)})`
  );
}

/**
 * The water's own colour (--ocean-background, and the --abyss-wash / --abyss-halo that text
 * washes, halos and caption veils take from it) now comes from the ASCII ocean's palette,
 * which follows the scroll through the whole document: see applyWaterColor in oceanWorld.ts.
 * The abyss level still sets the cursor.
 */
export function applyAbyssWash(abyssLevel: number) {
  // The cursor descends with the water: quiet slate at the surface, a lantern in the deep
  setLanternDepth(abyssLevel);
}

export function buildAbyssCss(): string {
  const scope = '.ocean-legible';
  const rules: string[] = [];
  const both = (token: string) => `${scope}[class~="${token}"], ${scope} [class~="${token}"]`;
  rules.push(`:root {
    ${ABYSS_TEXT.map((c) => `--ink-${c.hex}: rgb(${c.light.join(', ')});`).join('\n    ')}
    ${ABYSS_RULE_ALPHAS.map((a) => `--rule-${a}: rgba(23, 23, 23, ${a / 100});`).join('\n    ')}
    ${ABYSS_FILLS.map((f) => `--fill-${f.name}: rgba(${f.light.join(', ')});`).join('\n    ')}
    --ocean-background: #99D6F1;
    --abyss-halo: rgba(153, 214, 241, 0.85);
    --abyss-wash: 153, 214, 241;
    --abyss-wash-low: 153, 214, 241;
    --glass-bg: rgba(255, 255, 255, 0.28);
    --glass-chip-bg: rgba(255, 255, 255, 0.20);
    --glass-border: rgba(0, 0, 0, 0.10);
  }`);
  rules.push(`html, body { background-color: var(--ocean-background); overflow-x: hidden; }`);
  rules.push(`.glass-panel { background-color: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }`);
  rules.push(`.glass-chip { background-color: var(--glass-chip-bg); border: 1px solid var(--glass-border); }`);
  rules.push(`.glass-rule { border-color: var(--glass-border) !important; }`);
  rules.push(`${scope} { color: var(--ink-171717); }`);
  for (const c of ABYSS_TEXT) rules.push(`${both(`text-[#${c.hex}]`)} { color: var(--ink-${c.hex}) !important; }`);
  for (const token of ABYSS_TEXT_ALPHA_VARIANTS) {
    const hex = token.slice(7, 13);
    const pct = token.split('/')[1];
    rules.push(`${both(token)} { color: color-mix(in srgb, var(--ink-${hex}) ${pct}%, transparent) !important; }`);
  }
  for (const a of ABYSS_RULE_ALPHAS) rules.push(`${both(`border-[#171717]/${a}`)} { border-color: var(--rule-${a}) !important; }`);
  for (const f of ABYSS_FILLS) rules.push(`${both(f.token)} { background-color: var(--fill-${f.name}) !important; }`);
  // Sage buttons keep their dark label on every water depth
  rules.push(
    `${both('bg-[#B6C5B0]')}, ${scope} [class~="bg-[#B6C5B0]"] * { color: rgb(23, 23, 23) !important; text-shadow: none; }`
  );
  return rules.join('\n');
}
