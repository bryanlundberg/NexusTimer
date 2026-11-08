import { rect } from '../shapes'
import { STICKER_GAP } from '../sticker-style'

export { EDGE_PADDING, OUTLINE_WIDTH, STICKER_GAP } from '../sticker-style'

export const sticker = (x: number, y: number, width = 1, height = 1): number[] =>
  rect(x + STICKER_GAP, y + STICKER_GAP, width - 2 * STICKER_GAP, height - 2 * STICKER_GAP)
