import type { AxisTurn } from '../geometry/axis-turn-system'
import { FaceletPuzzleDefinition } from '../puzzle/facelet-puzzle-definition'
import type { FaceletPermutation, FaceletState } from '../puzzle/facelet-state'
import { MEGAMINX_FACES, MEGAMINX_STICKERS_PER_FACE } from './megaminx-geometry'
import { megaminxTurns } from './megaminx-turn'

export type MegaminxMove = FaceletPermutation<AxisTurn>
export type MegaminxState = FaceletState<AxisTurn>

export const megaminx = new FaceletPuzzleDefinition(
  'megaminx',
  MEGAMINX_FACES.length,
  MEGAMINX_STICKERS_PER_FACE,
  megaminxTurns
)
