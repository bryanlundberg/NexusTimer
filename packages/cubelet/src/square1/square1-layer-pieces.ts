import { SQUARE1_SLOTS_PER_LAYER, isCornerEnd, isCornerStart } from './square1-pieces'
import type { Square1State } from './square1-state'

export interface LayerPiece {
  readonly lead: number
  readonly second: number | null
  readonly from: number
  readonly leadAtFrom: boolean
}

export const TOP_LAYER = 0
export const BOTTOM_LAYER = SQUARE1_SLOTS_PER_LAYER

export const slotRange = (slot: number): readonly [number, number] => {
  if (slot < SQUARE1_SLOTS_PER_LAYER) return [30 * slot + 15, 30 * slot + 45]
  const center = -30 * (slot - SQUARE1_SLOTS_PER_LAYER)
  return [center - 15, center + 15]
}

export function layerPieces(state: Square1State, first: number): LayerPiece[] {
  const top = first === TOP_LAYER
  const pieces: LayerPiece[] = []
  for (let offset = 0; offset < SQUARE1_SLOTS_PER_LAYER; offset++) {
    const lead = first + offset
    const wedge = state.wedgeAt(lead)
    if (isCornerEnd(wedge)) continue
    const [low] = slotRange(lead)
    if (!isCornerStart(wedge)) {
      pieces.push({ lead, second: null, from: low, leadAtFrom: true })
      continue
    }
    const second = first + ((offset + 1) % SQUARE1_SLOTS_PER_LAYER)
    pieces.push({ lead, second, from: top ? low : low - 30, leadAtFrom: top })
  }
  return pieces
}
