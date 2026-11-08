import { cube, cubeStickering } from '@nexustimer/cubelet/nxn'
import { FaceletSvgRenderer, WCA_CUBE_PALETTE, cubeLastLayerLayout, cubeNetLayout } from '@nexustimer/cubelet/svg'

const fills = (svg: string) => [...svg.matchAll(/style="fill:([^;"]+)/g)].map((match) => match[1])
const shapeCount = (svg: string) => (svg.match(/Z/g) ?? []).length

describe('cube layouts', () => {
  it.each([2, 3, 7])('the %i-layer net draws every facelet', (size) => {
    const layout = cubeNetLayout(size)
    expect(layout.shapes).toHaveLength(6 * size * size)
    expect(layout.shapes.every((shape) => shape?.length === 8)).toBe(true)
  })

  it.each([2, 3, 5])('the %i-layer last-layer view draws the top face and one row of each side', (size) => {
    const drawn = cubeLastLayerLayout(size).shapes.filter(Boolean)
    expect(drawn).toHaveLength(size * size + 4 * size)
  })

  it('returns the same layout object per size', () => {
    expect(cubeNetLayout(3)).toBe(cubeNetLayout(3))
    expect(cubeLastLayerLayout(3)).not.toBe(cubeLastLayerLayout(4))
  })

  it('keeps every shape inside the view box', () => {
    for (const layout of [cubeNetLayout(4), cubeLastLayerLayout(4)]) {
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
})

describe('FaceletSvgRenderer', () => {
  const renderer = new FaceletSvgRenderer(WCA_CUBE_PALETTE)

  it('draws one path per color on a transparent background', () => {
    const svg = renderer.render(cube(3).solved(), cubeNetLayout(3))
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="')).toBe(true)
    expect(fills(svg).sort()).toEqual([...WCA_CUBE_PALETTE.colors].sort())
    expect(shapeCount(svg)).toBe(54)
  })

  it('paints ignored and dimmed stickers with the palette', () => {
    const svg = renderer.render(cube(3).solved(), cubeNetLayout(3), cubeStickering(3, 'OLL'))
    expect(fills(svg)).toContain(WCA_CUBE_PALETTE.ignored)
    expect(fills(svg)).toContain(WCA_CUBE_PALETTE.dimColors[2])
    expect(fills(svg)).toContain(WCA_CUBE_PALETTE.colors[0])
  })

  it('returns the cached markup for the same state, layout and stickering', () => {
    const state = cube(3).solved().apply(cube(3).compile("R U R' U'"))
    const first = renderer.render(state, cubeLastLayerLayout(3), cubeStickering(3, 'PLL'))
    expect(renderer.render(state, cubeLastLayerLayout(3), cubeStickering(3, 'PLL'))).toBe(first)
    expect(renderer.render(state, cubeLastLayerLayout(3), cubeStickering(3, 'OLL'))).not.toBe(first)
  })

  it('draws different states differently', () => {
    const a = renderer.render(cube(3).solved().apply(cube(3).compile('R')), cubeNetLayout(3))
    const b = renderer.render(cube(3).solved().apply(cube(3).compile('L')), cubeNetLayout(3))
    expect(a).not.toBe(b)
  })
})
