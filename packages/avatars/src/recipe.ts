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

export const DEFAULT_NEXI_RECIPE: NexiRecipe = {
  v: NEXI_RECIPE_VERSION,
  shape: 'cube',
  color: '#5b63f5',
  state: 'idle',
  head: 'none',
  hand: 'none',
  extra: 'none',
  bg: '#2e4a7a',
  pattern: 'hex'
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i

const color = (value: unknown, fallback: string) =>
  typeof value === 'string' && HEX_COLOR.test(value) ? value.toLowerCase() : fallback

function oneOf<T extends string>(options: readonly T[], value: unknown, fallback: T): T {
  return options.find((option) => option === value) ?? fallback
}

export function normalizeNexiRecipe(input: unknown): NexiRecipe {
  const raw: Record<string, unknown> = input && typeof input === 'object' ? { ...input } : {}
  const d = DEFAULT_NEXI_RECIPE
  return {
    v: NEXI_RECIPE_VERSION,
    shape: oneOf(NEXI_SHAPES, raw.shape, d.shape),
    color: color(raw.color, d.color),
    state: oneOf(NEXI_FACES, raw.state, d.state),
    head: oneOf(NEXI_HEADS, raw.head, d.head),
    hand: oneOf(NEXI_HELD_ITEMS, raw.hand, d.hand),
    extra: oneOf(NEXI_EXTRAS, raw.extra, d.extra),
    bg: color(raw.bg, d.bg),
    pattern: oneOf(NEXI_PATTERNS, raw.pattern, d.pattern)
  }
}
