import type { SolveAnalysis } from 'cube-state-engine'
import { Layers } from '@/shared/types/enums'

const COLOR_LAYER = {
  W: Layers.WHITE,
  Y: Layers.YELLOW,
  G: Layers.GREEN,
  B: Layers.BLUE,
  R: Layers.RED,
  O: Layers.ORANGE
} as const

export function startFaceLayer(analysis: SolveAnalysis | null | undefined): Layers | null {
  const color = analysis?.startFace?.color
  return color ? COLOR_LAYER[color] : null
}
