import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  RESOLVED,
  entryEndFor,
  exitStartFor,
  lineProgress,
  VIEWPORT_ZONES
} from './terminalMotion';
import { advanceEncryptedLine, encryptedCharacterState, ENCRYPTED_CHARSET, FLIP_DELAY_MS } from './encryptedMotion';
import { EncryptedText } from './components/ui/encrypted-text';
import {
  disableDecodeSound,
  disposeDecodeSound,
  enableDecodeSound,
  noteDecodeActivity,
  onDecodeSoundChange,
  syncDecodeSoundVisibility
} from './decodeAudio';
import './terminal.css';

/**
 * Eligibility for the character decode, in one place:
 *  - Every `<AsciiText>` inside a `[data-editorial-section]` decodes. All ordinary page copy
 *    (headings, personal introduction, experience, education, skills, languages, interests, contact,
 *    and metadata) is written through `AsciiText`.
 *  - `[data-ascii-preserve]` opts a subtree out. It is used only where another system already
 *    owns the motion: the cover stage (its own letter-to-current headline animation), the
 *    visually clipped semantic name under the cover, and the Globe runway (city captions are
 *    part of the Globe's own sequence).
 *  - Canvas art (whales, boat, jellyfish, ocean, particles, Globe) is not DOM text and is never
 *    touched. Overlays outside the sections (CV preview modal, download toast) are not scroll copy.
 */
const ELIGIBLE = '[data-editorial-section] [data-ascii-text]';
const EXCLUDED = '[data-ascii-preserve]';

/** Original text reserves every word's exact geometry and remains accessible.
 * Only the absolutely positioned, aria-hidden duplicate is ever mutated. */
export const AsciiText = EncryptedText;

type Word = {
  el: HTMLElement;
  source: HTMLElement;
  visual: HTMLElement;
  original: string;
  chars: string[];
  decodable: boolean[];
  /** The enclosing link or button: a focused control always shows its real label. */
  control: Element | null;
  /** Document Y of the rendered line this word sits on, where its entry decode completes and
   * where its exit scramble begins. */
  top: number;
  entryEnd: number;
  exitStart: number;
  seed: number;
  charOffset: number;
  lineChars: number;
  /** Last rendered quantized progress (NaN forces a write). */
  key: number;
  /** What the overlay currently holds ('stale': cells placed for an older layout). */
  shown: 'text' | 'cells' | 'stale';
  /** Each cell keeps the original character's offset and width. */
  cellX: Float32Array | null;
  cellW: Float32Array | null;
  cells: HTMLSpanElement[] | null;
  /** Last state shown per character (RESOLVED or a glyph state) and last opacity written. */
  states: Int8Array;
  opacities: Float32Array;

  // Reveal lifecycle tracking
  revealState: 'hidden' | 'revealing' | 'revealed' | 'exiting';
  currentP: number;
};

type Line = {
  block: HTMLElement;
  characterCount: number;
  top: number;
  entryEnd: number;
  exitStart: number;
  words: Word[];
  revealState: 'hidden' | 'revealing' | 'revealed' | 'exiting';
  currentP: number;
};

/** The nearest block-level ancestor: the column a line of text is set in. */
function blockOf(text: HTMLElement) {
  let block = text.parentElement;
  while (block && block.parentElement && getComputedStyle(block).display.startsWith('inline')) block = block.parentElement;
  return block ?? text;
}

function auditCoverage() {
  const missed: string[] = [];
  document.querySelectorAll<HTMLElement>('[data-editorial-section]').forEach((section) => {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim()) continue;
      if (parent.closest('[data-ascii-text]') || parent.closest(EXCLUDED)) continue;
      if (!parent.getClientRects().length) continue;
      missed.push(node.textContent.trim().slice(0, 40));
    }
  });
  if (missed.length) console.warn('[ascii-decode] section text outside the decode system:', missed);
}

