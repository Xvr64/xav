import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { profileCityStops } from './profileCityStops.ts';

test('one reveal gesture stays at the Profile anchor', () => {
  assert.deepEqual(profileCityStops(100, 100, 1200), [100, 100]);
});

test('only summary reading stops follow the pinned reveal on short screens', () => {
  const stops = profileCityStops(100, 1560, 480);
  assert.deepEqual(stops.slice(0, 2), [100, 100]);
  assert.equal(stops.at(-1), 1560);
  assert.ok(stops.slice(2).every((y, i) => y > stops[i + 1] && y - stops[i + 1] <= .76 * 480 + 1));
});

test('Profile eight-city art-directed editorial canvas enforces exact cities, static craft, and isolation', () => {
  const itinerarySrc = readFileSync(new URL('./ProfileItinerary.tsx', import.meta.url), 'utf8');
  const cssSrc = readFileSync(new URL('./profileItinerary.css', import.meta.url), 'utf8');
  const entrySrc = readFileSync(new URL('./OceanEntry.tsx', import.meta.url), 'utf8');
  const cvDataSrc = readFileSync(new URL('./cvData.ts', import.meta.url), 'utf8');
  const appSrc = readFileSync(new URL('./xavier_h_ry_editorial_portfolio.tsx', import.meta.url), 'utf8');

  // Exact introductory statement without long city enumeration
  assert.match(
    cvDataSrc,
    /heroIntroConcise:\s*'Like the whale migrating across oceans without borders, my journey has been shaped by constant movement\.'/
  );

  // Exact eight cities in exact order (including Pau and Bordeaux, no substitutions)
  const expectedCities = [
    ['doha', 'Doha'],
    ['paris', 'Paris'],
    ['jakarta', 'Jakarta'],
    ['moscow', 'Moscow'],
    ['singapore', 'Singapore'],
    ['pau', 'Pau'],
    ['bordeaux', 'Bordeaux'],
    ['shanghai', 'Shanghai']
  ];

  const foundPairs = [...itinerarySrc.matchAll(/id:\s*'([^']+)',\s*city:\s*'([^']+)'/g)].map(
    ([, id, city]) => [id, city]
  );
  assert.deepEqual(foundPairs, expectedCities);

  // Restrained EN TRAVAUX placeholder with no real photos supplied yet
  assert.match(itinerarySrc, /EN TRAVAUX/);
  assert.doesNotMatch(itinerarySrc, /photoSrc:\s*['"`]/);

  // Art-directed variation: multiple static texture motifs, square viewBox, and interleaved lanes
  for (const motif of ['contour', 'ascii-weave', 'strata', 'stipple']) {
    assert.match(itinerarySrc, new RegExp(`motif:\\s*'${motif}'`));
  }
  assert.match(itinerarySrc, /viewBox="0 0 200 200"/);
  assert.match(itinerarySrc, /lane:\s*'a'/);
  assert.match(itinerarySrc, /lane:\s*'b'/);
  assert.match(cssSrc, /aspect-ratio:\s*1\b/);
  assert.match(cssSrc, /animation-delay:\s*calc\(var\(--plate-index\)\s*\*/);

  // Mounted exclusively in Profile (OceanEntry.tsx), never in other CV sections
  assert.equal((entrySrc.match(/<ProfileItinerary\b/g) ?? []).length, 1);
  assert.equal((appSrc.match(/<ProfileItinerary\b/g) ?? []).length, 0);

  // CSS strictly scoped to Profile (#introduction), never targeting other sections
  for (const forbidden of ['#experience', '#education', '#skills', '#languages', '#interests', '#contact']) {
    assert.equal(cssSrc.includes(forbidden), false, `profileItinerary.css must not target ${forbidden}`);
  }
});
