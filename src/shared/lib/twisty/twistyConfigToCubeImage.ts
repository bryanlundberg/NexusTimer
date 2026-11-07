import { cubeSizeOf, type CubeImageRequest, type CubeImageView } from '@/shared/lib/puzzle/renderCubeImage'

interface TwistyImageConfig {
  puzzle?: unknown
  visualization?: unknown
  alg?: unknown
  experimentalSetupAlg?: unknown
  experimentalStickering?: unknown
  experimentalStickeringMaskOrbits?: unknown
}

const VIEW_BY_VISUALIZATION: Readonly<Record<string, CubeImageView>> = {
  '2D': 'net',
  'experimental-2D-LL': 'last-layer'
}

export function twistyConfigToCubeImage(config: object | undefined): CubeImageRequest | null {
  const twisty = (config ?? {}) as TwistyImageConfig
  const size = cubeSizeOf(String(twisty.puzzle ?? '3x3x3'))
  const view = VIEW_BY_VISUALIZATION[String(twisty.visualization ?? '')]
  if (!size || !view || String(twisty.alg ?? '').trim() !== '') return null

  return {
    size,
    view,
    alg: String(twisty.experimentalSetupAlg ?? ''),
    stickering: String(twisty.experimentalStickering ?? 'full'),
    lastLayer: twisty.experimentalStickeringMaskOrbits ? 'D' : 'U'
  }
}
