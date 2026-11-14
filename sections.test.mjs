import test from 'node:test';
import assert from 'node:assert/strict';
import { CV_SECTIONS, chapterShare, sectionMark, sectionNumber } from './sections.ts';

test('seven chapters, in reading order, with unique ids', () => {
  assert.deepEqual(CV_SECTIONS.map((s) => s.id), ['introduction', 'experience', 'skills', 'education', 'languages', 'interests', 'contact']);
  assert.equal(new Set(CV_SECTIONS.map((s) => s.id)).size, CV_SECTIONS.length);
});

test('a chapter mark takes the Globe caption form: its place over the count', () => {
  assert.equal(sectionMark('introduction'), '01 / 07');
  assert.equal(sectionMark('experience'), '02 / 07');
  assert.equal(sectionMark('contact'), '07 / 07');
  assert.equal(sectionNumber('education'), '04');
});

test('a chapter line is as much water travelled as chapters reached, and the rest still to come', () => {
  assert.deepEqual(chapterShare('introduction'), { reached: 1, ahead: 6 });
  assert.deepEqual(chapterShare('education'), { reached: 4, ahead: 3 });
  assert.deepEqual(chapterShare('contact'), { reached: 7, ahead: 0 });
  for (const section of CV_SECTIONS) {
    const share = chapterShare(section.id);
    assert.equal(share.reached + share.ahead, CV_SECTIONS.length);
    assert.equal(sectionMark(section.id).slice(0, 2), String(share.reached).padStart(2, '0'));
  }
  assert.equal(chapterShare('journey'), null);
});

test('an id that is not a chapter gets no mark', () => {
  assert.equal(sectionMark('journey'), '');
  assert.equal(sectionMark('home'), '');
  assert.equal(sectionNumber(''), '');
});
