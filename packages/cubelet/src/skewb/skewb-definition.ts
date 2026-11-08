import type { AxisTurn } from '../geometry/axis-turn-system'
import { FaceletPuzzleDefinition } from '../puzzle/facelet-puzzle-definition'
import type { FaceletPermutation, FaceletState } from '../puzzle/facelet-state'
import { SKEWB_FACES, SKEWB_STICKERS_PER_FACE } from './skewb-geometry'
import { skewbTurns } from './skewb-turn'

export type SkewbMove = FaceletPermutation<AxisTurn>
export type SkewbState = FaceletState<AxisTurn>

export const skewb = new FaceletPuzzleDefinition('skewb', SKEWB_FACES.length, SKEWB_STICKERS_PER_FACE, skewbTurns)
