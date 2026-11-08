import type { FaceletLayout } from '../facelet-layout'
import { EDGE_PADDING, OUTLINE_WIDTH, sticker } from './cube-sticker-style'

const FACE_GAP = 0.3

export const FACE_SLOTS: ReadonlyArray<readonly [column: number, row: number]> = [
  [1, 0],
  [2, 1],
  [1, 1],
  [1, 2],
  [0, 1],
  [3, 1]
]

const layouts = new Map<number, FaceletLayout>()

const buildNetLayout = (size: number): FaceletLayout => {
  const faceSize = size + 2 * EDGE_PADDING
  const stride = faceSize + FACE_GAP + 0.04 * size
  const shapes: number[][] = []
  for (const [column, row] of FACE_SLOTS) {
    const left = column * stride + EDGE_PADDING
    const top = row * stride + EDGE_PADDING
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) shapes.push(sticker(left + c, top + r))
    }
  }
  return {
    id: `cube-net-${size}`,
    viewBox: [0, 0, 3 * stride + faceSize, 2 * stride + faceSize],
    outlineWidth: OUTLINE_WIDTH,
    shapes
  }
}

export function cubeNetLayout(size: number): FaceletLayout {
  let layout = layouts.get(size)
  if (!layout) {
    layout = buildNetLayout(size)
    layouts.set(size, layout)
  }
  return layout
}
