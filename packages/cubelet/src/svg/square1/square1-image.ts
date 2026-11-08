import type { Point } from '../../geometry/triangle-grid'
import type { FaceletSource } from '../../puzzle/facelet-source'
import { layerPieces } from '../../square1/square1-layer-pieces'
import {
  SQUARE1_SLOTS_PER_LAYER,
  Square1Color,
  faceColorOf,
  isCornerEnd,
  isCornerStart,
  sideColorOf
} from '../../square1/square1-pieces'
import type { Square1State } from '../../square1/square1-state'
import { BoundedCache } from '../../shared/bounded-cache'
import type { FaceletLayout } from '../facelet-layout'
import { polygonLayout } from '../flower-net'
import { FACE_GAP } from '../sticker-style'

export type Square1View = 'net' | 'top'

export interface Square1Image {
  readonly source: FaceletSource
  readonly layout: FaceletLayout
}

const SCALE = 3
const RIM = SCALE / Math.cos(Math.PI / 12)
const CORNER = SCALE * Math.SQRT2
const BAND = 0.5
const MIDDLE_HEIGHT = 0.9
const RADIUS = CORNER + BAND

const toScreen =
  (fromBelow: boolean, origin: Point) =>
  (degrees: number, distance: number): Point => {
    const radians = (degrees * Math.PI) / 180
    const x = (fromBelow ? 1 : -1) * Math.sin(radians) * distance
    return [origin[0]! + x, origin[1]! + Math.cos(radians) * distance]
  }

const band = (inner: Point, outer: Point, center: Point): Point[] => {
  const dx = outer[0]! - inner[0]!
  const dy = outer[1]! - inner[1]!
  const length = Math.hypot(dx, dy)
  let nx = -dy / length
  let ny = dx / length
  const midX = (inner[0]! + outer[0]!) / 2 - center[0]!
  const midY = (inner[1]! + outer[1]!) / 2 - center[1]!
  if (nx * midX + ny * midY < 0) {
    nx = -nx
    ny = -ny
  }
  return [inner, outer, [outer[0]! + nx * BAND, outer[1]! + ny * BAND], [inner[0]! + nx * BAND, inner[1]! + ny * BAND]]
}

interface Drawn {
  readonly shape: Point[]
  readonly color: (state: Square1State) => number
}

const drawLayer = (state: Square1State, first: number, fromBelow: boolean, center: Point): Drawn[] => {
  const at = toScreen(fromBelow, center)
  const drawn: Drawn[] = []
  for (const { lead, second, from, leadAtFrom } of layerPieces(state, first)) {
    const face = (s: Square1State) => faceColorOf(s.wedgeAt(lead))
    if (second === null) {
      const p1 = at(from, RIM)
      const p2 = at(from + 30, RIM)
      drawn.push({ shape: [center, p1, p2], color: face })
      drawn.push({ shape: band(p1, p2, center), color: (s) => sideColorOf(s.wedgeAt(lead)) })
      continue
    }
    const p1 = at(from, RIM)
    const tip = at(from + 30, CORNER)
    const p2 = at(from + 60, RIM)
    drawn.push({ shape: [center, p1, tip, p2], color: face })
    const [fromSlot, toSlot] = leadAtFrom ? [lead, second] : [second, lead]
    drawn.push({ shape: band(p1, tip, center), color: (s) => sideColorOf(s.wedgeAt(fromSlot)) })
    drawn.push({ shape: band(tip, p2, center), color: (s) => sideColorOf(s.wedgeAt(toSlot)) })
  }
  return drawn
}

const drawMiddle = (left: number, top: number, width: number): Drawn[] => [
  { shape: rectangle(left, top, width / 2, MIDDLE_HEIGHT), color: () => Square1Color.Front },
  {
    shape: rectangle(left + width / 2, top, width / 2, MIDDLE_HEIGHT),
    color: (s) => (s.middleFlipped ? Square1Color.Back : Square1Color.Front)
  }
]

const rectangle = (x: number, y: number, width: number, height: number): Point[] => [
  [x, y],
  [x + width, y],
  [x + width, y + height],
  [x, y + height]
]

const drawAll = (state: Square1State, view: Square1View): Drawn[] => {
  const top = drawLayer(state, 0, false, [0, 0])
  if (view === 'top') return top
  const bottom = drawLayer(state, SQUARE1_SLOTS_PER_LAYER, true, [2 * RADIUS + 2 * FACE_GAP, 0])
  const middle = drawMiddle(RADIUS + FACE_GAP - RADIUS / 2, RADIUS + 2 * FACE_GAP, RADIUS)
  return [...top, ...bottom, ...middle]
}

const shapeKey = (state: Square1State, view: Square1View): string => {
  let key = view
  for (let slot = 0; slot < 2 * SQUARE1_SLOTS_PER_LAYER; slot++) {
    const wedge = state.wedgeAt(slot)
    key += isCornerStart(wedge) ? 's' : isCornerEnd(wedge) ? 'e' : 'm'
  }
  return key
}

const layouts = new BoundedCache<string, { layout: FaceletLayout; drawn: Drawn[] }>(512)

export function square1Image(state: Square1State, view: Square1View): Square1Image {
  const key = shapeKey(state, view)
  let entry = layouts.get(key)
  if (!entry) {
    const drawn = drawAll(state, view)
    entry = {
      drawn,
      layout: polygonLayout(
        `square1-${key}`,
        drawn.map(({ shape }) => shape)
      )
    }
    layouts.set(key, entry)
  }
  const colors = entry.drawn.map(({ color }) => color(state))
  return {
    layout: entry.layout,
    source: {
      stickerCount: colors.length,
      stickerAt: (position) => position,
      colorAt: (position) => colors[position]!,
      key: () => `${view}:${state.key()}`
    }
  }
}
