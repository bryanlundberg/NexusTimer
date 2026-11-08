import { Appearance } from '@nexustimer/cubelet'
import {
  MEGAMINX_FACES,
  MEGAMINX_STICKERS_PER_FACE,
  MEGAMINX_STICKERING_PRESETS,
  megaminx,
  megaminxStickering
} from '@nexustimer/cubelet/megaminx'
import {
  FaceletSvgRenderer,
  WCA_MEGAMINX_PALETTE,
  megaminxLastLayerLayout,
  megaminxNetLayout
} from '@nexustimer/cubelet/svg'

const signedArea = (shape: readonly number[]) => {
  let sum = 0
  for (let i = 0; i < shape.length; i += 2) {
    const j = (i + 2) % shape.length
    sum += shape[i]! * shape[j + 1]! - shape[j]! * shape[i + 1]!
  }
  return sum / 2
}

const center2d = (shape: readonly number[]) => {
  let x = 0
  let y = 0
  for (let i = 0; i < shape.length; i += 2) {
    x += shape[i]!
    y += shape[i + 1]!
  }
  return [(2 * x) / shape.length, (2 * y) / shape.length]
}

const cornerAt = (face: number, vertex: readonly number[]) => {
  const index = MEGAMINX_FACES[face]!.vertices.findIndex(
    (other) => Math.hypot(...other.map((value, i) => value - vertex[i]!)) < 1e-9
  )
  return index < 0 ? -1 : face * MEGAMINX_STICKERS_PER_FACE + 2 + 2 * index
}

describe('megaminx layouts', () => {
  const net = megaminxNetLayout().shapes as number[][]

  it('draws a pentagon center, five edges and five corners per face', () => {
    expect(net).toHaveLength(12 * MEGAMINX_STICKERS_PER_FACE)
    net.forEach((shape, i) => expect(shape).toHaveLength(i % MEGAMINX_STICKERS_PER_FACE === 0 ? 10 : 8))
  })

  it('keeps every shape inside the view box', () => {
    for (const layout of [megaminxNetLayout(), megaminxLastLayerLayout()]) {
      const [x, y, width, height] = layout.viewBox
      for (const shape of layout.shapes) {
        if (!shape) continue
        for (let i = 0; i < shape.length; i += 2) {
          expect(shape[i]).toBeGreaterThanOrEqual(x)
          expect(shape[i]).toBeLessThanOrEqual(x + width)
          expect(shape[i + 1]).toBeGreaterThanOrEqual(y)
          expect(shape[i + 1]).toBeLessThanOrEqual(y + height)
        }
      }
    }
  })

  it('shows every face from outside, none mirrored', () => {
    const signs = MEGAMINX_FACES.map((_, face) => Math.sign(signedArea(net[face * MEGAMINX_STICKERS_PER_FACE]!)))
    expect(new Set(signs).size).toBe(1)
  })

  it('unfolds each petal against its flower center along their shared edge', () => {
    for (const center of [0, 6]) {
      for (const petal of MEGAMINX_FACES[center]!.neighbors) {
        const shared = MEGAMINX_FACES[petal]!.vertices.filter((vertex) => cornerAt(center, vertex) >= 0)
        expect(shared).toHaveLength(2)
        for (const vertex of shared) {
          const [x, y] = center2d(net[cornerAt(center, vertex)]!)
          const distanceTo = (sticker: number) => {
            const [px, py] = center2d(net[sticker]!)
            return Math.hypot(px! - x!, py! - y!)
          }
          const petalCorners = [0, 1, 2, 3, 4].map((i) => petal * MEGAMINX_STICKERS_PER_FACE + 2 + 2 * i)
          const nearest = petalCorners.reduce((best, sticker) =>
            distanceTo(sticker) < distanceTo(best) ? sticker : best
          )
          expect(nearest).toBe(cornerAt(petal, vertex))
        }
      }
    }
  })

  it('draws only the top layer in the last-layer view', () => {
    expect(megaminxLastLayerLayout().shapes.filter(Boolean)).toHaveLength(MEGAMINX_STICKERS_PER_FACE + 5 * 3)
  })
})

describe('megaminx stickering', () => {
  const appearances = (preset: string) => {
    const stickering = megaminxStickering(preset)!
    return Array.from({ length: 12 * MEGAMINX_STICKERS_PER_FACE }, (_, i) => stickering.appearanceOf(i))
  }
  const count = (values: readonly number[], appearance: number) => values.filter((value) => value === appearance).length

  it('knows every preset the algorithm sets use and rejects others', () => {
    for (const preset of MEGAMINX_STICKERING_PRESETS) expect(megaminxStickering(preset)).not.toBeNull()
    expect(megaminxStickering('OLL')).toBeNull()
  })

  it('shows only the top stickers of the last-layer edges for edge orientation', () => {
    const eo = appearances('OLL-EO')
    expect(count(eo, Appearance.Regular)).toBe(1 + 5)
    expect(count(eo, Appearance.Ignored)).toBe(5 + 5 * 3 - 5 + 5)
    expect(count(eo, Appearance.Dim)).toBe(132 - 26)
  })

  it('keeps every last-layer sticker for corner permutation', () => {
    expect(count(appearances('PLL-CP'), Appearance.Regular)).toBe(26)
  })

  it('renders a last-layer case with the stickering applied', () => {
    const state = megaminx.solved().apply(megaminx.compile("F U R U' R' F'"))
    const svg = new FaceletSvgRenderer(WCA_MEGAMINX_PALETTE).render(
      state,
      megaminxLastLayerLayout(),
      megaminxStickering('OLL-EO')
    )
    expect((svg.match(/Z/g) ?? []).length).toBe(26)
    expect(svg).toContain(WCA_MEGAMINX_PALETTE.ignored)
  })
})
