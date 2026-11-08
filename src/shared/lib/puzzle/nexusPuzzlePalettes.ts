import {
  clockPalette,
  ftoPalette,
  megaminxPalette,
  pyraminxPalette,
  square1Palette,
  type ColorMixer
} from '@nexustimer/cubelet/svg'
import { NEXUS_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusCubePalette'

const mix = (first: string, percent: number, second: string) => `color-mix(in oklab, ${first} ${percent}%, ${second})`

const CSS_COLOR_MIXER: ColorMixer = {
  id: 'css',
  light: (color) => mix(color, 55, 'white'),
  dark: (color) => mix(color, 55, '#27272a'),
  blend: (first, second) => mix(first, 50, second),
  dim: (color) => mix(color, 35, 'transparent')
}

export const NEXUS_PYRAMINX_PALETTE = pyraminxPalette(NEXUS_CUBE_PALETTE)
export const NEXUS_MEGAMINX_PALETTE = megaminxPalette(NEXUS_CUBE_PALETTE, CSS_COLOR_MIXER)
export const NEXUS_FTO_PALETTE = ftoPalette(NEXUS_CUBE_PALETTE, CSS_COLOR_MIXER)
export const NEXUS_SQUARE1_PALETTE = square1Palette(NEXUS_CUBE_PALETTE, CSS_COLOR_MIXER)
export const NEXUS_CLOCK_PALETTE = clockPalette(NEXUS_CUBE_PALETTE, CSS_COLOR_MIXER)
