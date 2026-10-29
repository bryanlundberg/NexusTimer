import type { Colors } from '@/shared/types/colors'
import { PALETTES, type ColorSchemeMode } from '@/shared/lib/colorScheme'
import { supportsVivid, vividPolarity } from '@/shared/lib/vividColorScheme'
import { defaultSettings } from '@/shared/model/settings/defaultSettings'

/**
 * The tokens are generated after hydration, so first paint would show the CSS
 * default (vivid blue) and then jump. The last painted scheme is cached and
 * replayed by an inline script before anything renders.
 */

export type SavedColorSchemeConfig = {
  key: string
  themeKey: string
  settingsKey: string
  defaultTheme: ColorSchemeMode | 'system'
  defaultColor: Colors
  defaultVivid: boolean
  vividModes: Partial<Record<Colors, ColorSchemeMode>>
}

export const savedColorSchemeConfig: SavedColorSchemeConfig = {
  key: 'color-scheme-cache',
  themeKey: 'theme',
  settingsKey: 'settings-modal-store',
  defaultTheme: 'system',
  defaultColor: defaultSettings.preferences.colorTheme,
  defaultVivid: defaultSettings.preferences.vivid,
  vividModes: Object.fromEntries(
    (Object.keys(PALETTES) as Colors[]).filter(supportsVivid).map((color) => [color, vividPolarity(color)])
  )
}

type SavedColorScheme = { mode: ColorSchemeMode; tokens: Record<string, string> }

export function saveColorScheme(mode: ColorSchemeMode, tokens: Record<string, string>) {
  try {
    const saved: SavedColorScheme = { mode, tokens }
    localStorage.setItem(savedColorSchemeConfig.key, JSON.stringify(saved))
  } catch {}
}

/**
 * Stringified into the inline script, so it must not reference anything outside itself.
 * Runs before next-themes' own script, so a vivid user's theme is pinned to the
 * color's polarity in time for the `.dark` class to be right on first paint.
 */
export function applySavedColorScheme(
  storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
  root: { style: { setProperty(name: string, value: string): void } },
  prefersDark: () => boolean,
  config: SavedColorSchemeConfig
) {
  const settings = storage.getItem(config.settingsKey)
  const preferences = settings ? JSON.parse(settings)?.state?.settings?.preferences : null
  const color = preferences?.colorTheme || config.defaultColor
  const vivid = typeof preferences?.vivid === 'boolean' ? preferences.vivid : config.defaultVivid
  const vividMode = vivid ? config.vividModes[color as Colors] : undefined
  if (vividMode) storage.setItem(config.themeKey, vividMode)

  const raw = storage.getItem(config.key)
  if (!raw) return
  const saved = JSON.parse(raw)
  if (!saved || !saved.tokens) return

  let theme = storage.getItem(config.themeKey) || config.defaultTheme
  if (theme === 'system') theme = prefersDark() ? 'dark' : 'light'
  if (theme !== saved.mode) return

  for (const token in saved.tokens) root.style.setProperty(`--${token}`, saved.tokens[token])
}
