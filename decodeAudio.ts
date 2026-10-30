/**
 * Decoding sound: short, dry, synthesized keyboard ticks that follow the scroll-driven character
 * decode. Nothing here keeps time of its own. The scroll controller reports how many characters
 * changed in each rendered frame, and a gate turns that activity into at most a dozen or so quiet
 * clicks per second, playing them now or not at all, so nothing queues up behind a fast scroll
 * and nothing sounds once the page is still.
 */

/** Shortest gap between two clicks (≈ 13 per second at most). */
export const CLICK_GAP_MS = 76;
/** Character changes needed before a click: a pixel of scroll jitter flipping one glyph stays silent. */
export const MIN_ACTIVITY = 3;
/** Activity carried between frames is capped, so one click never stands for a backlog. */
const MAX_PENDING = 48;

export type Click = { strength: number; lock: boolean; exiting: boolean; variant: number };

/**
 * Pure timing policy (time is passed in). Groups the character changes of near-simultaneous
 * frames into single clicks, rate-limits them with a slightly irregular gap, and drops anything
 * it cannot play immediately. A frame without changes clears what was pending.
 */
export class ClickGate {
  private pending = 0;
  private pendingLocks = 0;
  private nextAt = -Infinity;
  private count = 0;

  offer(now: number, changes: number, locks: number, exiting: boolean): Click | null {
    if (changes <= 0) {
      this.pending = 0;
      this.pendingLocks = 0;
      return null;
    }
    this.pending = Math.min(MAX_PENDING, this.pending + changes);
    this.pendingLocks = Math.min(MAX_PENDING, this.pendingLocks + locks);
    if (now < this.nextAt || this.pending < MIN_ACTIVITY) return null;

    const n = this.count++;
    // Deterministic irregularity: the gap breathes between ~0.85× and ~1.25× so a steady scroll
    // never settles into a mechanical metronome.
    const breathe = 0.85 + 0.4 * (((n * 0.6180339887) % 1 + 1) % 1);
    this.nextAt = now + CLICK_GAP_MS * breathe;
    const click: Click = {
      strength: Math.min(1, 0.45 + Math.log2(1 + this.pending) / 9),
      lock: this.pendingLocks > 0,
      exiting,
      variant: n
    };
    this.pending = 0;
    this.pendingLocks = 0;
    return click;
  }

  reset() {
    this.pending = 0;
    this.pendingLocks = 0;
    this.nextAt = -Infinity;
  }
}

// --- Web Audio engine --------------------------------------------------------------------------

/** Peak level of the whole effect: quiet feedback, never louder than the page's reading. */
const MASTER_GAIN = 0.16;
/** Clicks sounding at once; extra ones are dropped, never stacked. */
const MAX_VOICES = 3;
const VARIANTS = 6;

type Engine = { ctx: AudioContext; master: GainNode; buffers: AudioBuffer[]; voices: number };

let engine: Engine | null = null;
let enabled = false;
const gate = new ClickGate();
const listeners = new Set<(on: boolean) => void>();

const notify = () => listeners.forEach((listener) => listener(enabled));

/** Seeded noise so every visit hears the same small family of clicks. */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296 - 0.5;
  };
}

/**
 * One key tick, rendered once into a buffer: a brief high-passed noise transient (the keycap)
 * over a faint, fast-decaying tone (the digital body). ~16 ms, no tail.
 */
function renderClick(ctx: AudioContext, variant: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.round(rate * 0.016);
  const buffer = ctx.createBuffer(1, length, rate);
  const data = buffer.getChannelData(0);
  const noise = lcg(0x5eed + variant * 977);
  const tone = 1750 + variant * 260;
  const noiseDecay = 0.0011 + (variant % 3) * 0.0004;
  const toneDecay = 0.0026 + (variant % 2) * 0.0008;
  let previous = 0;
  let peak = 0;
  for (let i = 0; i < length; i++) {
    const t = i / rate;
    const white = noise();
    const high = white - previous; // first difference: keeps the transient crisp, drops the hiss body
    previous = white;
    const attack = Math.min(1, i / 6);
    const sample =
      attack * (high * Math.exp(-t / noiseDecay) + 0.32 * Math.sin(2 * Math.PI * tone * t) * Math.exp(-t / toneDecay));
    data[i] = sample;
    peak = Math.max(peak, Math.abs(sample));
  }
  for (let i = 0; i < length; i++) data[i] /= peak || 1;
  // A short fade at the end so the buffer never stops on a step.
  for (let i = 0; i < 24 && i < length; i++) data[length - 1 - i] *= i / 24;
  return buffer;
}

