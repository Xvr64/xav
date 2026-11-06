import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { JOURNEYS, RECOMMENDED_JOURNEY, arrival, enterJourney, type JourneyId } from './journeyEntry';
import { mountArrivalField, type ArrivalField } from './arrivalField';
import { charGlyph, isDecodable } from './terminalMotion';
import './journeyArrival.css';

type Phase = 'choosing' | 'leaving' | 'gone';

const RULE_REST = '· '.repeat(160);
const RULE_INK = '~'.repeat(320);
const DECODE_MS = 520;
const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A line that resolves out of the site's own scramble glyphs (terminalMotion) whenever it wakes. */
function Decoding({ text, active }: { text: string; active: boolean }) {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (!active || reducedMotion()) { setShown(text); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = (now - start) / DECODE_MS;
      if (p >= 1) { setShown(text); return; }
      const state = Math.floor(now / 50) % 7;
      setShown(Array.from(text, (ch, i) =>
        !isDecodable(ch) || p > (i / text.length) * 0.75 + 0.2 ? ch : charGlyph(state, i * 13 + text.length)
      ).join(''));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, text]);
  return (
    <span className="journey-decode">
      <span className="journey-decode-source">{text}</span>
      <span className="journey-decode-visual" aria-hidden="true">{shown}</span>
    </span>
  );
}

/**
 * The arrival: three journeys over the ASCII water, in front of the site. It owns no part of the
 * site's timeline. Choosing calls enterJourney (journeyEntry.ts), the same for all three; this
 * component only lets go of the page and dissolves.
 */
