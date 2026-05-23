'use client'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { vibrate } from '@/shared/lib/haptics'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function triggerHaptic() {
  if (prefersReducedMotion()) return
  if (!useSettingsStore.getState().settings.features.haptics) return
  vibrate()
}
