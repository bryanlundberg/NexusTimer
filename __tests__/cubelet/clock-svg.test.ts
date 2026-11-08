import { clock } from '@nexustimer/cubelet/clock'
import { ClockSvgRenderer, HEX_COLOR_MIXER, WCA_CUBE_PALETTE, clockPalette } from '@nexustimer/cubelet/svg'

const palette = clockPalette(WCA_CUBE_PALETTE, HEX_COLOR_MIXER)
const render = (alg: string) => new ClockSvgRenderer(palette).render(clock.solved().apply(clock.compile(alg)))

describe('clock image', () => {
  it('draws nine hands on each face', () => {
    expect((render('').match(/Z/g) ?? []).length).toBe(18)
  })

  it('points each hand at its hour', () => {
    expect(render('UR3+')).not.toBe(render(''))
    expect(render('UR12+')).toBe(render(''))
  })

  it('shows the side facing the solver first, swapping body colors after y2', () => {
    const bodies = (svg: string) => [...svg.matchAll(/<rect[^>]*style="fill:([^"]+)"/g)].map((match) => match[1])
    const [light, dark] = palette.sides.map((side) => side.body)
    expect(bodies(render(''))).toEqual([light, dark])
    expect(bodies(render('y2'))).toEqual([dark, light])
  })

  it('caches by state', () => {
    const renderer = new ClockSvgRenderer(palette)
    const state = clock.solved().apply(clock.compile('ALL3-'))
    expect(renderer.render(state)).toBe(renderer.render(clock.solved().apply(clock.compile('ALL3-'))))
  })
})
