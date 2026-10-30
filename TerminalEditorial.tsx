import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  RESOLVED,
  charGlyph,
  charOpacity,
  charProgress,
  charState,
  entryEndFor,
  exitStartFor,
  isDecodable,
  lineProgress
} from './terminalMotion';
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
 *    (headings, intro, experience, education, skills, languages, interests, contact, footer,
 *    dates and metadata) is written through `AsciiText`, so nothing opts in element by element.
 *  - `[data-ascii-preserve]` opts a subtree out. It is used only where another system already
 *    owns the motion: the cover stage (its own letter-to-current headline animation), the
 *    visually clipped semantic name in the introduction, and the Globe runway (city captions are
 *    part of the Globe's own sequence).
 *  - Canvas art (whales, boat, jellyfish, ocean, particles, Globe) is not DOM text and is never
 *    touched. Overlays outside the sections (CV preview modal, download toast) are not scroll copy.
 * In development the controller warns about visible section text that is neither decoded nor
 * excluded, so a new paragraph cannot silently bypass the system.
 */
const ELIGIBLE = '[data-editorial-section] [data-ascii-text]';
const EXCLUDED = '[data-ascii-preserve]';

/** Original text reserves every word's exact geometry and remains accessible.
 * Only the absolutely positioned, aria-hidden duplicate is ever mutated. */
export function AsciiText({ text, className = '' }: { text: string; className?: string }) {
  useEffect(() => {
    window.dispatchEvent(new Event('terminal-content-change'));
  }, [text]);
  return (
    <span className={`ascii-text ${className}`} data-ascii-text>
      {text.split(/(\s+)/).map((word, index) =>
        /^\s+$/.test(word) ? (
          <React.Fragment key={index}>{word}</React.Fragment>
        ) : (
          <span className="ascii-word" key={index}>
            <span className="ascii-source">{word}</span>
            <span className="ascii-visual" aria-hidden="true" data-word={word}>
              {word}
            </span>
          </span>
        )
      )}
    </span>
  );
}

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
  /** Viewport X and width of the text block the decoding wave crosses. */
  blockLeft: number;
  blockWidth: number;
  seed: number;
  /** Last rendered quantized progress (NaN forces a write). */
  key: number;
  /** What the overlay currently holds ('stale': cells placed for an older layout). */
  shown: 'text' | 'cells' | 'stale';
  /** Per character: 0..1 position across the block, and the cell's offset/width in the word. */
  ts: Float32Array | null;
  cellX: Float32Array | null;
  cellW: Float32Array | null;
  cells: HTMLSpanElement[] | null;
  /** Last state shown per character (RESOLVED or a glyph state) and last opacity written. */
  states: Int8Array;
  opacities: Float32Array;
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
    let words: Word[] = [];
    let frame = 0;
    let dirty = true;
    let disposed = false;
    let viewport = window.innerHeight;
    let lastY = NaN;
    let audited = false;

    /** Geometry only (reads). Per-word animation state survives re-measuring via the cache. */
    const measure = () => {
      viewport = window.innerHeight;
      const scrollY = window.scrollY;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewport);
      const next: Word[] = [];
      let counter = 0;
      document.querySelectorAll<HTMLElement>(ELIGIBLE).forEach((text) => {
        if (text.closest(EXCLUDED)) return;
        const block = blockOf(text).getBoundingClientRect();
        const lines: { top: number; words: Word[] }[] = [];
        text.querySelectorAll<HTMLElement>('.ascii-word').forEach((el) => {
          const visual = el.querySelector<HTMLElement>('.ascii-visual');
          const source = el.querySelector<HTMLElement>('.ascii-source');
          if (!visual || !source) return;
          const rect = el.getBoundingClientRect();
          // Not laid out (display:none, collapsed): leave it untouched and fully visible
          if (rect.width === 0 && rect.height === 0) return;
          const original = visual.dataset.word || source.textContent || '';
          let word = cache.get(el);
          if (!word || word.original !== original) {
            const chars = Array.from(original);
            word = {
              el,
              source,
              visual,
              original,
              chars,
              decodable: chars.map(isDecodable),
              control: null,
              top: 0,
              entryEnd: 0,
              exitStart: 0,
              blockLeft: 0,
              blockWidth: 1,
              seed: 0,
              key: NaN,
              shown: 'text',
              ts: null,
              cellX: null,
              cellW: null,
              cells: null,
              states: new Int8Array(chars.length).fill(RESOLVED),
              opacities: new Float32Array(chars.length).fill(1)
            };
            if (visual.textContent !== original) visual.textContent = original;
            cache.set(el, word);
          }
          word.control = el.closest('a,button');
          word.blockLeft = block.left;
          word.blockWidth = Math.max(1, block.width);
          word.seed = (++counter * 131) >>> 0;
          word.key = NaN;
          // Layout changed: character cells are re-measured lazily the next time they are needed
          word.ts = word.cellX = word.cellW = null;
          word.cells = null;
          if (word.shown === 'cells') word.shown = 'stale';
          const top = rect.top + scrollY;
          let line = lines.find((l) => Math.abs(l.top - top) <= 4);
          if (!line) lines.push((line = { top, words: [] }));
          line.words.push(word);
        });
        lines.forEach((line) => {
          const entryEnd = entryEndFor(line.top - maxScroll, viewport);
          const exitStart = exitStartFor(line.top - maxScroll, viewport);
          line.words.forEach((word) => {
            word.top = line.top;
            word.entryEnd = entryEnd;
            word.exitStart = exitStart;
          });
        });
        lines.forEach((line) => next.push(...line.words));
      });
      words = next;
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
      w.ts = new Float32Array(n);
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
        w.ts[i] = (r.left + r.width / 2 - w.blockLeft) / w.blockWidth;
      }
    };

    /** One absolutely placed cell per character, each exactly over its real letter. */
    const buildCells = (w: Word) => {
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
      // Sound answers scrolling only: resizes, font loads and focus changes re-render silently
      const scrolled = Number.isFinite(lastY) && y !== lastY;
      lastY = y;
      const isReduced = media.matches;
      const focused = document.activeElement;

      // Pass 1 (reads only): which words change this frame, and character geometry they need
      const pending: { w: Word; p: number; entering: boolean }[] = [];
      for (const w of words) {
        const relTop = w.top - y;
        const forced = isReduced || (w.control !== null && w.control === focused);
        const lineP = forced ? 1 : lineProgress(relTop, viewport, w.entryEnd, w.exitStart);
        const entering = relTop > viewport * 0.5;
        // Quantized so sub-pixel scroll jitter never re-renders (or clicks)
        const p = Math.round(lineP * 240) / 240;
        const key = entering ? p : -p - 1;
        if (w.key === key) continue;
        w.key = key;
        if (p > 0 && p < 1 && !w.ts) measureChars(w);
        pending.push({ w, p, entering });
      }

      // Pass 2 (writes only)
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
          w.el.style.opacity = '0';
        } else {
          if (!w.cells) buildCells(w);
          if (w.shown !== 'cells') {
            w.visual.replaceChildren(...w.cells!);
            w.shown = 'cells';
            w.opacities.fill(-1);
          }
          w.el.style.opacity = '1';
          for (let i = 0; i < w.chars.length; i++) {
            const c = charProgress(p, w.ts![i], entering);
            const cell = w.cells![i];
            if (w.decodable[i]) {
              const state = charState(c);
              const before = w.states[i];
              if (state !== before) {
                changes++;
                if ((state === RESOLVED) !== (before === RESOLVED)) locks++;
                cell.textContent = state === RESOLVED ? w.chars[i] : charGlyph(state, w.seed + i);
                w.states[i] = state;
              }
            }
            const opacity = Math.round(charOpacity(p, c) * 20) / 20;
            if (opacity !== w.opacities[i]) {
              w.opacities[i] = opacity;
              cell.style.opacity = String(opacity);
            }
          }
        }
        if (entering) enterChanges += changes;
        else exitChanges += changes;
      }
      if (scrolled) noteDecodeActivity(enterChanges + exitChanges, locks, exitChanges > enterChanges);
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
