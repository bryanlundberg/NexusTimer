import type { CrossFace } from '@nexustimer/cube-solver-rs'
import { Layers } from '@/shared/types/enums'

export const SCRAMBLE_MAX_HEIGHT_RATIO = 0.25

export const SCRAMBLE_GUIDE_MAX_MOVES = 20

export const HINT_CATEGORIES = ['3x3', '3x3 OH'] as const

export const CROSS_FACE_COLOR: Record<CrossFace, Layers> = {
  U: Layers.WHITE,
  D: Layers.YELLOW,
  F: Layers.GREEN,
  B: Layers.BLUE,
  R: Layers.RED,
  L: Layers.ORANGE
}

export const XCROSS_SLOTS = [
  { label: 'FL', iconClassName: 'rotate-180' },
  { label: 'BL', iconClassName: '-rotate-90' },
  { label: 'BR', iconClassName: '' },
  { label: 'FR', iconClassName: 'rotate-90' }
] as const

export const SCRAMBLE_SIZE_CLASSES = {
  large: 'text-2xl md:text-3xl lg:text-4xl',
  normal: 'text-xl md:text-2xl lg:text-3xl'
} as const
