import * as z from 'zod'

export const NEXI_RECIPE_VERSION = 1

export const NEXI_SHAPES = ['cube', 'skewb', 'square1', 'megaminx', 'pyraminx'] as const
export type NexiShape = (typeof NEXI_SHAPES)[number]

export const NEXI_FACES = [
  'idle',
  'confident',
  'hello',
  'wink',
  'cool',
  'focus',
  'xd',
  'tongue',
  'surprised',
  'starry',
  'pb',
  'think',
  'solving',
  'angry',
  'rage',
  'sad',
  'oops',
  'dizzy',
  'empty',
  'sleep'
] as const
export type NexiFace = (typeof NEXI_FACES)[number]

export const NEXI_HEADS = [
  'none',
  'headset',
  'cap',
  'capback',
  'beanie',
  'headband',
  'crown',
  'tophat',
  'gradcap',
  'hardhat',
  'viking',
  'astronaut',
  'wizard',
  'chef',
  'party',
  'propeller',
  'halo',
  'horns',
  'cat',
  'antenna',
  'minicube'
] as const
export type NexiHead = (typeof NEXI_HEADS)[number]

export const NEXI_HELD_ITEMS = [
  'none',
  'cube',
  'pocket',
  'pyraminx',
  'megaminx',
  'stackmat',
  'stopwatch',
  'trophy',
  'medal',
  'lube',
  'bottle',
  'mic',
  'cup',
  'coffee',
  'gamepad'
] as const
export type NexiHeldItem = (typeof NEXI_HELD_ITEMS)[number]

export const NEXI_EXTRAS = [
  'none',
  'glasses',
  'shades',
  'blindfold',
  'patch',
  'mustache',
  'bandaid',
  'freckles',
  'sparkles',
  'sweat',
  'tears',
  'speed',
  'steam'
] as const
export type NexiExtra = (typeof NEXI_EXTRAS)[number]

export const NEXI_PATTERNS = [
  'none',
  'hex',
  'lines',
  'gridlines',
  'rays',
  'grid',
  'stripes',
  'checker',
  'cubes',
  'gradient'
] as const
export type NexiPattern = (typeof NEXI_PATTERNS)[number]

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

export const nexiRecipeSchema = z.object({
  v: z.literal(NEXI_RECIPE_VERSION),
  shape: z.enum(NEXI_SHAPES),
  color: z.string().regex(HEX_COLOR_PATTERN, 'Invalid color'),
  state: z.enum(NEXI_FACES),
  head: z.enum(NEXI_HEADS),
  hand: z.enum(NEXI_HELD_ITEMS),
  extra: z.enum(NEXI_EXTRAS),
  bg: z.string().regex(HEX_COLOR_PATTERN, 'Invalid color'),
  pattern: z.enum(NEXI_PATTERNS)
})

export type NexiRecipe = z.infer<typeof nexiRecipeSchema>
