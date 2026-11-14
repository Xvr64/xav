/**
 * THE ITINERARY — the seven cities as one line of time.
 *
 * The Globe shows where; this shows how long. Every stop is read from the CV's own `period`
 * strings (cvData.ts) and laid on a single axis from the first year to the last, so a stretch's
 * length on the page is its length in years: five years of Singapore are five times one year of
 * Pau. Years the list of cities does not account for become an unlabelled gap, never a guess.
 * Pure, so the page, the tests and any other reading of the journey agree.
 */

export interface ItinerarySource {
  id: string;
  city: string;
  country?: string;
  period: string;
}

export interface ItineraryLeg {
  kind: 'stop' | 'gap';
  id: string;
  city: string;
  country: string;
  /** First and last year of the stretch; equal for a single year (a point on the line). */
  from: number;
  to: number;
  years: number;
  /** Where the stretch starts and ends on the axis, 0..1. */
  a: number;
  b: number;
}

export interface Itinerary {
  from: number;
  to: number;
  span: number;
  legs: ItineraryLeg[];
  /** "Seven cities · 2006–2026" */
  title: string;
}

const NUMBER_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

/** The years a period names: "2006–2009" is [2006, 2009], "2026" is [2026, 2026]. */
export function periodYears(period: string): [number, number] | null {
  const years = (period.match(/\d{4}/g) || []).map(Number);
  if (years.length === 0) return null;
  return [years[0], Math.max(years[0], years[years.length - 1])];
}

export function buildItinerary(locations: readonly ItinerarySource[]): Itinerary {
  const dated = locations
    .map((location) => ({ location, years: periodYears(location.period) }))
    .filter((entry): entry is { location: ItinerarySource; years: [number, number] } => entry.years !== null);
  if (dated.length === 0) return { from: 0, to: 0, span: 0, legs: [], title: '' };

  const from = dated[0].years[0];
  const to = dated.reduce((latest, entry) => Math.max(latest, entry.years[1]), from);
  const span = Math.max(1, to - from);
  const at = (year: number) => Math.max(0, Math.min(1, (year - from) / span));

  const legs: ItineraryLeg[] = [];
  let cursor = from;
  for (const { location, years } of dated) {
    // A stretch never starts before the one before it ended: the line only runs forward
    const start = Math.max(cursor, years[0]);
    const end = Math.max(start, years[1]);
    if (start > cursor) {
      legs.push({ kind: 'gap', id: `gap-${cursor}`, city: '', country: '', from: cursor, to: start, years: start - cursor, a: at(cursor), b: at(start) });
    }
    legs.push({
      kind: 'stop',
      id: location.id,
      city: location.city,
      country: location.country && location.country !== location.city ? location.country : '',
      from: start,
      to: end,
      years: end - start,
      a: at(start),
      b: at(end)
    });
    cursor = end;
  }

  const count = dated.length;
  const word = NUMBER_WORDS[count] ?? String(count);
  return { from, to, span, legs, title: `${word} ${count === 1 ? 'city' : 'cities'} · ${from}–${to}` };
}
