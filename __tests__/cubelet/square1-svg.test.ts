import { square1 } from '@nexustimer/cubelet/square1'
import { FaceletSvgRenderer, WCA_SQUARE1_PALETTE, square1Image } from '@nexustimer/cubelet/svg'

const imageAfter = (alg: string, view: 'net' | 'top' = 'net') =>
  square1Image(square1.solved().apply(square1.compile(alg)), view)

const LAYER_SHAPES = 4 * 2 + 4 * 3

describe('square-1 image', () => {
  it('draws each piece face with its side bands and the middle layer', () => {
    expect(imageAfter('').layout.shapes).toHaveLength(2 * LAYER_SHAPES + 2)
    expect(imageAfter('', 'top').layout.shapes).toHaveLength(LAYER_SHAPES)
  })

  it('keeps every shape inside the view box', () => {
    for (const alg of ['', '/', '(1,0) / (-1,0)', '(0,-1) / (-3,0) / (3,3) / (0,1)']) {
      const { layout } = imageAfter(alg)
      const [x, y, width, height] = layout.viewBox
      for (const shape of layout.shapes) {
        for (let i = 0; i < shape!.length; i += 2) {
          expect(shape![i]).toBeGreaterThanOrEqual(x)
          expect(shape![i]).toBeLessThanOrEqual(x + width)
          expect(shape![i + 1]).toBeGreaterThanOrEqual(y)
          expect(shape![i + 1]).toBeLessThanOrEqual(y + height)
        }
      }
    }
  })

  it('reuses the layout of states with the same shape and redraws when the shape changes', () => {
    expect(imageAfter('(3,0)').layout).toBe(imageAfter('(0,3)').layout)
    expect(imageAfter('/').layout).not.toBe(imageAfter('').layout)
  })

  it('colors the middle layer by whether it is flipped', () => {
    const colors = (alg: string) => {
      const { source } = imageAfter(alg)
      return [source.colorAt(source.stickerCount - 2), source.colorAt(source.stickerCount - 1)]
    }
    expect(colors('')).toEqual([2, 2])
    expect(colors('/')).toEqual([2, 4])
    expect(colors('/ /')).toEqual([2, 2])
  })

  it('renders the six colors of a solved puzzle', () => {
    const { source, layout } = imageAfter('')
    const svg = new FaceletSvgRenderer(WCA_SQUARE1_PALETTE).render(source, layout)
    const fills = new Set([...svg.matchAll(/style="fill:([^;"]+)/g)].map((match) => match[1]))
    expect(fills).toEqual(new Set(WCA_SQUARE1_PALETTE.colors))
  })
})
