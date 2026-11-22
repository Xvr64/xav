import test from 'node:test';
import assert from 'node:assert/strict';
import { CV_SECTIONS } from './sections.ts';
import { CV_DATA } from './cvData.ts';

test('seven chapters, in reading order, with unique ids', () => {
  assert.deepEqual(CV_SECTIONS.map((s) => s.id), ['introduction', 'experience', 'skills', 'education', 'languages', 'interests', 'contact']);
  assert.equal(new Set(CV_SECTIONS.map((s) => s.id)).size, CV_SECTIONS.length);
});

test('every chapter has a name for the gauge', () => {
  for (const section of CV_SECTIONS) assert.ok(section.label.length > 0);
});

test('interests read once each, every line a full sentence, with the CV facts untouched', () => {
  const sports = CV_DATA.interests.find((i) => i.id === 'sports-music');
  assert.deepEqual(sports.bullets, [
    'Calisthenics and athletic training: bodyweight workouts and personal discipline.',
    'Music production, beatmaking, sampling, music history, and sound design.'
  ]);
  const fashion = CV_DATA.interests.find((i) => i.id === 'fashion-retail');
  assert.equal(fashion.bullets.at(-1), 'Celine, Louis Vuitton, and Hermès.');
  for (const interest of CV_DATA.interests) {
    for (const line of interest.bullets) assert.match(line, /\.$/, `"${line}" ends as a sentence`);
  }
  assert.equal(CV_DATA.email, 'Heryxx44@gmail.com');
  assert.deepEqual(
    CV_DATA.locations.map((l) => `${l.city} ${l.period}`),
    ['Doha 2006–2009', 'Paris 2009–2012', 'Jakarta 2012–2016', 'Moscow 2016–2018', 'Singapore 2018–2023', 'Pau 2023–2024', 'Bordeaux 2024–2026', 'Shanghai 2026']
  );
});
