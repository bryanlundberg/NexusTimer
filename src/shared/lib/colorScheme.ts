import type { Colors } from '@/shared/types/colors'

/**
 * Tokens for the 22 selectable themes, generated rather than hand-written: the
 * previous table duplicated ~95% of its values across palettes, which is how it
 * drifted into sub-3:1 foreground pairs and grey themes whose `--primary` was
 * the text color.
 */

export type ColorSchemeMode = 'light' | 'dark'

type Oklch = { l: number; c: number; h: number }

const ok = (l: number, c: number, h: number): Oklch => ({ l, c, h })

const round = (n: number): number => Math.round(n * 1e4) / 1e4

const toCss = ({ l, c, h }: Oklch, alpha?: number): string =>
  alpha === undefined
    ? `oklch(${round(l)} ${round(c)} ${round(h)})`
    : `oklch(${round(l)} ${round(c)} ${round(h)} / ${round(alpha * 100)}%)`

/** Channels are clamped like the browser clamps them, so this matches what gets painted. */
const relativeLuminance = ({ l, c, h }: Oklch): number => {
  const rad = (h * Math.PI) / 180
  const a = c * Math.cos(rad)
  const b = c * Math.sin(rad)
  const lms = [
    (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  ]
  const channel = (m0: number, m1: number, m2: number): number =>
    Math.min(1, Math.max(0, m0 * lms[0] + m1 * lms[1] + m2 * lms[2]))

  return (
    0.2126 * channel(4.0767416621, -3.3077115913, 0.2309699292) +
    0.7152 * channel(-1.2684380046, 2.6097574011, -0.3413193965) +
    0.0722 * channel(-0.0041960863, -0.7034186147, 1.707614701)
  )
}

const contrastRatio = (a: Oklch, b: Oklch): number => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** AA, plus margin so rounding to 4 decimals cannot tip a pair under. */
const AA_TARGET = 4.6

/**
 * Searched rather than picked from two fixed candidates: mid-lightness accents
 * (violet, teal, purple) are too dark for near-white and too light for the usual
 * near-black, and any fixed pair strands them around 4.2:1.
 */
const readableOn = (bg: Oklch): Oklch => {
  const lighter = (l: number): Oklch => ok(l, Math.min(bg.c * 0.06, 0.02), bg.h)
  const darker = (l: number): Oklch => ok(l, Math.min(bg.c * 0.4, 0.08), bg.h)

  const useLighter = contrastRatio(lighter(1), bg) >= contrastRatio(darker(0), bg)
  const candidate = useLighter ? lighter : darker
  const limit = useLighter ? 1 : 0

  if (contrastRatio(candidate(limit), bg) < AA_TARGET) return candidate(limit)

  // Lands on the lightness closest to `bg` that still clears the target, so labels
  // stay in the accent's family instead of snapping to flat black or white.
  let pass = limit
  let fail = bg.l
  for (let i = 0; i < 20; i++) {
    const mid = (pass + fail) / 2
    if (contrastRatio(candidate(mid), bg) >= AA_TARGET) pass = mid
    else fail = mid
  }
  return candidate(pass)
}

type PaletteSpec = {
  accent: Record<ColorSchemeMode, Oklch>
  /** Defaults to a whisper of the accent hue. */
  neutral?: { hue: number; tint: number }
  /** Defaults to the accent hue. */
  chartHue?: number
}

/**
 * Chromatic themes tint their chrome in proportion to how saturated the accent is,
 * so a vivid violet gets richer surfaces than a muted teal. A flat constant washed
 * the dark surfaces out: dark `card` fell from 0.05 to 0.0126 chroma on violet.
 * Dark needs the larger factor because low lightness hides chroma.
 */
const accentTint = (chroma: number, mode: ColorSchemeMode): number =>
  mode === 'dark' ? Math.min(chroma * 6, 1.19) : Math.min(chroma * 2.5, 0.55)

const chromatic = (light: Oklch, dark: Oklch): PaletteSpec => ({ accent: { light, dark } })

/**
 * Grey accent at mid lightness so borders and glows stay visible against both the
 * background and the text. `chartHue` exists because five greys are not a series.
 */
const monochrome = (hue: number, chroma: number, tint: number, chartHue: number): PaletteSpec => ({
  accent: { light: ok(0.55, chroma, hue), dark: ok(0.72, chroma * 0.9, hue) },
  neutral: { hue, tint },
  chartHue
})

const PALETTES: Record<Colors, PaletteSpec> = {
  red: chromatic(ok(0.637, 0.237, 25.331), ok(0.637, 0.237, 25.331)),
  orange: chromatic(ok(0.705, 0.213, 47.604), ok(0.646, 0.222, 41.116)),
  amber: chromatic(ok(0.769, 0.188, 70.08), ok(0.769, 0.188, 70.08)),
  yellow: chromatic(ok(0.795, 0.184, 86.047), ok(0.795, 0.184, 86.047)),
  lime: chromatic(ok(0.768, 0.233, 130.85), ok(0.768, 0.233, 130.85)),
  green: chromatic(ok(0.723, 0.219, 149.579), ok(0.696, 0.17, 162.48)),
  emerald: chromatic(ok(0.696, 0.17, 162.48), ok(0.596, 0.145, 163.225)),
  teal: chromatic(ok(0.704, 0.14, 182.503), ok(0.6, 0.118, 184.704)),
  cyan: chromatic(ok(0.715, 0.143, 215.221), ok(0.609, 0.126, 221.723)),
  sky: chromatic(ok(0.685, 0.169, 237.323), ok(0.588, 0.158, 241.966)),
  blue: chromatic(ok(0.623, 0.214, 259.815), ok(0.546, 0.245, 262.881)),
  indigo: chromatic(ok(0.585, 0.233, 277.117), ok(0.511, 0.262, 276.966)),
  violet: chromatic(ok(0.606, 0.25, 292.717), ok(0.541, 0.281, 293.009)),
  purple: chromatic(ok(0.627, 0.265, 303.9), ok(0.558, 0.288, 302.321)),
  fuchsia: chromatic(ok(0.667, 0.295, 322.15), ok(0.591, 0.293, 322.896)),
  pink: chromatic(ok(0.656, 0.241, 354.308), ok(0.592, 0.249, 0.584)),
  rose: chromatic(ok(0.645, 0.246, 16.439), ok(0.645, 0.246, 16.439)),
  slate: monochrome(258, 0.045, 1, 258),
  gray: monochrome(262, 0.035, 0.7, 262),
  zinc: monochrome(286, 0.016, 0.32, 286),
  neutral: monochrome(0, 0, 0, 264),
  stone: monochrome(65, 0.016, 0.28, 65)
}

/** Chroma of the most tinted ramp (slate); every other theme scales down from it. */
const GREY_CHROMA = 0.046

/** `f` is chroma as a fraction of GREY_CHROMA. */
type Step = { l: number; f: number; a?: number }

type StepKey = 'base' | 'raised' | 'faint' | 'subtle' | 'line' | 'input' | 'text' | 'strongText' | 'mutedText'

const RAMPS: Record<ColorSchemeMode, Record<StepKey, Step>> = {
  light: {
    base: { l: 1, f: 0 },
    raised: { l: 1, f: 0 },
    faint: { l: 0.985, f: 0.07 },
    subtle: { l: 0.968, f: 0.15 },
    line: { l: 0.925, f: 0.28 },
    input: { l: 0.925, f: 0.28 },
    text: { l: 0.145, f: 0.91 },
    strongText: { l: 0.21, f: 0.91 },
    mutedText: { l: 0.553, f: 1 }
  },
  dark: {
    base: { l: 0.141, f: 0.91 },
    raised: { l: 0.209, f: 0.91 },
    faint: { l: 0.209, f: 0.91 },
    subtle: { l: 0.279, f: 0.89 },
    // Translucent so one value works over both background and card.
    line: { l: 1, f: 0, a: 0.1 },
    input: { l: 1, f: 0, a: 0.15 },
    text: { l: 0.985, f: 0.07 },
    strongText: { l: 0.985, f: 0.07 },
    mutedText: { l: 0.708, f: 0.87 }
  }
}

/** Fixed across themes: a warning that shifts hue stops reading as one. */
const DESTRUCTIVE: Record<ColorSchemeMode, Oklch> = {
  light: ok(0.577, 0.245, 27.325),
  dark: ok(0.704, 0.191, 22.216)
}

/** Lightness alternates so neighbouring series stay separable without relying on hue. */
const CHART_STEPS = [
  { dh: 0, l: 0.66, c: 0.18 },
  { dh: 72, l: 0.72, c: 0.15 },
  { dh: 144, l: 0.6, c: 0.16 },
  { dh: 216, l: 0.75, c: 0.14 },
  { dh: 288, l: 0.64, c: 0.19 }
]

const buildChartRamp = (hue: number, mode: ColorSchemeMode): string[] =>
  CHART_STEPS.map(({ dh, l, c }) => toCss(ok(mode === 'dark' ? l + 0.05 : l, c, (hue + dh) % 360)))

/** Keys come back without the leading `--`. */
export const buildColorScheme = (color: Colors, mode: ColorSchemeMode): Record<string, string> => {
  const spec = PALETTES[color] ?? PALETTES.violet
  const accent = spec.accent[mode]
  const { hue, tint } = spec.neutral ?? { hue: accent.h, tint: accentTint(accent.c, mode) }
  const ramp = RAMPS[mode]

  const grey = (step: Step): string => toCss(ok(step.l, GREY_CHROMA * step.f * tint, hue), step.a)

  const onAccent = toCss(readableOn(accent))
  const accentCss = toCss(accent)
  const surface = grey(ramp.subtle)
  const onSurface = grey(ramp.strongText)
  const text = grey(ramp.text)
  const line = grey(ramp.line)
  const [chart1, chart2, chart3, chart4, chart5] = buildChartRamp(spec.chartHue ?? accent.h, mode)

  return {
    background: grey(ramp.base),
    foreground: text,
    card: grey(ramp.raised),
    'card-foreground': text,
    popover: grey(ramp.raised),
    'popover-foreground': text,
    primary: accentCss,
    'primary-foreground': onAccent,
    secondary: surface,
    'secondary-foreground': onSurface,
    muted: surface,
    'muted-foreground': grey(ramp.mutedText),
    accent: surface,
    'accent-foreground': onSurface,
    destructive: toCss(DESTRUCTIVE[mode]),
    'destructive-foreground': toCss(readableOn(DESTRUCTIVE[mode])),
    border: line,
    input: grey(ramp.input),
    ring: accentCss,
    'chart-1': chart1,
    'chart-2': chart2,
    'chart-3': chart3,
    'chart-4': chart4,
    'chart-5': chart5,
    sidebar: grey(ramp.faint),
    'sidebar-foreground': text,
    'sidebar-primary': accentCss,
    'sidebar-primary-foreground': onAccent,
    'sidebar-accent': surface,
    'sidebar-accent-foreground': onSurface,
    'sidebar-border': line,
    'sidebar-ring': accentCss
  }
}
