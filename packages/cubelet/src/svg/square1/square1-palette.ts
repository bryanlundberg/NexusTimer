import { HEX_COLOR_MIXER, derivedPalette, type ColorMixer } from '../color-mixer'
import { WCA_CUBE_PALETTE, type FaceletPalette } from '../facelet-palette'

export function square1Palette(cubePalette: FaceletPalette, mixer: ColorMixer): FaceletPalette {
  return derivedPalette('square1', cubePalette, mixer, ({ white, red, green, yellow, orange, blue }) => [
    yellow,
    white,
    red,
    green,
    orange,
    blue
  ])
}

export const WCA_SQUARE1_PALETTE = square1Palette(WCA_CUBE_PALETTE, HEX_COLOR_MIXER)
