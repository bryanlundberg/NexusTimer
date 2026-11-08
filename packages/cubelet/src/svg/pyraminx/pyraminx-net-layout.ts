import { centroid, triangleGrid, type Point } from '../../geometry/triangle-grid'
import {
  PYRAMINX_FACES,
  PYRAMINX_ORDER,
  type PyraminxFaceName,
  type PyraminxVertex
} from '../../pyraminx/pyraminx-geometry'
import type { FaceletLayout } from '../facelet-layout'
import { EDGE_PADDING, FACE_GAP, OUTLINE_WIDTH, STICKER_GAP } from '../sticker-style'

const SIDE = PYRAMINX_ORDER
const HEIGHT = (SIDE * Math.sqrt(3)) / 2

const TOP: Point = [SIDE, 0]
const LEFT: Point = [SIDE / 2, HEIGHT]
const RIGHT: Point = [(3 * SIDE) / 2, HEIGHT]

const UNFOLDED: Readonly<Record<PyraminxFaceName, Partial<Record<PyraminxVertex, Point>>>> = {
  F: { U: TOP, L: LEFT, R: RIGHT },
  L: { U: TOP, L: LEFT, B: [0, 0] },
  R: { U: TOP, R: RIGHT, B: [2 * SIDE, 0] },
  D: { L: LEFT, R: RIGHT, B: [SIDE, 2 * HEIGHT] }
}

const STICKER_INRADIUS = 1 / (2 * Math.sqrt(3))
const STICKER_SCALE = 1 - STICKER_GAP / STICKER_INRADIUS

const scaleAbout = (points: readonly Point[], center: Point, scale: number): number[] =>
  points.flatMap((point) => point.map((value, axis) => center[axis]! + (value - center[axis]!) * scale))

const translate = (point: Point, offset: Point): Point => point.map((value, axis) => value + offset[axis]!)

const outwardOffset = (faceCenter: Point, netCenter: Point): Point => {
  const direction = faceCenter.map((value, axis) => value - netCenter[axis]!)
  const length = Math.hypot(...direction)
  return length === 0 ? [0, 0] : direction.map((value) => (value / length) * FACE_GAP)
}

const boundingViewBox = (shapes: readonly number[][]): FaceletLayout['viewBox'] => {
  const xs = shapes.flatMap((shape) => shape.filter((_, i) => i % 2 === 0))
  const ys = shapes.flatMap((shape) => shape.filter((_, i) => i % 2 === 1))
  const minX = Math.min(...xs) - EDGE_PADDING
  const minY = Math.min(...ys) - EDGE_PADDING
  return [minX, minY, Math.max(...xs) + EDGE_PADDING - minX, Math.max(...ys) + EDGE_PADDING - minY]
}

const buildNetLayout = (): FaceletLayout => {
  const netCenter = centroid([TOP, LEFT, RIGHT])
  const shapes = PYRAMINX_FACES.flatMap(({ name, corners }) => {
    const unfolded = corners.map((vertex) => UNFOLDED[name][vertex]!)
    const offset = outwardOffset(centroid(unfolded), netCenter)
    const [top, left, right] = unfolded.map((point) => translate(point, offset)) as [Point, Point, Point]
    return triangleGrid(PYRAMINX_ORDER, top, left, right).map((triangle) =>
      scaleAbout(triangle, centroid(triangle), STICKER_SCALE)
    )
  })
  return {
    id: 'pyraminx-net',
    viewBox: boundingViewBox(shapes),
    outlineWidth: OUTLINE_WIDTH,
    shapes
  }
}

let layout: FaceletLayout | undefined

export function pyraminxNetLayout(): FaceletLayout {
  layout ??= buildNetLayout()
  return layout
}
