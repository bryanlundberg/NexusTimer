import { PYRAMINX_FACES, PYRAMINX_STICKERS_PER_FACE, pyraminx, pyraminxCentroids } from '@nexustimer/cubelet/pyraminx'
import { FaceletSvgRenderer, WCA_PYRAMINX_PALETTE, pyraminxNetLayout } from '@nexustimer/cubelet/svg'

const F = 0
const NET_NEIGHBORS = [1, 2, 3]
const CORNER_STICKERS = [0, 4, 8]

const center2d = (shape: readonly number[]) => [
  (shape[0]! + shape[2]! + shape[4]!) / 3,
  (shape[1]! + shape[3]! + shape[5]!) / 3
]

const distance = (a: readonly number[], b: readonly number[]) => Math.hypot(...a.map((value, i) => value - b[i]!))

const subtract = (a: readonly number[], b: readonly number[]) => a.map((value, i) => value - b[i]!)

const cross = (a: readonly number[], b: readonly number[]) => [
  a[1]! * b[2]! - a[2]! * b[1]!,
  a[2]! * b[0]! - a[0]! * b[2]!,
  a[0]! * b[1]! - a[1]! * b[0]!
]

describe('pyraminx net layout', () => {
  const layout = pyraminxNetLayout()
  const shapes = layout.shapes as number[][]

  it('draws every sticker as a triangle', () => {
    expect(shapes).toHaveLength(4 * PYRAMINX_STICKERS_PER_FACE)
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
    const centroids = pyraminxCentroids()
    const signs = PYRAMINX_FACES.map((_, face) => {
      const [a, b, c] = CORNER_STICKERS.map((index) => face * PYRAMINX_STICKERS_PER_FACE + index)
      const [p, q, r] = [a!, b!, c!].map((sticker) => centroids.at(sticker))
      const normal = cross(subtract(q!, p!), subtract(r!, p!))
      const outward = Math.sign(normal.reduce((sum, value, i) => sum + value * p![i]!, 0))
      const [u, v, w] = [a!, b!, c!].map((sticker) => center2d(shapes[sticker]!))
      const drawn = Math.sign((v![0]! - u![0]!) * (w![1]! - u![1]!) - (v![1]! - u![1]!) * (w![0]! - u![0]!))
      return outward * drawn
    })
    expect(new Set(signs).size).toBe(1)
  })

  it('places the corners each pair of net-adjacent faces share next to each other', () => {
    const cornerSticker = (face: number, vertex: string) =>
      face * PYRAMINX_STICKERS_PER_FACE + CORNER_STICKERS[PYRAMINX_FACES[face]!.corners.indexOf(vertex as never)]!
    for (const face of NET_NEIGHBORS) {
      const shared = PYRAMINX_FACES[F]!.corners.filter((vertex) => PYRAMINX_FACES[face]!.corners.includes(vertex))
      expect(shared).toHaveLength(2)
      for (const vertex of shared) {
        const gap = distance(
          center2d(shapes[cornerSticker(F, vertex)]!),
          center2d(shapes[cornerSticker(face, vertex)]!)
        )
        expect(gap).toBeLessThan(1)
      }
    }
  })

  it('renders a scrambled state with the four face colors', () => {
    const state = pyraminx.solved().apply(pyraminx.compile("U L' R B' u r'"))
    const svg = new FaceletSvgRenderer(WCA_PYRAMINX_PALETTE).render(state, layout)
    const fills = new Set([...svg.matchAll(/style="fill:([^;"]+)/g)].map((match) => match[1]))
    expect(fills).toEqual(new Set(WCA_PYRAMINX_PALETTE.colors))
    expect((svg.match(/Z/g) ?? []).length).toBe(36)
  })
})
