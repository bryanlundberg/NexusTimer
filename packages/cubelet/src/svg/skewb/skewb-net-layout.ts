import type { Point } from '../../geometry/triangle-grid'
import { SKEWB_FACES, SKEWB_STICKER_SHAPES } from '../../skewb/skewb-geometry'
import { FACE_SLOTS } from '../cube/cube-net-layout'
import type { FaceletLayout } from '../facelet-layout'
import { insetPolygon } from '../inset-polygon'
import { EDGE_PADDING, FACE_GAP, OUTLINE_WIDTH, STICKER_GAP } from '../sticker-style'

const FACE_SIZE = 3
const STRIDE = FACE_SIZE + FACE_GAP

const buildNetLayout = (): FaceletLayout => {
  const shapes = SKEWB_FACES.flatMap((_, face) => {
    const [column, row] = FACE_SLOTS[face]!
    const left = EDGE_PADDING + column * STRIDE
    const top = EDGE_PADDING + row * STRIDE
    const toNet = ([u, v]: Point): Point => [left + ((u! + 1) * FACE_SIZE) / 2, top + ((v! + 1) * FACE_SIZE) / 2]
    return SKEWB_STICKER_SHAPES.map((shape) => insetPolygon(shape.map(toNet), STICKER_GAP))
  })
  return {
    id: 'skewb-net',
    viewBox: [0, 0, 3 * STRIDE + FACE_SIZE + 2 * EDGE_PADDING, 2 * STRIDE + FACE_SIZE + 2 * EDGE_PADDING],
    outlineWidth: OUTLINE_WIDTH,
    shapes
  }
}

let layout: FaceletLayout | undefined

export function skewbNetLayout(): FaceletLayout {
  layout ??= buildNetLayout()
  return layout
}
