import type { Colors } from '@/shared/types/colors'
import { buildColorScheme, type ColorSchemeMode } from '@/shared/lib/colorScheme'
import { buildVividColorScheme, supportsVivid } from '@/shared/lib/vividColorScheme'
import { saveColorScheme } from '@/shared/lib/savedColorScheme'

export function paintColorScheme(color: Colors, mode: ColorSchemeMode, vivid: boolean) {
  const scheme = vivid && supportsVivid(color) ? buildVividColorScheme(color) : buildColorScheme(color, mode)
  const root = document.documentElement
  Object.entries(scheme).forEach(([token, value]) => {
    root.style.setProperty(`--${token}`, value)
  })
  saveColorScheme(mode, scheme)
}
