import type { CubeImageRequest, CubeImageView } from '@/shared/lib/puzzle/renderCubeImage'
import { readTwistyCubeConfig } from '@/shared/lib/twisty/readTwistyCubeConfig'

const VIEW_BY_VISUALIZATION: Readonly<Record<string, CubeImageView>> = {
  '2D': 'net',
  'experimental-2D-LL': 'last-layer'
}

export function twistyConfigToCubeImage(config: object | undefined): CubeImageRequest | null {
  const settings = readTwistyCubeConfig(config)
  const view = settings && VIEW_BY_VISUALIZATION[settings.visualization]
  if (!settings || !view) return null

  const { size, alg, stickering, lastLayer } = settings
  return { size, view, alg, stickering, lastLayer }
}
