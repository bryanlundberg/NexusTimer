/**
 * Safe wrapper around the Vibration API.
 * No-ops on unsupported devices (iOS Safari, desktop) and never throws.
 */
export function vibrate(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(pattern)
  } catch {
    // Some browsers throw if called outside a user gesture — ignore.
  }
}

/** Predefined haptic patterns (ms) for consistent feel across the app. */
export const haptics = {
  // Short, crisp tap for the moment the timer turns "ready" to start.
  ready: 35
}
