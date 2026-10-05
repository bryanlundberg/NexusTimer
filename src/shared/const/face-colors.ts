import { Layers } from '@nexustimer/contracts'

export { FACE_COLORS, isFaceColor, sortFaceColors } from '@nexustimer/contracts'

export const FACE_COLOR_VAR: Record<Layers, string> = {
  [Layers.WHITE]: 'var(--cube-white)',
  [Layers.YELLOW]: 'var(--cube-yellow)',
  [Layers.GREEN]: 'var(--cube-green)',
  [Layers.BLUE]: 'var(--cube-blue)',
  [Layers.RED]: 'var(--cube-red)',
  [Layers.ORANGE]: 'var(--cube-orange)'
}
