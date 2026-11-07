import { rect } from '../shapes'

export const STICKER_GAP = 0.045
export const EDGE_PADDING = 0.1
export const OUTLINE_WIDTH = 0.035

export const sticker = (x: number, y: number, width = 1, height = 1): number[] =>
  rect(x + STICKER_GAP, y + STICKER_GAP, width - 2 * STICKER_GAP, height - 2 * STICKER_GAP)
