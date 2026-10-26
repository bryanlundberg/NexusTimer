import { contrastRatio } from '@/shared/lib/colorScheme'
import { buildVividColorScheme, vividPolarity } from '@/shared/lib/vividColorScheme'
import type { Colors } from '@/shared/types/colors'

const CHROMATIC: Colors[] = [
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
  'rose'
]
const THEMES: Colors[] = [...CHROMATIC, 'slate', 'gray', 'zinc', 'neutral', 'stone']

const TEXT_ROLES = ['record', 'faster', 'slower', 'success', 'warning']
const TIMER_ROLES = ['timer-holding', 'timer-ready', 'timer-inspect']
const CHARTS = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']

const parse = (css: string) => {
  const match = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(css)
  if (!match) throw new Error(`Unexpected color ${css}`)
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) }
}

const ratio = (scheme: Record<string, string>, a: string, b: string) =>
  contrastRatio(parse(scheme[a]), parse(scheme[b]))

describe('buildVividColorScheme', () => {
  it.each(THEMES)('keeps body text readable on every %s surface', (theme) => {
    const scheme = buildVividColorScheme(theme)

    for (const text of ['foreground', 'muted-foreground']) {
      for (const surface of ['background', 'card', 'muted']) {
        expect(ratio(scheme, text, surface), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it.each(THEMES)('keeps %s primary distinct from the vivid surface', (theme) => {
    const scheme = buildVividColorScheme(theme)

    expect(ratio(scheme, 'primary', 'primary-foreground')).toBeGreaterThanOrEqual(4.5)
    expect(ratio(scheme, 'primary', 'background')).toBeGreaterThanOrEqual(3)
    expect(ratio(scheme, 'primary', 'card')).toBeGreaterThanOrEqual(3)
    expect(ratio(scheme, 'sidebar-primary', 'sidebar-primary-foreground')).toBeGreaterThanOrEqual(4.5)
    for (const surface of ['sidebar', 'sidebar-accent']) {
      expect(ratio(scheme, 'sidebar-mark', surface)).toBeGreaterThanOrEqual(3)
      expect(ratio(scheme, 'sidebar-foreground', surface)).toBeGreaterThanOrEqual(4.5)
    }
  })

  it.each(THEMES)('keeps role colors readable on %s', (theme) => {
    const scheme = buildVividColorScheme(theme)

    for (const role of TEXT_ROLES) {
      for (const surface of ['background', 'card']) {
        expect(ratio(scheme, role, surface), `${role} on ${surface}`).toBeGreaterThanOrEqual(4.5)
      }
    }
    expect(ratio(scheme, 'destructive', 'destructive-foreground')).toBeGreaterThanOrEqual(4.5)
    expect(Math.abs(parse(scheme.destructive).l - parse(scheme.foreground).l)).toBeGreaterThanOrEqual(0.05)
    for (const role of ['destructive', ...TIMER_ROLES, ...CHARTS]) {
      expect(ratio(scheme, role, 'background'), role).toBeGreaterThanOrEqual(3)
    }
    for (const chart of CHARTS) {
      expect(ratio(scheme, chart, 'card'), `${chart} on card`).toBeGreaterThanOrEqual(3)
    }
  })

  it.each(CHROMATIC)('paints the %s surface in the accent instead of a grey', (theme) => {
    expect(parse(buildVividColorScheme(theme).background).c).toBeGreaterThanOrEqual(0.1)
  })

  it.each(THEMES)('reports the %s polarity that matches its text', (theme) => {
    const scheme = buildVividColorScheme(theme)
    const textIsLighter = parse(scheme.foreground).l > parse(scheme.background).l

    expect(vividPolarity(theme)).toBe(textIsLighter ? 'dark' : 'light')
  })
})
