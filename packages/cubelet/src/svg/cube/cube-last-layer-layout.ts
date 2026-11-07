import type { FaceletLayout } from '../facelet-layout'
import { EDGE_PADDING, OUTLINE_WIDTH, STICKER_GAP, sticker } from './cube-sticker-style'

const STRIP_DEPTH = 0.34
const STRIP_GAP = 0.05

const U = 0
const R = 1
const F = 2
const L = 4
const B = 5

const SIDE_QUARTER_TURNS: ReadonlyArray<readonly [face: number, quarterTurns: number]> = [
  [F, 0],
  [R, 1],
  [B, 2],
  [L, 3]
]

const layouts = new Map<number, FaceletLayout>()

const rotateCounterClockwise = (points: number[], quarterTurns: number, center: number): number[] => {
  const rotated = points.slice()
  for (let turn = 0; turn < quarterTurns; turn++) {
    for (let i = 0; i < rotated.length; i += 2) {
      const dx = rotated[i]! - center
      const dy = rotated[i + 1]! - center
      rotated[i] = center + dy
      rotated[i + 1] = center - dx
    }
  }
  return rotated
}

const buildLastLayerLayout = (size: number): FaceletLayout => {
  const perFace = size * size
  const shapes: Array<number[] | null> = Array.from({ length: 6 * perFace }, () => null)
  const origin = EDGE_PADDING + STRIP_DEPTH + STRIP_GAP
  const extent = size + 2 * origin

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) shapes[U * perFace + row * size + col] = sticker(origin + col, origin + row)
  }

  const stripTop = origin + size + STRIP_GAP - STICKER_GAP
  const stripHeight = STRIP_DEPTH + 2 * STICKER_GAP
  for (const [face, quarterTurns] of SIDE_QUARTER_TURNS) {
    for (let index = 0; index < size; index++) {
      const strip = sticker(origin + index, stripTop, 1, stripHeight)
      shapes[face * perFace + index] = rotateCounterClockwise(strip, quarterTurns, extent / 2)
    }
  }

  return {
    id: `cube-ll-${size}`,
    viewBox: [0, 0, extent, extent],
    outlineWidth: OUTLINE_WIDTH,
    shapes
  }
}

export function cubeLastLayerLayout(size: number): FaceletLayout {
  let layout = layouts.get(size)
  if (!layout) {
    layout = buildLastLayerLayout(size)
    layouts.set(size, layout)
  }
  return layout
}
