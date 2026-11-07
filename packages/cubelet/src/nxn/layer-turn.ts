import type { MoveNode } from '../notation/ast'
import { FACE_BY_NAME, type Axis, type FaceName } from './faces'

export interface LayerTurn {
  readonly axis: Axis
  readonly from: number
  readonly to: number
  readonly quarterTurns: 0 | 1 | 2 | 3
}

const ROTATION_FACES: Readonly<Record<string, FaceName>> = { x: 'R', y: 'U', z: 'F' }
const SLICE_FACES: Readonly<Record<string, FaceName>> = { M: 'L', E: 'D', S: 'F' }
const INNER_SLICE_FACES: Readonly<Record<string, FaceName>> = { m: 'L', e: 'D', s: 'F' }
const FACE_NAMES = new Set<string>(['U', 'R', 'F', 'D', 'L', 'B'])

interface LayerSpan {
  readonly face: FaceName
  readonly first: number
  readonly last: number
}

const hasLayers = (move: MoveNode): boolean => move.innerLayer !== undefined || move.outerLayer !== undefined

const faceSpan = (move: MoveNode, size: number): LayerSpan | null => {
  const { family } = move
  const upper = family.toUpperCase()
  const wideSuffix = family.length === 2 && family[1] === 'w' && FACE_NAMES.has(family[0]!)
  const lowercase = family.length === 1 && family !== upper && FACE_NAMES.has(upper)
  const plain = family.length === 1 && FACE_NAMES.has(family)
  if (!wideSuffix && !lowercase && !plain) return null

  const face = (wideSuffix ? family[0] : upper) as FaceName
  const wide = wideSuffix || lowercase
  const { innerLayer, outerLayer } = move
  if (outerLayer !== undefined) return { face, first: outerLayer, last: innerLayer! }
  if (innerLayer !== undefined) return { face, first: wide ? 1 : innerLayer, last: innerLayer }
  return { face, first: 1, last: wide ? Math.min(2, size) : 1 }
}

const layerSpan = (move: MoveNode, size: number): LayerSpan | null => {
  const { family } = move
  const rotation = ROTATION_FACES[family]
  if (rotation) return hasLayers(move) ? null : { face: rotation, first: 1, last: size }

  const slice = SLICE_FACES[family]
  if (slice) {
    if (hasLayers(move) || size % 2 === 0) return null
    const middle = (size + 1) / 2
    return { face: slice, first: middle, last: middle }
  }

  const innerSlice = INNER_SLICE_FACES[family]
  if (innerSlice) return hasLayers(move) || size <= 2 ? null : { face: innerSlice, first: 2, last: size - 1 }

  return faceSpan(move, size)
}

export function resolveLayerTurn(move: MoveNode, size: number): LayerTurn | null {
  const span = layerSpan(move, size)
  if (!span || span.first < 1 || span.first > span.last || span.last > size) return null

  const { axis, sign } = FACE_BY_NAME[span.face]
  const edge = size - 1
  const nearCoordinate = sign * (edge - 2 * (span.first - 1))
  const farCoordinate = sign * (edge - 2 * (span.last - 1))
  const counterClockwise = -sign * move.amount

  return {
    axis,
    from: Math.min(nearCoordinate, farCoordinate),
    to: Math.max(nearCoordinate, farCoordinate),
    quarterTurns: (((counterClockwise % 4) + 4) % 4) as LayerTurn['quarterTurns']
  }
}
