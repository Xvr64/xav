/**
 * Where the marker sits, in ticks: the current section's index plus how far the reading line has
 * travelled toward the next one. Before the first section it rests on the first tick; in the last
 * section it rests on the last. Pure, so the marker is the same going down and coming back.
 */
export function gaugePosition(tops: readonly number[], readingY: number): { index: number; position: number } {
  let index = -1;
  for (let k = 0; k < tops.length; k++) if (tops[k] <= readingY) index = k;
  if (index < 0) return { index: -1, position: 0 };
  if (index >= tops.length - 1) return { index, position: tops.length - 1 };
  const span = Math.max(1, tops[index + 1] - tops[index]);
  return { index, position: index + Math.max(0, Math.min(1, (readingY - tops[index]) / span)) };
}
