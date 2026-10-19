import {
  NEXI_EXTRAS,
  NEXI_FACES,
  NEXI_HEADS,
  NEXI_HELD_ITEMS,
  NEXI_PATTERNS,
  NEXI_RECIPE_VERSION,
  NEXI_SHAPES,
  type NexiRecipe
} from '@nexustimer/contracts'
import { NEXI_BACKGROUND_COLORS, NEXI_BODY_COLORS } from './palettes'
import { DEFAULT_NEXI_RECIPE } from './recipe'

type Random = () => number

const MAX_ACCESSORIES = 2

function hashSeed(text: string) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number): Random {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T extends string>(
  rand: Random,
  options: readonly [T, ...T[]],
  weights: Partial<Record<T, number>> = {}
): T {
  const weightOf = (option: T) => weights[option] ?? 1
  const total = options.reduce((sum, option) => sum + weightOf(option), 0)
  let r = rand() * total
  for (const option of options) {
    r -= weightOf(option)
    if (r < 0) return option
  }
  return options[0]
}

function pickItem<T>(rand: Random, items: readonly T[], fallback: T): T {
  return items[Math.floor(rand() * items.length)] ?? fallback
}

export function randomNexiRecipe(seed: string): NexiRecipe {
  const rand = rng(hashSeed(seed))
  const recipe: NexiRecipe = {
    v: NEXI_RECIPE_VERSION,
    shape: pick(rand, NEXI_SHAPES, { cube: 4 }),
    color:
      rand() < 0.3
        ? DEFAULT_NEXI_RECIPE.color
        : pickItem(
            rand,
            NEXI_BODY_COLORS.map((c) => c.hex),
            DEFAULT_NEXI_RECIPE.color
          ),
    state: pick(rand, NEXI_FACES, {
      idle: 5,
      confident: 2,
      hello: 3,
      wink: 2,
      cool: 2,
      focus: 2,
      angry: 0.4,
      rage: 0.4,
      sad: 0.3,
      oops: 0.3,
      dizzy: 0.3,
      empty: 0.4,
      sleep: 0.4
    }),
    head: pick(rand, NEXI_HEADS, { none: 7, headset: 2, cap: 1.5, capback: 1.5, beanie: 1.2, headband: 1.2 }),
    hand: pick(rand, NEXI_HELD_ITEMS, { none: 4, cube: 4, stackmat: 2, pocket: 1.2, stopwatch: 1.2, bottle: 1 }),
    extra: pick(rand, NEXI_EXTRAS, { none: 12, blindfold: 0.5, tears: 0.2, steam: 0.3 }),
    bg: pickItem(
      rand,
      NEXI_BACKGROUND_COLORS.map((c) => c.hex),
      DEFAULT_NEXI_RECIPE.bg
    ),
    pattern: pick(rand, NEXI_PATTERNS, { none: 4, hex: 3, lines: 3, gridlines: 2, gradient: 2 })
  }
  if ([recipe.head, recipe.hand, recipe.extra].filter((key) => key !== 'none').length > MAX_ACCESSORIES)
    recipe.extra = 'none'
  return recipe
}
