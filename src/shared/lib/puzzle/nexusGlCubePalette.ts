import type { CssCubePalette } from '@nexustimer/cubelet/webgl'
import { NEXUS_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusCubePalette'

const PLASTIC = '#0e0e0e'

export const NEXUS_GL_CUBE_PALETTE: CssCubePalette = {
  colors: NEXUS_CUBE_PALETTE.colors,
  dimColors: NEXUS_CUBE_PALETTE.colors.map((color) => `color-mix(in oklab, ${color} 40%, ${PLASTIC})`),
  ignored: '#666666',
  body: PLASTIC
}
