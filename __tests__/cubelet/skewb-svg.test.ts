import { SKEWB_FACES, SKEWB_STICKERS_PER_FACE, skewb, skewbCentroids } from '@nexustimer/cubelet/skewb'
import { FaceletSvgRenderer, WCA_CUBE_PALETTE, skewbNetLayout } from '@nexustimer/cubelet/svg'

const [U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5]
const NET_EDGES = [
  [U, F],
  [F, D],
  [L, F],
  [F, R],
  [R, B]
] as const
const CORNER_STICKERS = [1, 2, 3, 4]

const center2d = (shape: readonly number[]) => {
  const count = shape.length / 2
  let x = 0
  let y = 0
  for (let i = 0; i < shape.length; i += 2) {
    x += shape[i]!
    y += shape[i + 1]!
  }
  return [x / count, y / count]
}

const signs = (point: readonly number[]) => point.map(Math.sign).join(',')

describe('skewb net layout', () => {
  const layout = skewbNetLayout()
  const shapes = layout.shapes as number[][]
  const centroids = skewbCentroids()

  it('draws a square center and four corner triangles per face', () => {
    expect(shapes).toHaveLength(6 * SKEWB_STICKERS_PER_FACE)
    shapes.forEach((shape, i) => expect(shape).toHaveLength(i % SKEWB_STICKERS_PER_FACE === 0 ? 8 : 6))
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
    const orientations = SKEWB_FACES.map(({ normal, right, down }) => {
      const cross = [
        right[1]! * down[2]! - right[2]! * down[1]!,
        right[2]! * down[0]! - right[0]! * down[2]!,
        right[0]! * down[1]! - right[1]! * down[0]!
      ]
      return Math.sign(cross.reduce((sum, value, axis) => sum + value * normal[axis]!, 0))
    })
    expect(new Set(orientations).size).toBe(1)
  })

  it('places the corners each pair of net-adjacent faces share next to each other', () => {
    const cornerOf = (sticker: number) => signs(centroids.at(sticker))
    for (const [a, b] of NET_EDGES) {
      const stickersOf = (face: number) => CORNER_STICKERS.map((index) => face * SKEWB_STICKERS_PER_FACE + index)
      const pairs = stickersOf(a).flatMap((first) =>
        stickersOf(b)
          .filter((second) => cornerOf(second) === cornerOf(first))
          .map((second) => [first, second] as const)
      )
      expect(pairs).toHaveLength(2)
      for (const [first, second] of pairs) {
        const [x1, y1] = center2d(shapes[first]!)
        const [x2, y2] = center2d(shapes[second]!)
        expect(Math.hypot(x1! - x2!, y1! - y2!)).toBeLessThan(1.5)
      }
    }
  })

  it('renders a scrambled state with the six cube colors', () => {
    const state = skewb.solved().apply(skewb.compile("R U' L B' R' U L' B"))
    const svg = new FaceletSvgRenderer(WCA_CUBE_PALETTE).render(state, layout)
    const fills = new Set([...svg.matchAll(/style="fill:([^;"]+)/g)].map((match) => match[1]))
    expect(fills).toEqual(new Set(WCA_CUBE_PALETTE.colors))
    expect((svg.match(/Z/g) ?? []).length).toBe(30)
  })
})
