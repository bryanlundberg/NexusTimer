import { useCallback } from 'react'
import { useTheme } from 'next-themes'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { supportsVivid, vividPolarity } from '@/shared/lib/vividColorScheme'
import { paintColorScheme } from '@/shared/lib/paintColorScheme'

export type ThemeChoice = 'light' | 'dark' | 'vivid'

const SWITCHING_CLASS = 'theme-switching'

/**
 * next-themes swaps the class in an effect and the tokens follow in another, both
 * after the view transition has taken its snapshot. Painting synchronously inside
 * the callback is what lets the reveal show the new theme instead of jumping after.
 */
export function useThemeSwitch() {
  const { setTheme } = useTheme()
  const colorTheme = useSettingsStore((store) => store.settings.preferences.colorTheme)
  const vivid = useSettingsStore((store) => store.settings.preferences.vivid)
  const updateSetting = useSettingsStore((store) => store.updateSetting)

  return useCallback(
    (choice: ThemeChoice, origin: { x: number; y: number }) => {
      const nextVivid = choice === 'vivid' && supportsVivid(colorTheme)
      const mode = choice === 'vivid' ? vividPolarity(colorTheme) : choice
      const root = document.documentElement

      const commit = () => {
        root.classList.remove('light', 'dark')
        root.classList.add(mode)
        root.style.colorScheme = mode
        paintColorScheme(colorTheme, mode, nextVivid)
        if (vivid !== nextVivid) updateSetting('preferences.vivid', nextVivid)
        setTheme(mode)
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduceMotion) {
        commit()
        return
      }

      root.classList.add(SWITCHING_CLASS)
      const transition = document.startViewTransition(commit)
      transition.ready
        .then(() => {
          const radius = Math.hypot(
            Math.max(origin.x, window.innerWidth - origin.x),
            Math.max(origin.y, window.innerHeight - origin.y)
          )
          root.animate(
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${radius}px at ${origin.x}px ${origin.y}px)`
              ]
            },
            { duration: 450, easing: 'cubic-bezier(0.2, 0, 0, 1)', pseudoElement: '::view-transition-new(root)' }
          )
        })
        .catch(() => {})
      transition.finished.finally(() => root.classList.remove(SWITCHING_CLASS))
    },
    [colorTheme, vivid, updateSetting, setTheme]
  )
}
