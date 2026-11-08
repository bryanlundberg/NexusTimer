import type { AxisTurn } from '../geometry/axis-turn-system'
import { FaceletPuzzleDefinition } from '../puzzle/facelet-puzzle-definition'
import type { FaceletPermutation, FaceletState } from '../puzzle/facelet-state'
import { PYRAMINX_FACES, PYRAMINX_STICKERS_PER_FACE } from './pyraminx-geometry'
import { pyraminxTurns } from './pyraminx-turn'

export type PyraminxMove = FaceletPermutation<AxisTurn>
export type PyraminxState = FaceletState<AxisTurn>

export const pyraminx = new FaceletPuzzleDefinition(
  'pyraminx',
  PYRAMINX_FACES.length,
  PYRAMINX_STICKERS_PER_FACE,
  pyraminxTurns
)
