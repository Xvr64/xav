import test from 'node:test';
import assert from 'node:assert/strict';
import { CV_SECTIONS } from './sections.ts';

test('seven chapters, in reading order, with unique ids', () => {
  assert.deepEqual(CV_SECTIONS.map((s) => s.id), ['introduction', 'experience', 'skills', 'education', 'languages', 'interests', 'contact']);
  assert.equal(new Set(CV_SECTIONS.map((s) => s.id)).size, CV_SECTIONS.length);
});

test('every chapter has a name for the gauge', () => {
  for (const section of CV_SECTIONS) assert.ok(section.label.length > 0);
});