export function useEditorialScroll() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cache = new WeakMap<HTMLElement, Word>();
    let docLines: Line[] = [];
    let words: Word[] = [];
    let frame = 0;
    let dirty = true;
    let disposed = false;
    let viewport = window.innerHeight;
    let lastY = NaN;
    let lastTime = 0;
    let audited = false;

    /** Geometry only (reads). Per-word animation state survives re-measuring via the cache. */
    const measure = () => {
      viewport = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewport);
      const nextWords: Word[] = [];
      const measuredLines: Line[] = [];
      let counter = 0;

      document.querySelectorAll<HTMLElement>(ELIGIBLE).forEach((text) => {
        if (text.closest(EXCLUDED)) return;
        const blockElement = blockOf(text);
        text.querySelectorAll<HTMLElement>('.ascii-word').forEach((el) => {
          const visual = el.querySelector<HTMLElement>('.ascii-visual');
          const source = el.querySelector<HTMLElement>('.ascii-source');
          if (!visual || !source) return;
          const rect = el.getBoundingClientRect();
          // Not laid out (display:none, collapsed): leave it untouched and fully visible
          if (rect.width === 0 && rect.height === 0) return;
          const original = visual.dataset.word || source.textContent || '';
          let word = cache.get(el);
          const wasRevealed = word?.revealState === 'revealed';
          if (!word || word.original !== original) {
            const chars = Array.from(original);
            word = {
              el,
              source,
              visual,
              original,
              chars,
              decodable: chars.map((char) => !/\s/u.test(char)),
              control: null,
              top: 0,
              entryEnd: 0,
              exitStart: 0,
              seed: 0,
              charOffset: 0,
              lineChars: chars.length,
              key: NaN,
              shown: 'text',
              cellX: null,
              cellW: null,
              cells: null,
              states: new Int8Array(chars.length).fill(RESOLVED),
              opacities: new Float32Array(chars.length).fill(1),
              revealState: wasRevealed ? 'revealed' : 'hidden',
              currentP: wasRevealed ? 1 : 0
            };
            if (visual.textContent !== original) visual.textContent = original;
            cache.set(el, word);
          }
          word.control = el.closest('a,button');
          word.seed = (++counter * 131) >>> 0;
          word.key = NaN;
          // Layout changed: character cells are re-measured lazily the next time they are needed
          word.cellX = word.cellW = null;
          word.cells = null;
          if (word.shown === 'cells') word.shown = 'stale';

          const top = rect.top + scrollY;
          let matchedLine: Line | undefined;
          for (const candidate of measuredLines) {
            if (candidate.block === blockElement && Math.abs(candidate.top - top) <= 6) {
              matchedLine = candidate;
              break;
            }
          }
          if (!matchedLine) {
            const entryEnd = entryEndFor(top - maxScroll, viewport);
            const exitStart = exitStartFor(top - maxScroll, viewport);
            matchedLine = {
              block: blockElement,
              characterCount: 0,
              top,
              entryEnd,
              exitStart,
              words: [],
              revealState: word.revealState,
              currentP: word.currentP
            };
            measuredLines.push(matchedLine);
          }
          if (word.revealState === 'revealed') {
            matchedLine.revealState = 'revealed';
            matchedLine.currentP = 1;
          } else if (word.revealState === 'revealing' && matchedLine.revealState !== 'revealed') {
            matchedLine.revealState = 'revealing';
            matchedLine.currentP = word.currentP;
          }
          matchedLine.words.push(word);
          word.top = matchedLine.top;
          word.entryEnd = matchedLine.entryEnd;
          word.exitStart = matchedLine.exitStart;
          nextWords.push(word);
        });
      });

      docLines = measuredLines;
      docLines.sort((a, b) => a.top - b.top);
      for (const line of docLines) {
        line.words.sort((a, b) => a.el.getBoundingClientRect().left - b.el.getBoundingClientRect().left);
        line.characterCount = line.words.reduce((count, word) => count + word.chars.length, 0);
        let offset = 0;
        for (const word of line.words) {
          word.charOffset = offset;
          word.lineChars = line.characterCount;
          offset += word.chars.length;
        }
      }
      words = nextWords;
      dirty = false;
      if (!audited && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
        audited = true;
        auditCoverage();
      }
    };

    /** Reads each character's real position (before any write of the frame). */
    const measureChars = (w: Word) => {
      const node = w.source.firstChild;
      const n = w.chars.length;
      w.cellX = new Float32Array(n);
      w.cellW = new Float32Array(n);
      const box = w.el.getBoundingClientRect();
      if (!(node instanceof Text)) return;
      const range = document.createRange();
      let unit = 0;
      for (let i = 0; i < n; i++) {
        const len = w.chars[i].length;
        range.setStart(node, unit);
        range.setEnd(node, unit + len);
        unit += len;
        const r = range.getBoundingClientRect();
        w.cellX[i] = r.left - box.left;
        w.cellW[i] = r.width;
      }
    };

    /** One absolutely placed cell per character, each exactly over its real letter. */
    const buildCells = (w: Word) => {
      w.states.fill(-2);
      w.cells = w.chars.map((char, i) => {
        const cell = document.createElement('span');
        cell.className = 'ascii-cell';
        cell.textContent = char;
        cell.style.left = `${w.cellX![i]}px`;
        cell.style.width = `${w.cellW![i]}px`;
        return cell;
      });
    };

    const render = () => {
      frame = 0;
      if (dirty) measure();
      const y = window.scrollY;
      const now = performance.now();
      const scrollDelta = Number.isFinite(lastY) ? y - lastY : 0;
      const elapsedMs = lastTime ? Math.min(64, now - lastTime) : 0;
      lastY = y;
      lastTime = now;
      const isReduced = media.matches;
      const focused = document.activeElement;

      let needsAnotherRaf = false;

      // One time-driven decode per rendered line; scrolling back reverses its entrance.
      for (const line of docLines) {
        const relTop = line.top - y;
        const entryLength = VIEWPORT_ZONES.ENTRY_START - VIEWPORT_ZONES.ENTRY_END;
        const exitLength = VIEWPORT_ZONES.EXIT_START - VIEWPORT_ZONES.EXIT_END;
        const next = advanceEncryptedLine(
          line,
          lineProgress(relTop, viewport, line.entryEnd, line.exitStart),
          relTop >= viewport * (line.entryEnd + entryLength),
          relTop <= viewport * (line.exitStart - exitLength),
          relTop < viewport * line.exitStart,
          scrollDelta,
          elapsedMs,
          line.characterCount,
          isReduced
        );
        line.revealState = next.revealState;
        line.currentP = next.currentP;
        if (line.revealState === 'revealing') needsAnotherRaf = true;

        // Sync state back to each word in this line
        for (const w of line.words) {
          w.revealState = line.revealState;
          w.currentP = line.currentP;
        }
      }

      // Pass 2: Determine which words need updating in DOM this frame
      const pending: { w: Word; p: number; entering: boolean }[] = [];
      for (const w of words) {
        const forced = isReduced || (w.control !== null && w.control === focused);
        const lineP = forced ? 1 : w.currentP;
        const entering = w.revealState !== 'exiting';
        // Flip only encrypted letters, leaving the resolved prefix stable.
        const p = lineP;
        const flip = p > 0 && p < 1 ? Math.floor(now / FLIP_DELAY_MS) : 0;
        const key = (entering ? p : -p - 1) + flip * 4;
        if (w.key === key) continue;
        w.key = key;
        if (p > 0 && p < 1 && !w.cellX) measureChars(w);
        pending.push({ w, p, entering });
      }

      // Pass 3 (DOM writes)
      let enterChanges = 0;
      let exitChanges = 0;
      let locks = 0;
      for (const { w, p, entering } of pending) {
        let changes = 0;
        if (p >= 1) {
          // Readable: the overlay goes back to the plain, fully typeset word
          w.states.forEach((s, i) => {
            if (s !== RESOLVED && w.decodable[i]) {
              changes++;
              locks++;
            }
          });
          w.states.fill(RESOLVED);
          if (w.shown !== 'text' || w.visual.textContent !== w.original) {
            w.visual.textContent = w.original;
            w.shown = 'text';
          }
          w.el.style.opacity = '1';
        } else if (p <= 0) {
          // Gone: every character is back to its first glyph, nothing is drawn
          w.states.forEach((s, i) => {
            if (s !== 0 && w.decodable[i]) changes++;
          });
          w.states.fill(0);
          w.opacities.fill(-1);
          if (w.shown !== 'text') {
            w.visual.textContent = w.original;
            w.shown = 'text';
          }
          w.el.style.opacity = '0';
        } else {
          if (!w.cells) buildCells(w);
          if (w.shown !== 'cells') {
            w.states.fill(-2);
            w.visual.replaceChildren(...w.cells!);
            w.shown = 'cells';
            w.opacities.fill(-1);
          }
          w.el.style.opacity = '1';
          for (let i = 0; i < w.chars.length; i++) {
            const cell = w.cells![i];
            if (w.decodable[i]) {
              const state = encryptedCharacterState(p, w.charOffset + i, w.lineChars, now, w.seed);
              const before = w.states[i];
              if (state !== before) {
                changes++;
                if ((state === RESOLVED) !== (before === RESOLVED)) locks++;
                cell.textContent = state === RESOLVED ? w.chars[i] : ENCRYPTED_CHARSET[state];
                w.states[i] = state;
              }
            }
            // The reference keeps its scrambled suffix at full ink; fade only at disappearance.
            const opacity = Math.min(1, p / 0.08);
            if (opacity !== w.opacities[i]) {
              w.opacities[i] = opacity;
              cell.style.opacity = String(opacity);
            }
          }
        }
        if (entering) enterChanges += changes;
        else exitChanges += changes;
      }

      if (enterChanges + exitChanges > 0) {
        noteDecodeActivity(enterChanges + exitChanges, locks, exitChanges > enterChanges);
      }

      // Keep RAF loop running while any line is revealing
      if (needsAnotherRaf && !disposed) {
        schedule();
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const invalidate = () => {
      dirty = true;
      schedule();
    };
    const onFocus = () => {
      words.forEach((w) => (w.key = NaN));
      schedule();
    };

    const observer = new ResizeObserver(invalidate);
    document.querySelectorAll('[data-editorial-section]').forEach((el) => observer.observe(el));
    // Conditionally rendered or removed text: re-measure whenever the word set changes
    const mutations = new MutationObserver((records) => {
      if (
        records.some((r) =>
          [...r.addedNodes, ...r.removedNodes].some(
            (n) => n instanceof HTMLElement && (n.matches('[data-ascii-text]') || n.querySelector('[data-ascii-text]'))
          )
        )
      )
        invalidate();
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', invalidate);
    window.addEventListener('terminal-content-change', invalidate);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onFocus);
    media.addEventListener('change', invalidate);
    document.fonts.ready.then(() => {
      if (!disposed) invalidate();
    });

    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('terminal-content-change', invalidate);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onFocus);
      media.removeEventListener('change', invalidate);
      words.forEach((w) => {
        w.el.style.removeProperty('opacity');
        w.visual.textContent = w.original;
      });
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