function createEngine(): Engine | null {
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  const ctx = new Ctor({ latencyHint: 'interactive' });
  const master = ctx.createGain();
  master.gain.value = 0;
  // Takes the edge off the transient: soft and precise rather than sharp.
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 7200;
  tone.Q.value = 0.5;
  master.connect(tone).connect(ctx.destination);
  const buffers = Array.from({ length: VARIANTS }, (_, i) => renderClick(ctx, i));
  return { ctx, master, buffers, voices: 0 };
}

function play(click: Click) {
  const e = engine;
  if (!e || e.ctx.state !== 'running' || e.voices >= MAX_VOICES) return;
  const source = e.ctx.createBufferSource();
  source.buffer = e.buffers[click.variant % VARIANTS];
  // Slight pitch drift per click; leaving the reading zone sits a little lower and softer.
  const drift = ((click.variant * 0.7548776662) % 1) * 0.1 - 0.05;
  source.playbackRate.value = (click.exiting ? 0.86 : 1) + drift;
  const voice = e.ctx.createGain();
  voice.gain.value = click.strength * (click.lock ? 1 : 0.72) * (click.exiting ? 0.8 : 1);
  source.connect(voice).connect(e.master);
  e.voices++;
  source.onended = () => {
    e.voices--;
    source.disconnect();
    voice.disconnect();
  };
  source.start();
}

/**
 * Called by the scroll controller for every frame in which the scroll position moved, with the
 * number of character state changes and letter locks that frame produced.
 */
export function noteDecodeActivity(changes: number, locks: number, exiting: boolean) {
  if (!enabled) return;
  const click = gate.offer(performance.now(), changes, locks, exiting);
  if (click) play(click);
}

export const decodeSoundEnabled = () => enabled;

/**
 * A sonar ping for a click in open water: a soft sine with a slight downward glide, then one
 * quieter, lower return. Only ever heard while the visitor has turned sound on; it goes through
 * the same master gain as the keyboard ticks, so muting silences it at once.
 */
export function playSonarPing() {
  const e = engine;
  if (!enabled || !e || e.ctx.state !== 'running') return;
  const now = e.ctx.currentTime;
  const tone = (at: number, freq: number, peak: number, length: number) => {
    const osc = e.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + at);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.93, now + at + length);
    const gain = e.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now + at);
    gain.gain.exponentialRampToValueAtTime(peak, now + at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + at + length);
    osc.connect(gain).connect(e.master);
    osc.start(now + at);
    osc.stop(now + at + length + 0.02);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  };
  tone(0, 1180, 0.32, 1.4);
  tone(0.42, 1040, 0.1, 1.1);
}

export function onDecodeSoundChange(listener: (on: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Must run inside a user gesture. Resolves to whether sound can actually play. */
export async function enableDecodeSound(): Promise<boolean> {
  try {
    engine ??= createEngine();
    if (!engine) return false;
    await engine.ctx.resume();
    if (engine.ctx.state !== 'running') return false;
    engine.master.gain.cancelScheduledValues(engine.ctx.currentTime);
    engine.master.gain.setTargetAtTime(MASTER_GAIN, engine.ctx.currentTime, 0.02);
    gate.reset();
    enabled = true;
    notify();
    return true;
  } catch {
    enabled = false;
    notify();
    return false;
  }
}

/** Mutes at once; the context is suspended so nothing runs while the sound is off. */
export function disableDecodeSound() {
  enabled = false;
  gate.reset();
  notify();
  const e = engine;
  if (!e) return;
  e.master.gain.cancelScheduledValues(e.ctx.currentTime);
  e.master.gain.setValueAtTime(0, e.ctx.currentTime);
  e.ctx.suspend().catch(() => undefined);
}

/** A hidden page holds the context suspended; it resumes only if the visitor had sound on. */
export function syncDecodeSoundVisibility(hidden: boolean) {
  const e = engine;
  if (!e) return;
  if (hidden) e.ctx.suspend().catch(() => undefined);
  else if (enabled) {
    e.ctx.resume().then(
      () => {
        if (e.ctx.state !== 'running' && enabled) disableDecodeSound();
      },
      () => disableDecodeSound()
    );
  }
}

export function disposeDecodeSound() {
  enabled = false;
  gate.reset();
  const e = engine;
  engine = null;
  if (e) e.ctx.close().catch(() => undefined);
  notify();
}
