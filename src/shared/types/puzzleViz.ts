export type PuzzleId =
  | '2x2x2'
  | '3x3x3'
  | '4x4x4'
  | '5x5x5'
  | '6x6x6'
  | '7x7x7'
  | 'pyraminx'
  | 'skewb'
  | 'megaminx'
  | 'square1'
  | 'clock'
  | 'fto'

export interface PuzzleVizConfig {
  readonly puzzle?: string
  readonly visualization?: string
  readonly alg?: string
  readonly experimentalSetupAlg?: string
  readonly experimentalSetupAnchor?: string
  readonly experimentalStickering?: string
  readonly experimentalStickeringMaskOrbits?: string
  readonly experimentalDragInput?: string
  readonly hintFacelets?: string
  readonly background?: string
  readonly controlPanel?: string
  readonly cameraDistance?: number
  readonly cameraLongitude?: number
  readonly tempoScale?: number
}
