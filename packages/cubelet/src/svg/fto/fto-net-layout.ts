import { FTO_FACE_NAMES, FTO_FACES, type FtoFaceName } from '../../fto/fto-geometry'
import type { FaceletLayout } from '../facelet-layout'
import { polygonLayout, sideBySide, unfoldFlower, type Flower } from '../flower-net'
import { FACE_GAP } from '../sticker-style'

const STICKER_SIZE = 3 / Math.SQRT2
const PETAL_GAP = FACE_GAP
const FLOWER_GAP = FACE_GAP * 2

const face = (name: FtoFaceName) => FTO_FACE_NAMES.indexOf(name)

const FLOWERS: readonly Flower[] = [
  {
    center: face('U'),
    petals: [face('L'), face('R'), face('B')],
    project: ([x, , z]) => [x! * STICKER_SIZE, z! * STICKER_SIZE]
  },
  {
    center: face('D'),
    petals: [face('F'), face('BL'), face('BR')],
    project: ([x, , z]) => [-x! * STICKER_SIZE, z! * STICKER_SIZE]
  }
]

const buildNetLayout = (): FaceletLayout => {
  const flowers = FLOWERS.map((flower) => unfoldFlower(FTO_FACES, flower, PETAL_GAP))
  return polygonLayout('fto-net', sideBySide(flowers, FTO_FACES.length, FLOWER_GAP).flat())
}

let layout: FaceletLayout | undefined

export function ftoNetLayout(): FaceletLayout {
  layout ??= buildNetLayout()
  return layout
}
