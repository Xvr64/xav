import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { magneticCV, passage, easedPhase, chapterBounds, MAGNETIC_CHAPTERS } from './magneticCVState';
import { entryEndFor } from './terminalMotion';
import { advanceEncryptedLine, encryptedEntryProgress, encryptedCharacterState, ENCRYPTED_CHARSET, ENCRYPTED_ENTRY_END, type EncryptedLineState } from './encryptedMotion';
import { creation, HERO_TEXT_AT } from './creationTimeline';
import { oceanWake } from './oceanWake';
import { textPressureAt } from './whaleTextPressure';
import { EncryptedText } from './components/ui/encrypted-text';
import {
  disableDecodeSound, disposeDecodeSound, enableDecodeSound, noteDecodeActivity,
  onDecodeSoundChange, syncDecodeSoundVisibility
} from './decodeAudio';
import './terminal.css';

/** All CV copy shares one controller, grouped by its actual rendered lines. The cover and
 * Globe own their choreography and opt out. Original, accessible text always reserves layout;
 * only its aria-hidden visual duplicate changes. Completed lines leave the work queue forever. */
const ELIGIBLE = '[data-editorial-section] [data-ascii-text]';
const EXCLUDED = '[data-ascii-preserve]';
const MAGNETIC_OCEAN_GLYPHS = '~/:·+#%=-|\\';
export const AsciiText = EncryptedText;

type Word = {
  el: HTMLElement;
  source: HTMLElement;
  visual: HTMLElement;
  original: string;
  chars: string[];
  left: number;
  centerX: number;
  offset: number;
  seed: number;
  progress: number;
  renderedP: number;
  cells: HTMLSpanElement[] | null;
  states: Int16Array;
};
type Line = EncryptedLineState & {
  block: HTMLElement;
  chapter: HTMLElement | null;
  top: number;
  entryEnd: number;
  voice: 'title' | 'sub' | 'meta' | 'body';
  heading: boolean;
  count: number;
  words: Word[];
};

function blockOf(text: HTMLElement) {
  let block = text.parentElement;
  while (block?.parentElement && getComputedStyle(block).display.startsWith('inline')) block = block.parentElement;
  return block ?? text;
}

function auditCoverage() {
  const missed: string[] = [];
  document.querySelectorAll<HTMLElement>('[data-editorial-section]').forEach(section => {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim() || parent.closest('[data-ascii-text]') || parent.closest(EXCLUDED)) continue;
      if (parent.getClientRects().length) missed.push(node.textContent.trim().slice(0, 40));
    }
  });
  if (missed.length) console.warn('[ascii-decode] section text outside the decode system:', missed);
}

