import React, { useEffect } from 'react';
import { decodeWord, wordProgress, wordOpacity } from './terminalMotion';
import './terminal.css';

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

export function useEditorialScroll() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let dirty = true;
    let disposed = false;
    let viewport = window.innerHeight;

    type WordItem = {
      el: HTMLElement;
      visual: HTMLElement;
      original: string;
      top: number;              // document-relative Y
      left: number;             // document-relative X
      height: number;
      wordIndexInLine: number;  // 0, 1, 2... within its line
      totalWordsInLine: number;
      seed: number;
      lastP: number;
    };

    let words: WordItem[] = [];

    const measure = () => {
      viewport = window.innerHeight;
      words = [];
      let globalWordCounter = 0;

      document.querySelectorAll<HTMLElement>('[data-editorial-section] [data-ascii-text]').forEach(text => {
        if (text.closest('[data-ascii-preserve]')) return;

        // Group words in this block by rendered line
        type TempWord = { el: HTMLElement; rect: DOMRect; visual: HTMLElement; original: string };
        type TempLine = { top: number; words: TempWord[] };
        const tempLines: TempLine[] = [];

        text.querySelectorAll<HTMLElement>('.ascii-word').forEach(el => {
          const visual = el.querySelector<HTMLElement>('.ascii-visual');
          if (!visual) return;
          const original = visual.dataset.word || el.textContent || '';
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;

          let line = tempLines.find(l => Math.abs(l.top - top) <= 4);
          if (!line) {
            line = { top, words: [] };
            tempLines.push(line);
          }
          line.words.push({ el, rect, visual, original });
        });

        tempLines.forEach(line => {
          // Sort words horizontally left-to-right
          line.words.sort((a, b) => a.rect.left - b.rect.left);
          const totalInLine = line.words.length;

          line.words.forEach((item, indexInLine) => {
            globalWordCounter++;
            words.push({
              el: item.el,
              visual: item.visual,
              original: item.original,
              top: item.rect.top + window.scrollY,
              left: item.rect.left + window.scrollX,
              height: item.rect.height,
              wordIndexInLine: indexInLine,
              totalWordsInLine: totalInLine,
              seed: (globalWordCounter * 41 + indexInLine * 19) >>> 0,
              lastP: -1
            });
          });
        });
      });
      dirty = false;
    };

    const render = () => {
      frame = 0;
      if (dirty) measure();
      const y = window.scrollY;
      const isReduced = media.matches;

      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const isFocused = !isReduced && w.el.closest('a,button') === document.activeElement;

        // Calculate independent progress for this word
        const relTop = w.top - y;
        const rawP = isReduced || isFocused
          ? 1
          : wordProgress(relTop, w.height, viewport, w.wordIndexInLine, w.totalWordsInLine);

        // Quantized 240 steps to prevent micro-renders on subpixel scroll jitter
        const p = Math.round(rawP * 240) / 240;

        if (w.lastP === p) continue;
        w.lastP = p;

        // Opacity: high contrast supporting opacity in transition zone
        const opacity = isReduced || isFocused ? 1 : wordOpacity(p);
        w.el.style.opacity = String(opacity);

        // Decode word character by character
        const decoded = isReduced || isFocused ? w.original : decodeWord(w.original, p, w.seed);
        if (w.visual.textContent !== decoded) {
          w.visual.textContent = decoded;
        }
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
      words.forEach(w => {
        w.lastP = -1;
      });
      schedule();
    };

    const observer = new ResizeObserver(invalidate);
    document.querySelectorAll('[data-editorial-section]').forEach(el => observer.observe(el));
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
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('terminal-content-change', invalidate);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onFocus);
      media.removeEventListener('change', invalidate);
      document.querySelectorAll<HTMLElement>('.ascii-word').forEach(el => {
        el.style.removeProperty('opacity');
        el.style.removeProperty('pointer-events');
      });
    };
  }, []);
}
