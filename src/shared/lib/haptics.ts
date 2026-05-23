/**
 * Safe wrapper around the Vibration API.
 * No-ops on unsupported devices (iOS Safari, desktop) and never throws.
 */
export const HAPTIC_DURATION_MS = 5
export const HAPTIC_DURATION_READY_MS = 80

export function vibrate(duration: number = HAPTIC_DURATION_MS) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(duration)
  } catch {
    // Some browsers throw if called outside a user gesture — ignore.
  }
}
