import { describe, expect, it } from 'vitest'
import { nexiRecipeSchema } from '@nexustimer/contracts'
import {
  DEFAULT_NEXI_RECIPE,
  NEXI_BACKGROUND_COLORS,
  NEXI_BODY_COLORS,
  normalizeNexiRecipe,
  randomNexiRecipe
} from '../src'

const SEEDS = Array.from({ length: 5000 }, (_, i) => `user-${i}`)

describe('nexiRecipeSchema', () => {
  it('accepts the default recipe', () => {
    expect(nexiRecipeSchema.safeParse(DEFAULT_NEXI_RECIPE).success).toBe(true)
  })

  it.each([
    ['an unknown version', { v: 2 }],
    ['an unknown shape', { shape: 'clock' }],
    ['an unknown face', { state: 'blush' }],
    ['an unknown head', { head: 'balloon' }],
    ['an unknown held item', { hand: 'icecream' }],
    ['an unknown extra', { extra: 'hearts' }],
    ['an unknown pattern', { pattern: 'dots' }],
    ['a short hex color', { color: '#fff' }],
    ['a named color', { color: 'red' }],
    ['markup in the background', { bg: '#000000"/><script>' }]
  ])('rejects %s', (_, patch) => {
    expect(nexiRecipeSchema.safeParse({ ...DEFAULT_NEXI_RECIPE, ...patch }).success).toBe(false)
  })
})

describe('normalizeNexiRecipe', () => {
  it('keeps a valid recipe and lowercases its colors', () => {
    const recipe = {
      ...DEFAULT_NEXI_RECIPE,
      shape: 'pyraminx',
      color: '#FF8A3C',
      head: 'crown',
      bg: '#1B5F8F'
    } as const
    expect(normalizeNexiRecipe(recipe)).toEqual({ ...recipe, color: '#ff8a3c', bg: '#1b5f8f' })
  })

  it('replaces invalid values with the defaults', () => {
    const normalized = normalizeNexiRecipe({
      v: 9,
      shape: 'clock',
      color: 'blue',
      state: 42,
      head: null,
      hand: 'balloon',
      extra: {},
      bg: '#12',
      pattern: 'dots'
    })
    expect(normalized).toEqual(DEFAULT_NEXI_RECIPE)
  })

  it('drops unknown keys', () => {
    expect(normalizeNexiRecipe({ ...DEFAULT_NEXI_RECIPE, accessory: 'crown', __proto__: { head: 'crown' } })).toEqual(
      DEFAULT_NEXI_RECIPE
    )
  })

  it.each([null, undefined, 'cube', 7, []])('returns the default for %j', (input) => {
    expect(normalizeNexiRecipe(input)).toEqual(DEFAULT_NEXI_RECIPE)
  })
})

describe('randomNexiRecipe', () => {
  it('is stable for a seed', () => {
    expect(randomNexiRecipe('user-1')).toEqual(randomNexiRecipe('user-1'))
  })

  it('varies across seeds', () => {
    const distinct = new Set(SEEDS.slice(0, 200).map((seed) => JSON.stringify(randomNexiRecipe(seed))))
    expect(distinct.size).toBeGreaterThan(190)
  })

  it('always returns a valid recipe from the palettes', () => {
    const bodyColors = new Set<string>(NEXI_BODY_COLORS.map((c) => c.hex))
    const backgrounds = new Set<string>(NEXI_BACKGROUND_COLORS.map((c) => c.hex))
    for (const seed of SEEDS) {
      const recipe = randomNexiRecipe(seed)
      expect(nexiRecipeSchema.safeParse(recipe).success).toBe(true)
      expect(bodyColors.has(recipe.color)).toBe(true)
      expect(backgrounds.has(recipe.bg)).toBe(true)
    }
  })

  it('never wears more than two accessories', () => {
    for (const seed of SEEDS) {
      const { head, hand, extra } = randomNexiRecipe(seed)
      expect([head, hand, extra].filter((key) => key !== 'none').length).toBeLessThanOrEqual(2)
    }
  })

  it('favors the cube and the plain look', () => {
    const recipes = SEEDS.map(randomNexiRecipe)
    const share = (match: (r: (typeof recipes)[number]) => boolean) => recipes.filter(match).length / recipes.length
    expect(share((r) => r.shape === 'cube')).toBeGreaterThan(0.4)
    expect(share((r) => r.extra === 'none')).toBeGreaterThan(0.6)
  })
})

describe('palettes', () => {
  it.each([
    ['body', NEXI_BODY_COLORS],
    ['background', NEXI_BACKGROUND_COLORS]
  ])('%s colors have unique ids and valid hex values', (_, colors) => {
    expect(new Set(colors.map((c) => c.id)).size).toBe(colors.length)
    expect(new Set(colors.map((c) => c.hex)).size).toBe(colors.length)
    for (const { hex } of colors) expect(hex).toMatch(/^#[0-9a-f]{6}$/)
  })
})
