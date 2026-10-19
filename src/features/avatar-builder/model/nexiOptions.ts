import { NEXI_BACKGROUND_COLORS, NEXI_BODY_COLORS } from '@nexustimer/avatars'
import {
  NEXI_EXTRAS,
  NEXI_FACES,
  NEXI_HEADS,
  NEXI_HELD_ITEMS,
  NEXI_PATTERNS,
  NEXI_SHAPES,
  type NexiRecipe,
  type NexiShape
} from '@nexustimer/contracts'

export const BUILDER_TABS = ['shape', 'color', 'state', 'head', 'hand', 'extra', 'background'] as const
export type BuilderTab = (typeof BUILDER_TABS)[number]

export type OptionSlot = 'shape' | 'state' | 'head' | 'hand' | 'extra' | 'pattern'
export type RemovableSlot = 'head' | 'hand' | 'extra'

export const REMOVABLE_SLOTS: readonly RemovableSlot[] = ['head', 'hand', 'extra']

export const SLOT_OPTIONS = {
  shape: NEXI_SHAPES,
  state: NEXI_FACES,
  head: NEXI_HEADS,
  hand: NEXI_HELD_ITEMS,
  extra: NEXI_EXTRAS,
  pattern: NEXI_PATTERNS
} as const satisfies Record<OptionSlot, readonly string[]>

export const SLOT_MESSAGES = {
  state: 'faces',
  head: 'heads',
  hand: 'items',
  extra: 'extras',
  pattern: 'patterns'
} as const satisfies Record<Exclude<OptionSlot, 'shape'>, string>

export const SHAPE_LABELS: Record<NexiShape, string> = {
  cube: '3x3',
  skewb: 'Skewb',
  square1: 'Square-1',
  megaminx: 'Megaminx',
  pyraminx: 'Pyraminx'
}

export const BODY_COLORS = NEXI_BODY_COLORS
export const BACKGROUND_COLORS = NEXI_BACKGROUND_COLORS

export type ColorSlot = Extract<keyof NexiRecipe, 'color' | 'bg'>
