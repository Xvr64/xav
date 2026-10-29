import React, { useEffect } from 'react';
import { decodeWord, lineProgress } from './terminalMotion';
import './terminal.css';

/** Original text reserves every word's exact geometry and remains accessible.
 * Only the absolutely positioned, aria-hidden duplicate is ever mutated. */
export function AsciiText({ text, className = '' }: { text: string; className?: string }) {
  useEffect(() => {
    window.dispatchEvent(new Event('terminal-content-change'));
  }, [text]);
  return <span className={`ascii-text ${className}`} data-ascii-text>
    {text.split(/(\s+)/).map((word, index) => /^\s+$/.test(word)
      ? <React.Fragment key={index}>{word}</React.Fragment>
      : <span className="ascii-word" key={index}>
          <span className="ascii-source">{word}</span>
          <span className="ascii-visual" aria-hidden="true" data-word={word}>{word}</span>
        </span>)}
  </span>;
}

export function useEditorialScroll() {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let dirty = true;
    let disposed = false;
    let viewport = window.innerHeight;
    type Line = { top: number; height: number; words: HTMLElement[]; last: number };
    let lines: Line[] = [];
    const measure = () => {
      viewport = window.innerHeight;
      lines = [];
      document.querySelectorAll<HTMLElement>('[data-editorial-section] [data-ascii-text]').forEach(text => {
        if (text.closest('[data-ascii-preserve]')) return;
        let line: Line | undefined;
        text.querySelectorAll<HTMLElement>('.ascii-word').forEach(word => {
          const rect = word.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (!line || Math.abs(line.top - top) > 2) {
            line = { top, height: rect.height, words: [], last: -1 };
            lines.push(line);
          }
          line.words.push(word);
        });
      });
      dirty = false;
    };
    const render = () => {
      frame = 0;
      if (dirty) measure();
      const y = window.scrollY;
      lines.forEach(line => {
        const focused = line.words.some(word => word.closest('a,button') === document.activeElement);
        const p = media.matches || focused ? 1 : Math.round(lineProgress(line.top - y, line.height, viewport) * 180) / 180;
        if (line.last === p) return;
        line.last = p;
        line.words.forEach((word, index) => {
          const visual = word.querySelector<HTMLElement>('.ascii-visual')!;
          const original = visual.dataset.word || '';
          const decoded = decodeWord(original, p, index);
          word.style.opacity = String(p);
          if (visual.textContent !== decoded) visual.textContent = decoded;
        });
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const invalidate = () => { dirty = true; schedule(); };
    const onFocus = () => { lines.forEach(line => { line.last = -1; }); schedule(); };
    const observer = new ResizeObserver(invalidate);
    document.querySelectorAll('[data-editorial-section]').forEach(el => observer.observe(el));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', invalidate);
    window.addEventListener('terminal-content-change', invalidate);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onFocus);
    media.addEventListener('change', invalidate);
    document.fonts.ready.then(() => { if (!disposed) invalidate(); });
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
