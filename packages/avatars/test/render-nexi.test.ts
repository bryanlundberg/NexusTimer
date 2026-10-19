import { describe, expect, it } from 'vitest'
import {
  NEXI_EXTRAS,
  NEXI_FACES,
  NEXI_HEADS,
  NEXI_HELD_ITEMS,
  NEXI_PATTERNS,
  NEXI_SHAPES,
  type NexiRecipe
} from '@nexustimer/contracts'
import { DEFAULT_NEXI_RECIPE, NEXI_BACKGROUND_COLORS, NEXI_BODY_COLORS, randomNexiRecipe, renderNexiSvg } from '../src'

const OPTIONS = {
  state: NEXI_FACES,
  head: NEXI_HEADS,
  hand: NEXI_HELD_ITEMS,
  extra: NEXI_EXTRAS,
  pattern: NEXI_PATTERNS
} as const

const everyVariant = (): [string, NexiRecipe][] =>
  NEXI_SHAPES.flatMap((shape) => [
    ...Object.entries(OPTIONS).flatMap(([key, values]) =>
      values.map((value): [string, NexiRecipe] => [
        `${shape} ${key}=${value}`,
        { ...DEFAULT_NEXI_RECIPE, shape, [key]: value }
      ])
    ),
    ...NEXI_BODY_COLORS.map(({ hex }): [string, NexiRecipe] => [
      `${shape} color=${hex}`,
      { ...DEFAULT_NEXI_RECIPE, shape, color: hex }
    ]),
    ...NEXI_BACKGROUND_COLORS.map(({ hex }): [string, NexiRecipe] => [
      `${shape} bg=${hex}`,
      { ...DEFAULT_NEXI_RECIPE, shape, bg: hex }
    ])
  ])

function unbalancedTag(svg: string) {
  const open: string[] = []
  for (const [, closing, name, selfClosing] of svg.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    if (selfClosing) continue
    if (!closing) open.push(name ?? '')
    else if (open.pop() !== name) return name
  }
  return open[0]
}

const ids = (svg: string) => [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
const references = (svg: string) => [...svg.matchAll(/url\(#([^)]+)\)/g)].map((m) => m[1])

describe('renderNexiSvg', () => {
  it('renders a 128 unit square svg', () => {
    const svg = renderNexiSvg(DEFAULT_NEXI_RECIPE)
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">')).toBe(true)
    expect(svg.endsWith('</svg>')).toBe(true)
  })

  it('is deterministic', () => {
    const recipe = randomNexiRecipe('determinism')
    expect(renderNexiSvg(recipe)).toBe(renderNexiSvg({ ...recipe }))
  })

  it('renders every option on every shape', () => {
    for (const [label, recipe] of everyVariant()) {
      const svg = renderNexiSvg(recipe)
      expect(svg, label).not.toMatch(/NaN|undefined|null|Infinity/)
      expect(unbalancedTag(svg), label).toBeUndefined()
      const defined = ids(svg)
      expect(new Set(defined).size, label).toBe(defined.length)
      for (const ref of references(svg)) expect(defined, label).toContain(ref)
    }
  })

  it('changes the output for each option', () => {
    for (const [key, values] of Object.entries(OPTIONS)) {
      const outputs = new Set(values.map((value) => renderNexiSvg({ ...DEFAULT_NEXI_RECIPE, [key]: value })))
      expect(outputs.size, key).toBe(values.length)
    }
  })

  it('prefixes every id with the uid', () => {
    const first = renderNexiSvg(DEFAULT_NEXI_RECIPE, { uid: 'a1' })
    const second = renderNexiSvg(DEFAULT_NEXI_RECIPE, { uid: 'b2' })
    expect(ids(first).every((id) => id?.startsWith('a1-'))).toBe(true)
    expect(ids(second).every((id) => id?.startsWith('b2-'))).toBe(true)
  })

  it('strips unsafe characters from the uid', () => {
    const svg = renderNexiSvg(DEFAULT_NEXI_RECIPE, { uid: '«r1»"><script>' })
    expect(svg).not.toContain('<script')
    expect(ids(svg).every((id) => id?.startsWith('r1script-'))).toBe(true)
    expect(ids(renderNexiSvg(DEFAULT_NEXI_RECIPE, { uid: '«»' }))[0]).toMatch(/^nx-/)
  })

  it('falls back to safe values for tampered input', () => {
    const tampered = {
      ...DEFAULT_NEXI_RECIPE,
      color: '"/><script>alert(1)</script>',
      head: '<g>'
    } as unknown as NexiRecipe
    const svg = renderNexiSvg(tampered)
    expect(svg).toBe(renderNexiSvg(DEFAULT_NEXI_RECIPE))
  })

  it.each([
    ['default', DEFAULT_NEXI_RECIPE],
    [
      'pyraminx with headset and cube',
      {
        ...DEFAULT_NEXI_RECIPE,
        shape: 'pyraminx',
        head: 'headset',
        hand: 'cube',
        state: 'cool',
        bg: '#5a2d9c',
        pattern: 'rays'
      }
    ],
    [
      'megaminx with blindfold',
      {
        ...DEFAULT_NEXI_RECIPE,
        shape: 'megaminx',
        color: '#2ec27e',
        extra: 'blindfold',
        state: 'focus',
        pattern: 'gradient'
      }
    ],
    [
      'tilted square-1 with steam',
      {
        ...DEFAULT_NEXI_RECIPE,
        shape: 'square1',
        color: '#f0473f',
        state: 'sleep',
        extra: 'steam',
        hand: 'coffee',
        pattern: 'cubes'
      }
    ]
  ] satisfies [string, NexiRecipe][])('matches the %s snapshot', (_, recipe) => {
    expect(renderNexiSvg(recipe)).toMatchSnapshot()
  })
})
