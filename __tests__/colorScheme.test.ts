import { buildColorScheme, contrastRatio, type ColorSchemeMode } from '@/shared/lib/colorScheme'
import type { Colors } from '@/shared/types/colors'

const THEMES: Colors[] = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone'
]
const MODES: ColorSchemeMode[] = ['light', 'dark']

const TEXT_ROLES = ['record', 'faster', 'slower', 'success', 'warning']
const TIMER_ROLES = ['timer-holding', 'timer-ready', 'timer-inspect']

const parse = (css: string) => {
  const match = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(css)
  if (!match) throw new Error(`Unexpected color ${css}`)
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) }
}

describe('buildColorScheme roles', () => {
  it.each(THEMES.flatMap((theme) => MODES.map((mode) => [theme, mode] as const)))(
    'keeps role colors readable on %s %s',
    (theme, mode) => {
      const scheme = buildColorScheme(theme, mode)
      const surfaces = [scheme.background, scheme.card].map(parse)

      for (const role of TEXT_ROLES) {
        for (const surface of surfaces) {
          expect(contrastRatio(parse(scheme[role]), surface), role).toBeGreaterThanOrEqual(4.5)
        }
      }
      for (const role of TIMER_ROLES) {
        expect(contrastRatio(parse(scheme[role]), parse(scheme.background)), role).toBeGreaterThanOrEqual(3)
      }
    }
  )
})
