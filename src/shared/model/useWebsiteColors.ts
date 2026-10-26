import { Colors } from '@/shared/types/colors'
import { useTheme } from 'next-themes'
import { useCallback, useEffect } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { supportsVivid, vividPolarity } from '@/shared/lib/vividColorScheme'
import { paintColorScheme } from '@/shared/lib/paintColorScheme'

export default function useWebsiteColors() {
  const { resolvedTheme, setTheme } = useTheme()
  const colorTheme = useSettingsStore((store) => store.settings.preferences.colorTheme)
  const vivid = useSettingsStore((store) => store.settings.preferences.vivid)

  const applyColorTheme = useCallback(
    (color: Colors) => {
      if (resolvedTheme !== 'light' && resolvedTheme !== 'dark') return

      if (vivid && supportsVivid(color) && vividPolarity(color) !== resolvedTheme) {
        setTheme(vividPolarity(color))
        return
      }

      paintColorScheme(color, resolvedTheme, vivid)
    },
    [resolvedTheme, setTheme, vivid]
  )

  useEffect(() => {
    if (colorTheme) applyColorTheme(colorTheme)
  }, [colorTheme, applyColorTheme])

  return { applyColorTheme }
}
