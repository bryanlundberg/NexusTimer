import type { Colors } from '@/shared/types/colors'
import {
  AA_TARGET,
  CHART_STEPS,
  DESTRUCTIVE,
  GRAPHIC_TARGET,
  PALETTES,
  ROLES,
  contrastRatio,
  ok,
  toCss,
  type ColorSchemeMode,
  type Oklch
} from '@/shared/lib/colorScheme'

/**
 * Vivid paints the chrome in the accent itself, so the accent can no longer be the
 * primary: primary flips to the text color and every fixed role is pushed away
 * from the background until it clears contrast again.
 */

/** A grey accent painted across the whole surface is just a mid-grey theme. */
const MONOCHROME = new Set<Colors>(['slate', 'gray', 'zinc', 'neutral', 'stone'])

export const supportsVivid = (color: Colors): boolean => !MONOCHROME.has(color)

const RAISED_STEP = 0.04
const SUBTLE_STEP = 0.08

/** Headroom over AA so muted text has a lightness range between the two. */
const TEXT_TARGET = 6

const minContrast = (color: Oklch, surfaces: Oklch[]): number =>
  Math.min(...surfaces.map((surface) => contrastRatio(color, surface)))

const clearing = (color: Oklch, surfaces: Oklch[], target: number, toward: 0 | 1): Oklch => {
  if (minContrast(color, surfaces) >= target) return color

  const at = (l: number): Oklch => ok(l, color.c, color.h)
  let pass: number = toward
  let fail = color.l
  for (let i = 0; i < 20; i++) {
    const mid = (pass + fail) / 2
    if (minContrast(at(mid), surfaces) >= target) pass = mid
    else fail = mid
  }
  return at(pass)
}

const textFor = (seed: Oklch, polarity: ColorSchemeMode): Oklch =>
  polarity === 'dark' ? ok(0.985, Math.min(seed.c * 0.06, 0.02), seed.h) : ok(0.2, Math.min(seed.c * 0.4, 0.08), seed.h)

/** Moves the seed's lightness, never its hue or chroma, until text clears on every surface. */
const vividBase = (seed: Oklch, polarity: ColorSchemeMode): Oklch => {
  const text = textFor(seed, polarity)
  const worst = (l: number): Oklch => ok(polarity === 'dark' ? l + SUBTLE_STEP : l, seed.c, seed.h)
  if (contrastRatio(text, worst(seed.l)) >= TEXT_TARGET) return seed

  let pass = polarity === 'dark' ? 0 : 1 - SUBTLE_STEP
  let fail = seed.l
  for (let i = 0; i < 20; i++) {
    const mid = (pass + fail) / 2
    if (contrastRatio(text, worst(mid)) >= TEXT_TARGET) pass = mid
    else fail = mid
  }
  return ok(pass, seed.c, seed.h)
}

/** Past this drop the accent turns muddy (yellow into olive, amber into brown). */
const MAX_DARKENING = 0.3

/**
 * Light text is preferred because a deep surface is the look vivid is for; only
 * accents that lose their identity when darkened get dark text instead. `dark`
 * means light text, which is what `.dark` variants expect.
 */
export const vividPolarity = (color: Colors): ColorSchemeMode => {
  const seed = (PALETTES[color] ?? PALETTES.indigo).accent.dark
  return seed.l - vividBase(seed, 'dark').l <= MAX_DARKENING ? 'dark' : 'light'
}

/** Keys come back without the leading `--`, like buildColorScheme. */
export const buildVividColorScheme = (color: Colors): Record<string, string> => {
  const spec = PALETTES[color] ?? PALETTES.indigo
  const polarity = vividPolarity(color)
  const toward = polarity === 'dark' ? 1 : 0

  const base = vividBase(spec.accent.dark, polarity)
  const raised = ok(Math.min(base.l + RAISED_STEP, 1), base.c, base.h)
  const subtle = ok(Math.min(base.l + SUBTLE_STEP, 1), base.c, base.h)
  const surfaces = [base, raised, subtle]

  const text = textFor(base, polarity)
  const muted = clearing(ok(base.l, text.c, text.h), surfaces, AA_TARGET, toward)
  const primary = text
  const onPrimary =
    minContrast(base, [primary]) >= AA_TARGET ? base : textFor(base, polarity === 'dark' ? 'light' : 'dark')
  const destructive = clearing(DESTRUCTIVE.dark, surfaces, GRAPHIC_TARGET, toward)

  const role = (seed: Oklch, target: number): string => toCss(clearing(seed, [base, raised], target, toward))
  const roles = Object.fromEntries(
    Object.entries(ROLES).map(([name, value]) => [
      name,
      role(value.dark, name.startsWith('timer-') ? GRAPHIC_TARGET : AA_TARGET)
    ])
  )
  const charts = CHART_STEPS.map(({ dh, l, c }, i) => [
    `chart-${i + 1}`,
    toCss(clearing(ok(l, c, (base.h + dh) % 360), [base, raised], GRAPHIC_TARGET, toward))
  ])

  const textCss = toCss(text)
  const primaryCss = toCss(primary)
  const surfaceCss = toCss(subtle)
  const line = toCss(text, 0.2)

  return {
    background: toCss(base),
    foreground: textCss,
    card: toCss(raised),
    'card-foreground': textCss,
    popover: toCss(raised),
    'popover-foreground': textCss,
    primary: primaryCss,
    'primary-foreground': toCss(onPrimary),
    secondary: surfaceCss,
    'secondary-foreground': textCss,
    muted: surfaceCss,
    'muted-foreground': toCss(muted),
    accent: surfaceCss,
    'accent-foreground': textCss,
    destructive: toCss(destructive),
    'destructive-foreground': toCss(textFor(destructive, polarity === 'dark' ? 'light' : 'dark')),
    ...roles,
    border: line,
    input: toCss(text, 0.25),
    ring: primaryCss,
    ...Object.fromEntries(charts),
    sidebar: toCss(base),
    'sidebar-foreground': textCss,
    'sidebar-primary': primaryCss,
    'sidebar-primary-foreground': toCss(onPrimary),
    'sidebar-accent': toCss(raised),
    'sidebar-accent-foreground': textCss,
    'sidebar-mark': primaryCss,
    'sidebar-border': line,
    'sidebar-ring': primaryCss
  }
}
