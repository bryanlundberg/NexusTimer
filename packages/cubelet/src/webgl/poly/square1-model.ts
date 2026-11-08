import type { TurnMotion } from '../../geometry/axis-turn-system'
import { splitCell, type Cell, type CellFace } from '../../geometry/convex-cells'
import { centroid, type Point } from '../../geometry/triangle-grid'
import { BoundedCache } from '../../shared/bounded-cache'
import { square1 } from '../../square1/square1-definition'
import { BOTTOM_LAYER, TOP_LAYER, layerPieces } from '../../square1/square1-layer-pieces'
import { Square1Color, faceColorOf, sideColorOf } from '../../square1/square1-pieces'
import type { Square1Move, Square1State } from '../../square1/square1-state'
import { BODY_COLOR, buildPolyMesh, type PolyMesh, type PolyPiece } from './poly-mesh'
import type { PuzzleModel3d } from './puzzle-model'

const RIM = 1 / Math.cos(Math.PI / 12)
const CORNER = Math.SQRT2
const MIDDLE = 0.3
const LAYER_INNER = 0.34
const LAYER_OUTER = 1
const SLASH_AXIS: Point = [Math.cos(Math.PI / 12), 0, Math.sin(Math.PI / 12)]
const UP: Point = [0, 1, 0]
const DOWN: Point = [0, -1, 0]
const SIDES_BY_QUADRANT = [Square1Color.Front, Square1Color.Left, Square1Color.Back, Square1Color.Right]

const ground = (degrees: number, distance: number): readonly [number, number] => {
  const radians = (degrees * Math.PI) / 180
  return [-Math.sin(radians) * distance, Math.cos(radians) * distance]
}

interface Outline {
  readonly points: ReadonlyArray<readonly [number, number]>
  readonly edgeColors: readonly number[]
}

const prism = ({ points, edgeColors }: Outline, low: number, high: number, capColor: number, capOnTop: boolean) => {
  const at = ([x, z]: readonly [number, number], y: number): Point => [x, y, z]
  const faces: CellFace[] = [
    { points: points.map((point) => at(point, high)), tag: 0 },
    { points: points.map((point) => at(point, low)).reverse(), tag: 0 }
  ]
  const colors = [capOnTop ? capColor : BODY_COLOR, capOnTop ? BODY_COLOR : capColor]
  points.forEach((point, i) => {
    const next = points[(i + 1) % points.length]!
    faces.push({ points: [at(point, low), at(next, low), at(next, high), at(point, high)], tag: 0 })
    colors.push(edgeColors[i]!)
  })
  return { cell: faces, colorOf: (face: number) => colors[face]! }
}

const layerPrisms = (state: Square1State, first: number): PolyPiece[] => {
  const top = first === TOP_LAYER
  const [low, high] = top ? [LAYER_INNER, LAYER_OUTER] : [-LAYER_OUTER, -LAYER_INNER]
  return layerPieces(state, first).map(({ lead, second, from, leadAtFrom }) => {
    const face = faceColorOf(state.wedgeAt(lead))
    if (second === null) {
      const outline = {
        points: [[0, 0] as const, ground(from, RIM), ground(from + 30, RIM)],
        edgeColors: [BODY_COLOR, sideColorOf(state.wedgeAt(lead)), BODY_COLOR]
      }
      return prism(outline, low, high, face, top)
    }
    const [fromSlot, toSlot] = leadAtFrom ? [lead, second] : [second, lead]
    const outline = {
      points: [[0, 0] as const, ground(from, RIM), ground(from + 30, CORNER), ground(from + 60, RIM)],
      edgeColors: [BODY_COLOR, sideColorOf(state.wedgeAt(fromSlot)), sideColorOf(state.wedgeAt(toSlot)), BODY_COLOR]
    }
    return prism(outline, low, high, face, top)
  })
}

const sideColorFacing = ([x, y, z]: Point): number => {
  if (Math.abs(y!) >= MIDDLE - 1e-9) return BODY_COLOR
  const degrees = (Math.atan2(-x!, z!) * 180) / Math.PI
  return SIDES_BY_QUADRANT[Math.round((((degrees % 360) + 360) % 360) / 90) % 4]!
}

const rotateHalfTurn = ([x, y, z]: Point): Point => {
  const [ax, , az] = SLASH_AXIS as [number, number, number]
  const along = x! * ax + z! * az
  return [2 * along * ax - x!, -y!, 2 * along * az - z!]
}

const middlePieces = (flipped: boolean): PolyPiece[] => {
  const prismCell = prism(
    {
      points: [
        [1, 1],
        [1, -1],
        [-1, -1],
        [-1, 1]
      ],
      edgeColors: [Square1Color.Right, Square1Color.Back, Square1Color.Left, Square1Color.Front]
    },
    -MIDDLE,
    MIDDLE,
    BODY_COLOR,
    true
  ).cell
  const [left, right] = splitCell(prismCell, { normal: SLASH_AXIS, distance: 0 }) as [Cell, Cell]
  return [left, right].map((cell, index) => {
    const colors = cell.map((face) => (face.tag === 0 ? sideColorFacing(centroid(face.points)) : BODY_COLOR))
    const moved = index === 1 && flipped
    return {
      cell: moved ? cell.map((face) => ({ ...face, points: face.points.map(rotateHalfTurn) })) : cell,
      colorOf: (face: number) => colors[face]!
    }
  })
}

const meshes = new BoundedCache<string, PolyMesh>(64)

const halfTurns = (amount: number) => (((amount % 12) + 18) % 12) - 6

const motionsOf = (move: Square1Move): TurnMotion[] => {
  if (move.kind === 'slash') return [{ axis: SLASH_AXIS, above: 0, angle: Math.PI }]
  const motions: TurnMotion[] = []
  const top = halfTurns(move.top)
  const bottom = halfTurns(move.bottom)
  if (top !== 0) motions.push({ axis: UP, above: MIDDLE / 2, angle: (-top * Math.PI) / 6 })
  if (bottom !== 0) motions.push({ axis: DOWN, above: MIDDLE / 2, angle: (-bottom * Math.PI) / 6 })
  return motions
}

export const square1Model3d: PuzzleModel3d<Square1Move, Square1State> = {
  definition: square1,
  mesh: (state) => {
    const key = state.key()
    let mesh = meshes.get(key)
    if (!mesh) {
      mesh = buildPolyMesh([
        ...layerPrisms(state, TOP_LAYER),
        ...layerPrisms(state, BOTTOM_LAYER),
        ...middlePieces(state.middleFlipped)
      ])
      meshes.set(key, mesh)
    }
    return mesh
  },
  colorOf: (_state, colorRef, palette) => palette.colors[colorRef]!,
  motions: motionsOf
}
