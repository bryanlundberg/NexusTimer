import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { readTwistyCubeConfig } from '@/shared/lib/twisty/readTwistyCubeConfig'

export interface Cube3dScene {
  readonly request: Cube3dRequest
  readonly dragInput: boolean
}

export function twistyConfigToCube3d(config: object | undefined): Cube3dScene | null {
  const settings = readTwistyCubeConfig(config)
  if (!settings || settings.visualization !== '3D') return null

  const { size, alg, stickering, lastLayer, dragInput } = settings
  return { request: { size, alg, stickering, lastLayer }, dragInput }
}