export function JourneyArrival() {
  const [phase, setPhase] = useState<Phase>(arrival.open ? 'choosing' : 'gone');
  const [chosen, setChosen] = useState<JourneyId | null>(null);
  const [hovered, setHovered] = useState<JourneyId | null>(null);
  const [focused, setFocused] = useState<JourneyId | null>(null);
  const [keyboard, setKeyboard] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<ArrivalField | null>(null);
  const buttons = useRef(new Map<JourneyId, HTMLButtonElement>());
  const label = useRef<HTMLParagraphElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const dek = useRef<HTMLParagraphElement>(null);
  const list = useRef<HTMLOListElement>(null);
  /** Where the page had put focus before the arrival took it: the opening's own controls */
  const returnFocus = useRef<HTMLElement | null>(null);
  const present = phase !== 'gone';

  // Follow the choice, whichever way it was made
  useEffect(() => {
    const sync = () => {
      if (arrival.open) return;
      setChosen(arrival.selected);
      setPhase(p => (p === 'choosing' ? 'leaving' : p));
    };
    arrival.listeners.add(sync);
    return () => { arrival.listeners.delete(sync); };
  }, []);

  // While choosing the page behind is inert and holds still; focus waits on the recommended journey.
  // Leaving hands focus back to where the page had put it (the opening's own controls).
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (phase !== 'choosing') { delete html.dataset.arrival; return; }
    const root = document.getElementById('root');
    const previousFocus = document.activeElement as HTMLElement | null;
    if (previousFocus && !previousFocus.closest('.journey-arrival')) returnFocus.current = previousFocus;
    const previousInert = root?.inert ?? false;
    html.dataset.arrival = 'open';
    if (root) root.inert = true;
    const recommended = buttons.current.get(RECOMMENDED_JOURNEY);
    recommended?.focus({ preventScroll: true });
    // A window without focus fires no focus event, but the journey is still where Enter lands
    if (recommended && document.activeElement === recommended) setFocused(RECOMMENDED_JOURNEY);
    return () => { if (root) root.inert = previousInert; };
  }, [phase]);

  // After the commit, not during it: React puts back the focus a commit started with
  useEffect(() => {
    if (phase !== 'leaving') return;
    const target = returnFocus.current;
    if (target?.isConnected && target !== document.body) target.focus({ preventScroll: true });
    else (document.activeElement as HTMLElement | null)?.blur?.();
  }, [phase]);

  // Arrow keys reach the arrival through the gate, never the opening
  useEffect(() => {
    if (phase !== 'choosing') return;
    arrival.onKey = key => {
      const ids = JOURNEYS.map(j => j.id);
      const current = ids.findIndex(id => buttons.current.get(id) === document.activeElement);
      let next = current;
      if (key === 'ArrowDown' || key === 'ArrowRight') next = current < 0 ? 0 : Math.min(ids.length - 1, current + 1);
      else if (key === 'ArrowUp' || key === 'ArrowLeft') next = current < 0 ? ids.length - 1 : Math.max(0, current - 1);
      else if (key === 'Home' || key === 'PageUp') next = 0;
      else if (key === 'End' || key === 'PageDown') next = ids.length - 1;
      else return;
      setKeyboard(true);
      buttons.current.get(ids[next])?.focus();
    };
    return () => { arrival.onKey = null; };
  }, [phase]);

  // The water: one 2D canvas, quiet behind the type
  useEffect(() => {
    if (!present || !canvas.current) return;
    const f = mountArrivalField(canvas.current);
    field.current = f;
    const zones = [label.current, title.current, dek.current, list.current].filter(Boolean) as Element[];
    f.setQuietZones(zones);
    const observer = new ResizeObserver(() => f.refresh());
    zones.forEach(el => observer.observe(el));
    document.fonts?.ready?.then(() => f.refresh(), () => {});
    return () => { observer.disconnect(); f.destroy(); field.current = null; };
  }, [present]);

  const active = hovered ?? focused;
  /** The chosen journey stays lit while the arrival dissolves */
  const lit = chosen ?? active;
  const figure = chosen ?? hovered ?? (keyboard ? focused : null);
  useEffect(() => { field.current?.setMode(figure); }, [figure]);

  // Leaving: the water dissolves and the veil lifts onto the page exactly as it was
  useEffect(() => {
    if (phase !== 'leaving') return;
    field.current?.leave();
    const fallback = window.setTimeout(() => setPhase('gone'), 1800);
    return () => window.clearTimeout(fallback);
  }, [phase]);

  if (!present) return null;
  return createPortal(
    <div
      className="journey-arrival"
      data-phase={phase}
      data-chosen={chosen ?? undefined}
      data-keyboard={keyboard ? '' : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-title"
      aria-describedby="journey-dek"
      aria-hidden={phase === 'leaving' ? true : undefined}
      onAnimationEnd={event => { if (event.animationName === 'journey-arrival-out') setPhase('gone'); }}
      onKeyDown={event => { if (event.key === 'Tab') setKeyboard(true); }}
      onScroll={() => field.current?.refresh()}
    >
      <canvas ref={canvas} className="journey-field" aria-hidden="true" />
      <div className="journey-stage">
        <p ref={label} className="journey-label">
          Xavier Hery <span aria-hidden="true">—</span> An interactive portfolio
        </p>
        <p className="journey-keys" aria-hidden="true">
          <span>↑ ↓</span> to choose <span className="journey-keys-dot">·</span> <span>Enter</span> to begin
        </p>
        <h2 ref={title} id="journey-title" className="journey-title">
          <span className="journey-title-line">Choose your</span>{' '}
          <em className="journey-title-line journey-title-turn">journey.</em>
        </h2>
        <p ref={dek} id="journey-dek" className="journey-dek">Three ways to discover the same story.</p>
        <ol ref={list} className="journey-list" aria-label="Journeys" data-any-active={lit ? '' : undefined}>
          {JOURNEYS.map(journey => (
            <li key={journey.id} className="journey-item">
              <button
                ref={el => { if (el) buttons.current.set(journey.id, el); else buttons.current.delete(journey.id); }}
                type="button"
                className="journey"
                data-journey={journey.id}
                data-active={lit === journey.id ? '' : undefined}
                data-recommended={journey.recommended ? '' : undefined}
                onClick={() => enterJourney(journey.id)}
                onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(journey.id); }}
                onPointerLeave={() => setHovered(h => (h === journey.id ? null : h))}
                onFocus={() => setFocused(journey.id)}
                onBlur={() => setFocused(f => (f === journey.id ? null : f))}
              >
                <span className="journey-index">
                  {journey.index}<span className="journey-slash"> /</span>
                </span>
                <span className="journey-name">{journey.title}</span>
                {journey.recommended && <span className="journey-mark">Recommended</span>}
                <span className="journey-line">
                  <Decoding text={journey.line} active={lit === journey.id} />
                </span>
                <span className="journey-rule" aria-hidden="true">
                  <span className="journey-rule-rest">{RULE_REST}</span>
                  <span className="journey-rule-ink"><span>{RULE_INK}</span></span>
                </span>
                <span className="journey-arrow" aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>,
    document.body
  );
}
