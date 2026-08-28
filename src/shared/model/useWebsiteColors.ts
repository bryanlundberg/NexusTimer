import { Colors } from '@/shared/types/colors'
import { useTheme } from 'next-themes'
import { useCallback, useEffect } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { buildColorScheme } from '@/shared/lib/colorScheme'

export default function useWebsiteColors() {
  const { resolvedTheme } = useTheme()
  const colorTheme = useSettingsStore((store) => store.settings.preferences.colorTheme)

  const applyColorTheme = useCallback(
    (color: Colors) => {
      if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') return

      const scheme = buildColorScheme(color, resolvedTheme)
      Object.entries(scheme).forEach(([token, value]) => {
        document.documentElement.style.setProperty(`--${token}`, value)
      })
    },
    [resolvedTheme]
  )

  useEffect(() => {
    if (colorTheme) applyColorTheme(colorTheme)
  }, [colorTheme, applyColorTheme])

  return { applyColorTheme }
}
