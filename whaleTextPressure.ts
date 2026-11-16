import type { WakeBody } from './oceanWake';

/** A small pressure zone, in CSS pixels: never a paragraph-wide wave. */
export function textPressureAt(x: number, y: number, wake: { bodies: WakeBody[]; count: number }): number {
  let pressure = 0;
  for (let i = 0; i < wake.count; i++) {
    const body = wake.bodies[i];
    const radius = Math.max(38, Math.min(84, body.r * 1.6));
    const distance = Math.hypot(x - body.x, y - body.y) / radius;
    if (distance >= 1) continue;
    const fall = 1 - distance;
    pressure = Math.max(pressure, fall * fall * (3 - 2 * fall) * body.strength);
  }
  return Math.min(1, pressure);
}

/** Ease into a passage and settle to exact rest, independent of frame rate. */
export function settleTextPressure(current: number, target: number, dt: number): number {
  const next = current + (target - current) * (1 - Math.exp(-Math.max(0, dt) / (target > current ? 0.12 : 0.32)));
  return next < 0.005 && target === 0 ? 0 : next;
}
