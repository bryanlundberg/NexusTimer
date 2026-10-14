import { bebasNeue, dseg7, inter, jetbrainsMono, oxanium, pressStart2P, spaceMono } from '@/shared/config/fonts/timer'
import { Settings } from '@/shared/types/Settings'

export type TimerFont = Settings['features']['timerFont']

const NATURAL_CELLS = '[--digit-cell-w:auto]'

export const TIMER_FONTS: Record<TimerFont, { label: string; className: string; preview?: string }> = {
  default: { label: 'Chakra Petch', className: 'font-display' },
  dseg7: { label: 'DSEG7', className: `${dseg7.className} ${NATURAL_CELLS}` },
  inter: { label: 'Inter', className: `${inter.className} tabular-nums ${NATURAL_CELLS}` },
  'jetbrains-mono': { label: 'JetBrains Mono', className: `${jetbrainsMono.className} ${NATURAL_CELLS}` },
  'space-mono': { label: 'Space Mono', className: `${spaceMono.className} ${NATURAL_CELLS}` },
  oxanium: { label: 'Oxanium', className: `${oxanium.className} ${NATURAL_CELLS}` },
  'bebas-neue': { label: 'Bebas Neue', className: `${bebasNeue.className} ${NATURAL_CELLS}` },
  'press-start-2p': {
    label: 'Press Start 2P',
    className: `${pressStart2P.className} ${NATURAL_CELLS}`,
    preview: 'text-[0.625em]'
  }
}

export function timerFontClass(font: TimerFont): string {
  return (TIMER_FONTS[font] ?? TIMER_FONTS.default).className
}
