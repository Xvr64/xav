import { CV_DATA } from './cvData.ts';

export interface ConstellationGlyph { x: number; y: number; glyph: string; light: number; city?: string }
/** A composed constellation, not a geographic map. Chronology comes from the same CV source.
 * Cached on resize; the arrival's existing lattice, quiet mask, fade and scheduler own drawing.
 */
export function buildCityConstellation(w: number, h: number): ConstellationGlyph[] {
  const positions = [[0, 0.62], [0.18, 0.2], [0.36, 0.72], [0.49, 0], [0.65, 0.51], [0.78, 0.29], [1, 0.42]];
  const narrow = w / h < 0.9;
  const left = w * (narrow ? 0.3 : 0.58), top = h * (narrow ? 0.09 : 0.12);
  const width = w * (narrow ? 0.58 : 0.32), height = Math.min(h * 0.14, w * 0.2);
  const stars = CV_DATA.locations.map((city, i) => ({
    x: left + positions[i][0] * width, y: top + positions[i][1] * height,
    glyph: i === 0 || i === 6 ? '*' : '+', light: 0.36, city: city.city
  }));
  const glyphs: ConstellationGlyph[] = [];
  for (let i = 1; i < stars.length; i++) {
    const a = stars[i - 1], b = stars[i], dx = b.x - a.x, dy = b.y - a.y;
    const n = Math.ceil(Math.hypot(dx, dy) / (narrow ? 12 : 14));
    const glyph = Math.abs(dy) < Math.abs(dx) * 0.35 ? '-' : dy > 0 ? '\\' : '/';
    for (let k = 2; k < n - 1; k += 2)
      glyphs.push({ x: a.x + dx * k / n, y: a.y + dy * k / n, glyph, light: 0.12 });
  }
  return [...glyphs, ...stars];
}
