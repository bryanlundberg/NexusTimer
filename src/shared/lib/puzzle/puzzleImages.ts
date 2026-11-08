import { fto } from '@nexustimer/cubelet/fto'
import { megaminx, megaminxStickering } from '@nexustimer/cubelet/megaminx'
import { pyraminx } from '@nexustimer/cubelet/pyraminx'
import { skewb } from '@nexustimer/cubelet/skewb'
import {
  ftoNetLayout,
  megaminxLastLayerLayout,
  megaminxNetLayout,
  pyraminxNetLayout,
  skewbNetLayout
} from '@nexustimer/cubelet/svg'
import { faceletImageRenderer } from '@/shared/lib/puzzle/faceletImageRenderer'
import { NEXUS_CUBE_PALETTE } from '@/shared/lib/puzzle/nexusCubePalette'
import { clockImageRenderer } from '@/shared/lib/puzzle/clockImageRenderer'
import {
  NEXUS_CLOCK_PALETTE,
  NEXUS_FTO_PALETTE,
  NEXUS_MEGAMINX_PALETTE,
  NEXUS_PYRAMINX_PALETTE,
  NEXUS_SQUARE1_PALETTE
} from '@/shared/lib/puzzle/nexusPuzzlePalettes'
import type { PuzzleImageRenderer, PuzzleImageView } from '@/shared/lib/puzzle/puzzleImageRenderer'
import { square1ImageRenderer } from '@/shared/lib/puzzle/square1ImageRenderer'

const RENDERERS: Readonly<Record<string, PuzzleImageRenderer>> = {
  pyraminx: faceletImageRenderer({
    definition: pyraminx,
    palette: () => NEXUS_PYRAMINX_PALETTE,
    views: { net: pyraminxNetLayout }
  }),
  skewb: faceletImageRenderer({
    definition: skewb,
    palette: () => NEXUS_CUBE_PALETTE,
    views: { net: skewbNetLayout }
  }),
  megaminx: faceletImageRenderer({
    definition: megaminx,
    palette: () => NEXUS_MEGAMINX_PALETTE,
    views: { net: megaminxNetLayout, 'last-layer': megaminxLastLayerLayout },
    stickering: megaminxStickering
  }),
  fto: faceletImageRenderer({
    definition: fto,
    palette: () => NEXUS_FTO_PALETTE,
    views: { net: ftoNetLayout }
  }),
  square1: square1ImageRenderer(() => NEXUS_SQUARE1_PALETTE),
  clock: clockImageRenderer(() => NEXUS_CLOCK_PALETTE)
}

export function renderPuzzleImage(
  puzzle: string,
  alg: string,
  view: PuzzleImageView,
  stickering = 'full'
): string | null {
  return RENDERERS[puzzle]?.(alg, view, stickering) ?? null
}
