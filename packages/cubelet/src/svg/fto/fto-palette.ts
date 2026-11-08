import { HEX_COLOR_MIXER, derivedPalette, type ColorMixer } from '../color-mixer'
import { WCA_CUBE_PALETTE, type FaceletPalette } from '../facelet-palette'

export function ftoPalette(cubePalette: FaceletPalette, mixer: ColorMixer): FaceletPalette {
  return derivedPalette('fto', cubePalette, mixer, ({ white, red, green, yellow, orange, blue }, mix) => [
    white,
    green,
    mix.blend(red, blue),
    red,
    blue,
    orange,
    mix.dark(white),
    yellow
  ])
}

export const WCA_FTO_PALETTE = ftoPalette(WCA_CUBE_PALETTE, HEX_COLOR_MIXER)