export function useEditorialScroll() {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const cache = new WeakMap<HTMLElement, Word>();
    let words: Word[] = [];
    let pendingLines: Line[] = [];
    let frame = 0;
    let dirty = true;
    let disposed = false;
    let viewport = innerHeight;
    let lastY = NaN;
    let audited = false;

    // Read geometry only on layout changes, never during ordinary scrolling. Keep per-word
    // progress across wrapping/font changes, so a completed word cannot become noise again.
    const measure = () => {
      viewport = innerHeight;
      const y = scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewport);
      const chapterSpans = new Map<HTMLElement, { top: number; end: number }>();
      // A chapter's arrival screen resolves at its top; any lines below the fold resolve by its reading edge.
      if (magneticCV) document.querySelectorAll<HTMLElement>(MAGNETIC_CHAPTERS).forEach(el =>
        chapterSpans.set(el, chapterBounds(el, y, viewport)));
      const blocks = new Map<HTMLElement, Line[]>();
      const lines: Line[] = [];
      words = [];
      document.querySelectorAll<HTMLElement>(ELIGIBLE).forEach(text => {
        if (text.closest(EXCLUDED)) return;
        const block = blockOf(text);
        const chapter = magneticCV ? text.closest<HTMLElement>('[data-editorial-section]') : null;
        const siblings = blocks.get(block) ?? [];
        blocks.set(block, siblings);
        text.querySelectorAll<HTMLElement>('.ascii-word').forEach(el => {
          const source = el.querySelector<HTMLElement>('.ascii-source');
          const visual = el.querySelector<HTMLElement>('.ascii-visual');
          if (!source || !visual) return;
          const rect = el.getBoundingClientRect();
          if (!rect.width && !rect.height) return;
          const original = source.textContent ?? '';
          let word = cache.get(el);
          if (!word || word.original !== original) {
            const chars = Array.from(original);
            word = { el, source, visual, original, chars, left: rect.left, centerX: 0, offset: 0,
              seed: words.length * 131, progress: word?.progress === 1 ? 1 : 0, renderedP: NaN,
              cells: null, states: new Int16Array(chars.length).fill(-2) };
            cache.set(el, word);
          }
          word.left = rect.left;
          word.centerX = rect.left + rect.width / 2;
          // Existing cells remain drawn until a single read/write pass replaces their geometry.
          word.cells = null;
          words.push(word);
          const top = rect.top + y;
          let line = siblings.find(candidate => Math.abs(candidate.top - top) <= 6);
          if (!line) {
            const isMeta = !!block.closest('.meta, dt, time');
            const isDisplay = !isMeta && (!!block.closest('h2') || (magneticCV && !!block.closest('#introduction .lead')));
            const isSub = !isMeta && !isDisplay && !!block.closest('h3, .entry-title, .lang-name, .contact-address');
            const voice = isMeta ? 'meta' : isDisplay ? 'title' : isSub ? 'sub' : 'body';
            const span = chapter ? chapterSpans.get(chapter) : undefined;
            const restY = span ? (top < span.top + viewport ? span.top : span.end) : maxScroll;
            line = { block, chapter, top, entryEnd: entryEndFor(top - restY, viewport, ENCRYPTED_ENTRY_END), count: 0, voice, heading: isDisplay,
              words: [], currentP: 0, revealState: 'hidden' };
            siblings.push(line);
            lines.push(line);
          }
          line.words.push(word);
          line.currentP = Math.max(line.currentP, word.progress);
        });
      });
      for (const line of lines) {
        line.words.sort((a, b) => a.left - b.left);
        for (const word of line.words) {
          word.offset = line.count;
          line.count += word.chars.length;
        }
        // A reflow may merge an old completed line with new words: settle the merged line.
        line.revealState = line.currentP === 1 ? 'revealed' : line.currentP > 0 ? 'revealing' : 'hidden';
      }
      pendingLines = lines.filter(line => line.words.some(word => word.progress < 1));
      pendingLines.sort((a, b) => a.top - b.top);
      dirty = false;
      if (!audited && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
        audited = true;
        auditCoverage();
      }
    };

    // Detached cells use each source character's exact width: no glyph can change wrapping.
    // Finish all geometry reads before attaching cells or writing text/styles.
    const prepareCells = (word: Word) => {
      const node = word.source.firstChild;
      if (!(node instanceof Text)) return;
      const box = word.el.getBoundingClientRect();
      const range = document.createRange();
      let offset = 0;
      word.cells = word.chars.map(char => {
        range.setStart(node, offset);
        range.setEnd(node, offset += char.length);
        const rect = range.getBoundingClientRect();
        const cell = document.createElement('span');
        cell.className = 'ascii-cell';
        // Fractions stay registered to the source while its heading scales into place.
        if (magneticCV && box.width) {
          cell.style.left = `${100 * (rect.left - box.left) / box.width}%`;
          cell.style.width = `${100 * rect.width / box.width}%`;
        } else {
          cell.style.left = `${rect.left - box.left}px`;
          cell.style.width = `${rect.width}px`;
        }
        return cell;
      });
      word.states.fill(-2);
    };

    const render = () => {
      frame = 0;
      if (disposed || document.hidden) return;
      if (creation.active && creation.time < HERO_TEXT_AT) { schedule(); return; }
      const measured = dirty && !passage.destination;
      if (measured) measure();
      const y = scrollY;
      const initial = !Number.isFinite(lastY);
      const delta = initial ? 0 : y - lastY;
      lastY = y;
      const focused = document.activeElement?.closest('a,button');
      const updates: { word: Word; line: Line; p: number }[] = [];
      const remaining: Line[] = [];
      for (const line of pendingLines) {
        let zone = encryptedEntryProgress(line.top - y, viewport, line.entryEnd);
        let forced = media.matches || (focused && line.words.some(word => focused.contains(word.el)));
        let movement = delta;
        if (magneticCV && passage.destination === line.chapter && line.chapter) {
          // Hierarchical arrival decode for lines visible on the landing screen:
          // headings reconstruct first with the richest character depth, metadata stays
          // restrained, and paragraphs / items cascade line by line in reading order.
          const position = line.top - passage.landing;
          const onLandingScreen = position >= -40 && position < viewport;
          if (passage.settleAll && onLandingScreen) {
            zone = 1;
            forced = true;
          } else if (onLandingScreen) {
            const rowFrac = Math.max(0, Math.min(1, position / Math.max(1, viewport)));
            const cascadeFrac = passage.landingAtBottom ? 1 - rowFrac : rowFrac;
            if (line.heading) {
              const start = rowFrac * 0.20;
              zone = easedPhase(passage.titleProgress, start, Math.min(1, start + 0.72));
            } else if (line.voice === 'meta') {
              const start = cascadeFrac * 0.36;
              zone = easedPhase(passage.bodyProgress, start, Math.min(1, start + 0.30));
            } else if (line.voice === 'sub') {
              const start = cascadeFrac * 0.40;
              zone = easedPhase(passage.bodyProgress, start, Math.min(1, start + 0.48));
            } else {
              const start = 0.08 + cascadeFrac * 0.44;
              zone = easedPhase(passage.bodyProgress, start, Math.min(1, start + 0.36));
            }
          } else {
            zone = 0;
          }
          movement = 1; // First visits decode in either direction. Completed lines are out of the queue.
        } else if (magneticCV && passage.settleAll && line.chapter && !line.chapter.hasAttribute('data-cv-muted')) {
          const position = line.top - y;
          if (position >= -40 && position < viewport) {
            zone = 1;
            forced = true;
          }
        } else if (!forced && line.chapter?.hasAttribute('data-cv-muted')) {
          zone = 0;
          movement = 0;
        }
        const next = advanceEncryptedLine(line, zone, movement, forced || (initial && zone > 0));
        const unchanged = next.currentP === line.currentP;
        Object.assign(line, next);
        if (line.currentP < 1) remaining.push(line);
        // Future/offscreen and paused lines need no word traversal or DOM writes.
        // A layout change still gets one pass to initialize/reposition their overlays.
        if (unchanged && !measured) continue;
        for (const word of line.words) {
          const p = line.currentP;
          if (word.renderedP === 1 || (word.renderedP === p && (p === 0 || word.cells))) continue;
          if (p > 0 && p < 1 && !word.cells) prepareCells(word);
          updates.push({ word, line, p });
        }
      }
      pendingLines = remaining;
      let changes = 0;
      let locks = 0;
      for (const { word, line, p } of updates) {
        word.progress = p;
        word.renderedP = p;
        word.visual.style.visibility = p > 0 ? '' : 'hidden';
        if (p >= 1) {
          if (word.visual.textContent !== word.original || word.visual.children.length) word.visual.textContent = word.original;
          word.visual.style.removeProperty('--decode-lift');
          word.cells = null;
          continue;
        }
        if (!word.cells) continue;
        if (word.visual.firstChild !== word.cells[0]) word.visual.replaceChildren(...word.cells);
        const lock = magneticCV
          ? (line.voice === 'title' ? p ** 0.92 : line.voice === 'sub' ? p ** 0.96 : p)
          : (line.voice === 'title' ? 1 - (1 - p) ** 1.7 : line.voice === 'sub' ? 1 - (1 - p) ** 1.35 : p);
        const pressure = textPressureAt(word.centerX, line.top - y, oceanWake);
        const ripple = pressure * 3 * Math.sin(2 * Math.PI * (p - word.offset / line.count));
        const lift = magneticCV
          ? (line.voice === 'title' ? 14 : line.voice === 'sub' ? 7 : line.voice === 'meta' ? 1.5 : 4.5)
          : (line.voice === 'title' ? 4 : line.voice === 'meta' ? 0 : 1);
        word.visual.style.setProperty('--decode-lift', `${((lift + ripple) * (1 - p)).toFixed(1)}px`);
        const ticks = magneticCV
          ? (line.voice === 'meta' ? 6 : line.voice === 'title' ? 42 : 28)
          : (line.voice === 'meta' ? 6 : 32);
        const useOceanGlyphs = magneticCV && passage.destination === line.chapter;
        for (let i = 0; i < word.chars.length; i++) {
          const state = encryptedCharacterState(lock, word.offset + i, line.count, word.seed, ticks);
          if (word.states[i] === state) continue;
          // A locked prefix already occupies its final baseline, even mid-word.
          if (state === -1 || word.states[i] === -2) word.cells[i].classList.toggle('unresolved', state !== -1);
          word.cells[i].textContent = state === -1
            ? word.chars[i]
            : useOceanGlyphs
              ? MAGNETIC_OCEAN_GLYPHS[state % MAGNETIC_OCEAN_GLYPHS.length]
              : ENCRYPTED_CHARSET[state];
          word.states[i] = state;
          changes++;
          if (state === -1) locks++;
        }
      }
      if (changes) noteDecodeActivity(changes, locks, false);
      // No time-driven RAF, whale-wake subscription, or work on completed lines.
    };
    const schedule = () => {
      if (!frame && !disposed && !document.hidden && !passage.destination) frame = requestAnimationFrame(render);
    };
    const invalidate = () => { dirty = true; schedule(); };
    const resize = new ResizeObserver(invalidate);
    document.querySelectorAll('[data-editorial-section]').forEach(el => resize.observe(el));
    const mutations = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
        node instanceof HTMLElement && (node.matches('[data-ascii-text]') || node.querySelector('[data-ascii-text]'))
      ))) invalidate();
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', invalidate);
    window.addEventListener('terminal-content-change', invalidate);
    document.addEventListener('focusin', schedule);
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', invalidate);
    document.fonts.ready.then(() => { if (!disposed) invalidate(); });
    if (magneticCV) passage.requestDecode = () => {
      // The snap already owns a frame. Paint its glyphs before that frame is presented.
      cancelAnimationFrame(frame);
      render();
    };
    render();
    return () => {
      if (magneticCV) passage.requestDecode = null;
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('terminal-content-change', invalidate);
      document.removeEventListener('focusin', schedule);
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', invalidate);
      for (const word of words) {
        word.visual.textContent = word.original;
        word.visual.style.removeProperty('--decode-lift');
        word.visual.style.removeProperty('visibility');
      }
    };
  }, []);
}
/**
 * The decoding sound's only control: a small "sound on/off" label in the top-right corner. Off on every visit; it shows
 * "on" only once the audio context is actually running, and turns itself back off if the browser
 * takes the audio away.
 */
export function DecodeSoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const unsubscribe = onDecodeSoundChange(setOn);
    const onVisibility = () => syncDecodeSoundVisibility(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', onVisibility);
      disposeDecodeSound();
    };
  }, []);

  const toggle = () => {
    if (on) disableDecodeSound();
    else void enableDecodeSound();
  };

  const Icon = on ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      className="decode-sound-toggle"
      onClick={toggle}
      aria-pressed={on}
      title={on ? 'Mute the decoding sound' : 'Play the decoding sound'}
    >
      <Icon aria-hidden="true" strokeWidth={1.5} />
      sound
      <span className="decode-sound-state" aria-hidden="true">
        {on ? 'on' : 'off'}
      </span>
    </button>
  );
}
