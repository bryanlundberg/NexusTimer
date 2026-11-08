import { HEX_COLOR_MIXER, derivedPalette, type ColorMixer } from '../color-mixer'
import { WCA_CUBE_PALETTE, type FaceletPalette } from '../facelet-palette'

export function megaminxPalette(cubePalette: FaceletPalette, mixer: ColorMixer): FaceletPalette {
  return derivedPalette('megaminx', cubePalette, mixer, ({ white, red, green, yellow, orange, blue }, mix) => {
    const upper = [white, green, red, blue, yellow, mix.blend(red, blue)]
    const lower = [mix.dark(white), ...upper.slice(1, 5).map((color) => mix.light(color)), orange]
    return [...upper, ...lower]
  })
}

export const WCA_MEGAMINX_PALETTE = megaminxPalette(WCA_CUBE_PALETTE, HEX_COLOR_MIXER)
