import test from 'node:test';
import assert from 'node:assert/strict';
import { buildItinerary, periodYears } from './itinerary.ts';
import { CV_DATA } from './cvData.ts';

test('a period names its first and last year; a single year is a point', () => {
  assert.deepEqual(periodYears('2006–2009'), [2006, 2009]);
  assert.deepEqual(periodYears('2026'), [2026, 2026]);
  assert.equal(periodYears('ongoing'), null);
});

test('the CV journey: seven stops in order, every year read from the data', () => {
  const itinerary = buildItinerary(CV_DATA.locations);
  const stops = itinerary.legs.filter((leg) => leg.kind === 'stop');
  assert.deepEqual(stops.map((leg) => leg.city), CV_DATA.locations.map((location) => location.city));
  assert.equal(itinerary.from, 2006);
  assert.equal(itinerary.to, 2026);
  assert.equal(itinerary.title, 'Seven cities · 2006–2026');
  for (const leg of stops) {
    const source = CV_DATA.locations.find((location) => location.id === leg.id);
    assert.deepEqual([leg.from, leg.to], periodYears(source.period), `${leg.city} keeps the CV's years`);
  }
});

test('lengths are proportional to years, and the line is continuous from 0 to 1', () => {
  const { legs, span } = buildItinerary(CV_DATA.locations);
  assert.equal(legs[0].a, 0);
  assert.equal(legs[legs.length - 1].b, 1);
  for (let i = 1; i < legs.length; i++) assert.equal(legs[i].a, legs[i - 1].b, `leg ${i} starts where the last ended`);
  for (const leg of legs) assert.ok(Math.abs(leg.b - leg.a - leg.years / span) < 1e-12);
  const years = Object.fromEntries(legs.filter((leg) => leg.kind === 'stop').map((leg) => [leg.id, leg.years]));
  assert.equal(years.singapore, 5 * years.pau);
  assert.equal(years.jakarta, 2 * years.moscow);
});

test('years between two stops become an unlabelled gap, never a city', () => {
  const { legs } = buildItinerary(CV_DATA.locations);
  const gaps = legs.filter((leg) => leg.kind === 'gap');
  assert.equal(gaps.length, 1);
  assert.deepEqual([gaps[0].from, gaps[0].to, gaps[0].city], [2024, 2026, '']);
  // It sits between Pau and Shanghai
  const at = legs.indexOf(gaps[0]);
  assert.equal(legs[at - 1].id, 'pau');
  assert.equal(legs[at + 1].id, 'shanghai');
});

test('the last stop is a point at the end of the line', () => {
  const { legs } = buildItinerary(CV_DATA.locations);
  const last = legs[legs.length - 1];
  assert.equal(last.id, 'shanghai');
  assert.equal(last.years, 0);
  assert.equal(last.a, 1);
});

test('a country that repeats its city is left out; undated entries are skipped', () => {
  const { legs, title } = buildItinerary([
    { id: 'a', city: 'Singapore', country: 'Singapore', period: '2018–2023' },
    { id: 'b', city: 'Nowhere', period: 'unknown' },
    { id: 'c', city: 'Pau', country: 'France', period: '2023–2024' }
  ]);
  assert.deepEqual(legs.map((leg) => [leg.city, leg.country]), [['Singapore', ''], ['Pau', 'France']]);
  assert.equal(title, 'Two cities · 2018–2024');
});

test('overlapping periods never run the line backwards', () => {
  const { legs } = buildItinerary([
    { id: 'a', city: 'A', period: '2010–2014' },
    { id: 'b', city: 'B', period: '2013–2016' }
  ]);
  assert.deepEqual(legs.map((leg) => [leg.from, leg.to]), [[2010, 2014], [2014, 2016]]);
});

test('no dated stops: an empty itinerary', () => {
  assert.deepEqual(buildItinerary([]).legs, []);
});
