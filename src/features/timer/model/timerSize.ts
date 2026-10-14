export const TIMER_SIZE = { min: 70, max: 200, step: 10 }

export const TIMER_MAX_VIEWPORT_HEIGHT = 0.4

export function timerScale(size: number): string {
  return String(Math.min(TIMER_SIZE.max, Math.max(TIMER_SIZE.min, size)) / 100)
}
