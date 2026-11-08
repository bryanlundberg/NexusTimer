import type { AxisTurn } from '../geometry/axis-turn-system'
import { FaceletPuzzleDefinition } from '../puzzle/facelet-puzzle-definition'
import type { FaceletPermutation, FaceletState } from '../puzzle/facelet-state'
import { FTO_FACES, FTO_STICKERS_PER_FACE } from './fto-geometry'
import { ftoTurns } from './fto-turn'

export type FtoMove = FaceletPermutation<AxisTurn>
export type FtoState = FaceletState<AxisTurn>

export const fto = new FaceletPuzzleDefinition('fto', FTO_FACES.length, FTO_STICKERS_PER_FACE, ftoTurns)
