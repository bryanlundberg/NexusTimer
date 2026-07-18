import { convert } from 'colorizr'

export interface ChartTheme {
  background: string
  text: string
  grid: string
}

/** Reads the current CSS-variable palette so lightweight-charts matches the app theme. */
export function readChartTheme(): ChartTheme {
  const root = document.documentElement
  const toRgb = (v: string, fallback: string) => {
    try {
      return convert(getComputedStyle(root).getPropertyValue(v), 'rgb')
    } catch {
      return fallback
    }
  }
  return {
    background: toRgb('--background', 'rgba(0,0,0,0)'),
    text: toRgb('--muted-foreground', '#888'),
    grid: 'rgba(120,120,120,0.08)'
  }
}

/** Converts a #rrggbb hex to an rgba() string with the given alpha. */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
