import { cubeSizeOf } from '@/shared/lib/puzzle/renderCubeImage'

interface TwistyCubeConfig {
  puzzle?: unknown
  visualization?: unknown
  alg?: unknown
  experimentalSetupAlg?: unknown
  experimentalStickering?: unknown
  experimentalStickeringMaskOrbits?: unknown
  experimentalDragInput?: unknown
}

export interface TwistyCubeSettings {
  readonly size: number
  readonly visualization: string
  readonly alg: string
  readonly stickering: string
  readonly lastLayer: 'U' | 'D'
  readonly dragInput: boolean
}

export function readTwistyCubeConfig(config: object | undefined): TwistyCubeSettings | null {
  const twisty = (config ?? {}) as TwistyCubeConfig
  const size = cubeSizeOf(String(twisty.puzzle ?? '3x3x3'))
  if (!size || String(twisty.alg ?? '').trim() !== '') return null

  return {
    size,
    visualization: String(twisty.visualization ?? ''),
    alg: String(twisty.experimentalSetupAlg ?? ''),
    stickering: String(twisty.experimentalStickering ?? 'full'),
    lastLayer: twisty.experimentalStickeringMaskOrbits ? 'D' : 'U',
    dragInput: twisty.experimentalDragInput !== 'none'
  }
}
