import { FTO_FACE_NAMES, FTO_FACES, FTO_STICKERS_PER_FACE, fto } from '@nexustimer/cubelet/fto'
import { FaceletSvgRenderer, WCA_FTO_PALETTE, ftoNetLayout } from '@nexustimer/cubelet/svg'

const CORNER_STICKERS = [0, 4, 8]
const FLOWERS = [
  ['U', ['L', 'R', 'B']],
  ['D', ['F', 'BL', 'BR']]
] as const

const face = (name: string) => FTO_FACE_NAMES.indexOf(name as never)

const center2d = (shape: readonly number[]) => [
  (shape[0]! + shape[2]! + shape[4]!) / 3,
  (shape[1]! + shape[3]! + shape[5]!) / 3
]

const signedArea = (shape: readonly number[]) =>
  (shape[2]! - shape[0]!) * (shape[5]! - shape[1]!) - (shape[3]! - shape[1]!) * (shape[4]! - shape[0]!)

const cornerSticker = (onFace: number, vertex: readonly number[]) => {
  const index = FTO_FACES[onFace]!.vertices.findIndex(
    (other) => Math.hypot(...other.map((value, i) => value - vertex[i]!)) < 1e-9
  )
  return index < 0 ? -1 : onFace * FTO_STICKERS_PER_FACE + CORNER_STICKERS[index]!
}

describe('fto net layout', () => {
  const layout = ftoNetLayout()
  const shapes = layout.shapes as number[][]

  it('draws nine triangles per face', () => {
    expect(shapes).toHaveLength(8 * FTO_STICKERS_PER_FACE)
    expect(shapes.every((shape) => shape.length === 6)).toBe(true)
  })

  it('keeps every shape inside the view box', () => {
    const [x, y, width, height] = layout.viewBox
    for (const shape of shapes) {
      for (let i = 0; i < shape.length; i += 2) {
        expect(shape[i]).toBeGreaterThanOrEqual(x)
        expect(shape[i]).toBeLessThanOrEqual(x + width)
        expect(shape[i + 1]).toBeGreaterThanOrEqual(y)
        expect(shape[i + 1]).toBeLessThanOrEqual(y + height)
      }
    }
  })

  it('shows every face from outside, none mirrored', () => {
    const signs = FTO_FACES.map(({ stickers, normal }, index) => {
      const [a, b, c] = stickers[0]! as [number[], number[], number[]]
      const u = b.map((value, i) => value - a[i]!)
      const v = c.map((value, i) => value - a[i]!)
      const outward = Math.sign(
        (u[1]! * v[2]! - u[2]! * v[1]!) * normal[0]! +
          (u[2]! * v[0]! - u[0]! * v[2]!) * normal[1]! +
          (u[0]! * v[1]! - u[1]! * v[0]!) * normal[2]!
      )
      return outward * Math.sign(signedArea(shapes[index * FTO_STICKERS_PER_FACE]!))
    })
    expect(new Set(signs).size).toBe(1)
  })

  it('unfolds each petal against its flower center along their shared edge', () => {
    for (const [centerName, petals] of FLOWERS) {
      const center = face(centerName)
      for (const petalName of petals) {
        const petal = face(petalName)
        const shared = FTO_FACES[petal]!.vertices.filter((vertex) => cornerSticker(center, vertex) >= 0)
        expect(shared).toHaveLength(2)
        for (const vertex of shared) {
          const [x, y] = center2d(shapes[cornerSticker(center, vertex)]!)
          const distanceTo = (sticker: number) => {
            const [px, py] = center2d(shapes[sticker]!)
            return Math.hypot(px! - x!, py! - y!)
          }
          const corners = CORNER_STICKERS.map((index) => petal * FTO_STICKERS_PER_FACE + index)
          const nearest = corners.reduce((best, sticker) => (distanceTo(sticker) < distanceTo(best) ? sticker : best))
          expect(nearest).toBe(cornerSticker(petal, vertex))
        }
      }
    }
  })

  it('renders a scrambled state with the eight face colors', () => {
    const state = fto.solved().apply(fto.compile("R' L B' U' D F' BR' BL R U' L' F BL' D R"))
    const svg = new FaceletSvgRenderer(WCA_FTO_PALETTE).render(state, layout)
    const fills = new Set([...svg.matchAll(/style="fill:([^;"]+)/g)].map((match) => match[1]))
    expect(fills).toEqual(new Set(WCA_FTO_PALETTE.colors))
    expect(new Set(WCA_FTO_PALETTE.colors).size).toBe(8)
  })
})
