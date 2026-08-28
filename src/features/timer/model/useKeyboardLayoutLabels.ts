'use client'
import { useEffect, useState } from 'react'

import { FALLBACK_KEY_LABELS } from './virtualKeymap'

type KeyboardLayoutMap = { get: (code: string) => string | undefined }
type NavigatorWithKeyboard = Navigator & {
  keyboard?: { getLayoutMap?: () => Promise<KeyboardLayoutMap> }
}

let cachedLabels: Record<string, string> | null = null

// Labels every physical key with the character it produces on the active layout,
// so an AZERTY or ES keyboard shows its own legends. Chromium only, hence the fallback.
export function useKeyboardLayoutLabels() {
  const [labels, setLabels] = useState(() => cachedLabels ?? FALLBACK_KEY_LABELS)

  useEffect(() => {
    if (cachedLabels) return

    const keyboard = (navigator as NavigatorWithKeyboard).keyboard
    if (!keyboard?.getLayoutMap) return

    let cancelled = false

    keyboard
      .getLayoutMap()
      .then((layout) => {
        cachedLabels = Object.fromEntries(
          Object.entries(FALLBACK_KEY_LABELS).map(([code, fallback]) => [code, layout.get(code) || fallback])
        )
        if (!cancelled) setLabels(cachedLabels)
      })
      .catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [])

  return labels
}
