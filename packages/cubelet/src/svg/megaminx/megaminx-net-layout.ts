import type { Point } from '../../geometry/triangle-grid'
import { dot } from '../../geometry/vector'
import {
  MEGAMINX_FACES,
  MEGAMINX_STICKERS_PER_FACE,
  megaminxCentroids,
  megaminxLayerCut
} from '../../megaminx/megaminx-geometry'
import type { FaceletLayout } from '../facelet-layout'
import { polygonLayout, sideBySide, unfoldFlower, type Flower } from '../flower-net'
import { FACE_GAP } from '../sticker-style'

const PETAL_GAP = FACE_GAP * 0.6
const FLOWER_GAP = FACE_GAP * 2
const STICKER_SIZE = 3.4
const U = 0
const D = 6

const FLOWERS: readonly Flower[] = [
  {
    center: U,
    petals: MEGAMINX_FACES[U]!.neighbors,
    project: ([x, , z]) => [x! * STICKER_SIZE, z! * STICKER_SIZE]
  },
  {
    center: D,
    petals: MEGAMINX_FACES[D]!.neighbors,
    project: ([x, , z]) => [-x! * STICKER_SIZE, z! * STICKER_SIZE]
  }
]

const buildNetLayout = (): FaceletLayout => {
  const flowers = FLOWERS.map((flower) => unfoldFlower(MEGAMINX_FACES, flower, PETAL_GAP))
  return polygonLayout('megaminx-net', sideBySide(flowers, MEGAMINX_FACES.length, FLOWER_GAP).flat())
}

const buildLastLayerLayout = (): FaceletLayout => {
  const centroids = megaminxCentroids()
  const up = MEGAMINX_FACES[U]!.normal
  const shapes: Array<Point[] | null> = Array.from({ length: centroids.count }, () => null)
  for (const [face, stickers] of unfoldFlower(MEGAMINX_FACES, FLOWERS[0]!, PETAL_GAP)) {
    stickers.forEach((sticker, index) => {
      const position = face * MEGAMINX_STICKERS_PER_FACE + index
      if (dot(centroids.at(position), up) > megaminxLayerCut) shapes[position] = sticker
    })
  }
  return polygonLayout('megaminx-ll', shapes)
}

let netLayout: FaceletLayout | undefined
let lastLayerLayout: FaceletLayout | undefined

export function megaminxNetLayout(): FaceletLayout {
  netLayout ??= buildNetLayout()
  return netLayout
}

export function megaminxLastLayerLayout(): FaceletLayout {
  lastLayerLayout ??= buildLastLayerLayout()
  return lastLayerLayout
}
