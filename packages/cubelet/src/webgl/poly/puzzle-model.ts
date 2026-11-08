import type { TurnMotion } from '../../geometry/axis-turn-system'
import type { PuzzleDefinition, PuzzleState } from '../../puzzle/puzzle-definition'
import type { Rgb } from '../cube-frame'
import type { GlCubePalette } from '../gl-palette'
import type { PolyMesh } from './poly-mesh'

export interface PuzzleModel3d<TMove, TState extends PuzzleState<TMove>> {
  readonly definition: PuzzleDefinition<TMove, TState>
  mesh(state: TState): PolyMesh
  colorOf(state: TState, colorRef: number, palette: GlCubePalette): Rgb
  motions(move: TMove): readonly TurnMotion[]
}
