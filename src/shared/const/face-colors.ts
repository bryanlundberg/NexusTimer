import { Layers } from '@/shared/types/enums'

export const FACE_COLORS = [Layers.WHITE, Layers.YELLOW, Layers.GREEN, Layers.BLUE, Layers.RED, Layers.ORANGE] as const

export const FACE_COLOR_VAR: Record<Layers, string> = {
  [Layers.WHITE]: 'var(--cube-white)',
  [Layers.YELLOW]: 'var(--cube-yellow)',
  [Layers.GREEN]: 'var(--cube-green)',
  [Layers.BLUE]: 'var(--cube-blue)',
  [Layers.RED]: 'var(--cube-red)',
  [Layers.ORANGE]: 'var(--cube-orange)'
}

export function isFaceColor(value: unknown): value is Layers {
  return typeof value === 'string' && (FACE_COLORS as readonly string[]).includes(value)
}

export function sortFaceColors(values: readonly unknown[] | null | undefined): Layers[] {
  if (!values?.length) return []
  return FACE_COLORS.filter((color) => values.includes(color))
}
