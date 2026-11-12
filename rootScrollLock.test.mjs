import test from 'node:test';
import assert from 'node:assert/strict';
import { holdRootScroll } from './rootScrollLock.ts';

/** A style object with the one CSS rule that matters here: writing the `overflow` shorthand
 * rewrites both longhands, whoever set them. */
function rootStyle() {
  const s = { overflowX: '', overflowY: '', scrollbarGutter: '' };
  Object.defineProperty(s, 'overflow', {
    get() { return s.overflowX === s.overflowY ? s.overflowY : `${s.overflowX} ${s.overflowY}`.trim(); },
    set(value) { s.overflowX = value; s.overflowY = value; }
  });
  return s;
}

test('the opening holds the page and gives back what it found', () => {
  const style = rootStyle();
  const hold = holdRootScroll(style);
  assert.equal(style.overflowY, 'hidden');
  assert.equal(style.scrollbarGutter, 'stable');
  assert.equal(hold.held, true);
  hold.release();
  assert.equal(style.overflowY, '');
  assert.equal(style.scrollbarGutter, '');
  assert.equal(hold.held, false);
});

test('a second release never clears a lock the Globe took in between', () => {
  const style = rootStyle();
  const hold = holdRootScroll(style);
  // The Hero wakes: the visitor is released while the arrival finishes
  hold.release();
  // Two hard flings later the Globe owns native scrolling (cinematicScroll.ts: own('ready'))
  style.overflowY = 'hidden';
  // The arrival ends and the opening's effect cleans up
  hold.release();
  assert.equal(style.overflowY, 'hidden', 'the Globe still holds the page');
});

test('the unguarded restore this replaces does clear the Globe\'s lock', () => {
  // The behaviour before the fix, kept as a statement of the failure being prevented
  const style = rootStyle();
  const previous = style.overflow;
  style.overflow = 'hidden';
  style.overflow = previous;      // release as the Hero wakes
  style.overflowY = 'hidden';     // the Globe takes ownership
  style.overflow = previous;      // effect cleanup restores again
  assert.equal(style.overflowY, '', 'the shorthand write wipes overflow-y');
});

test('a hold released only at cleanup (Skip intro, reduced motion) still restores', () => {
  const style = rootStyle();
  style.overflow = 'clip';
  const hold = holdRootScroll(style);
  hold.release();
  assert.equal(style.overflow, 'clip');
});
