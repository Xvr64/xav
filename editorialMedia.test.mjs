import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('photographic stages are strictly restricted to Profile, Experience, and Education', () => {
  const mediaSrc = readFileSync(new URL('./EditorialMedia.tsx', import.meta.url), 'utf8');
  const cssSrc = readFileSync(new URL('./editorialMedia.css', import.meta.url), 'utf8');
  const appSrc = readFileSync(new URL('./xavier_h_ry_editorial_portfolio.tsx', import.meta.url), 'utf8');
  const entrySrc = readFileSync(new URL('./OceanEntry.tsx', import.meta.url), 'utf8');

  // Strict section union type & config table
  assert.match(mediaSrc, /export type MediaSectionId = 'profile' \| 'experience' \| 'education';/);
  assert.doesNotMatch(mediaSrc, /'(skills|languages|interests|contact)'/);

  // Exact seven-city photographic sequence order for Profile
  assert.match(
    mediaSrc,
    /'Doha',\s*'Paris',\s*'Jakarta',\s*'Moscow',\s*'Singapore',\s*'Bordeaux',\s*'Shanghai'/
  );

  // Placeholder displays EN TRAVAUX with zero hatch/contour textures
  assert.match(mediaSrc, />EN TRAVAUX</);
  assert.doesNotMatch(cssSrc, /repeating-radial-gradient|repeating-linear-gradient/);

  // Only Profile (OceanEntry.tsx), Experience, and Education (App) mount EditorialMedia
  assert.equal((entrySrc.match(/<EditorialMedia\b/g) ?? []).length, 1);
  assert.match(entrySrc, /<EditorialMedia\s+section="profile"\s*\/>/);
  assert.equal((appSrc.match(/<EditorialMedia\b/g) ?? []).length, 2);
  assert.match(appSrc, /<EditorialMedia\s+section="experience"\s*\/>/);
  assert.match(appSrc, /<EditorialMedia\s+section="education"\s*\/>/);

  // Unrelated sections are never styled or modified by editorialMedia.css
  for (const forbidden of ['#skills', '#languages', '#interests', '#contact']) {
    assert.equal(cssSrc.includes(forbidden), false, `editorialMedia.css must not target ${forbidden}`);
  }
});
