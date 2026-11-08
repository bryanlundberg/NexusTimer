import type { AxisTurn, AxisTurnSystem } from '../../geometry/axis-turn-system'
import { convexPolytope, cutCells, type Plane } from '../../geometry/convex-cells'
import type { StickerCentroids } from '../../geometry/rotation-permutation'
import { centroid } from '../../geometry/triangle-grid'
import type { FaceletPermutation, FaceletState } from '../../puzzle/facelet-state'
import type { PuzzleDefinition } from '../../puzzle/puzzle-definition'
import { BODY_COLOR, buildPolyMesh, type PolyMesh } from './poly-mesh'
import type { PuzzleModel3d } from './puzzle-model'

export interface FaceletModelSpec {
  readonly definition: PuzzleDefinition<FaceletPermutation<AxisTurn>, FaceletState<AxisTurn>>
  readonly turns: AxisTurnSystem
  readonly centroids: () => StickerCentroids
  readonly faces: () => readonly Plane[]
  readonly cuts: () => readonly Plane[]
}

export function faceletModel3d({
  definition,
  turns,
  centroids,
  faces,
  cuts
}: FaceletModelSpec): PuzzleModel3d<FaceletPermutation<AxisTurn>, FaceletState<AxisTurn>> {
  let mesh: PolyMesh | undefined
  const build = (): PolyMesh => {
    const stickers = centroids()
    const cells = cutCells(convexPolytope(faces()), cuts()).filter((cell) => cell.some((face) => face.tag >= 0))
    return buildPolyMesh(
      cells.map((cell) => ({
        cell,
        colorOf: (faceIndex) => {
          const face = cell[faceIndex]!
          return face.tag >= 0 ? stickers.indexOf(centroid(face.points)) : BODY_COLOR
        }
      }))
    )
  }
  return {
    definition,
    mesh: () => (mesh ??= build()),
    colorOf: (state, colorRef, palette) => palette.colors[state.colorAt(colorRef)]!,
    motions: (move) => (move.turn.turns === 0 ? [] : [turns.motion(move.turn)])
  }
}
