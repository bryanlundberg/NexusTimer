import { WCA_CUBE_PALETTE, type FaceletPalette } from '../facelet-palette'

const CUBE_COLOR_OF_FACE = [2, 1, 5, 3] as const

export function pyraminxPalette(cubePalette: FaceletPalette): FaceletPalette {
  return {
    ...cubePalette,
    id: `${cubePalette.id}-pyraminx`,
    colors: CUBE_COLOR_OF_FACE.map((index) => cubePalette.colors[index]!),
    dimColors: CUBE_COLOR_OF_FACE.map((index) => cubePalette.dimColors[index]!)
  }
}

export const WCA_PYRAMINX_PALETTE = pyraminxPalette(WCA_CUBE_PALETTE)
