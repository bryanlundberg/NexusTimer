import { useMemo } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { cubeSizeOf, renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'
import CubeImage from '@/shared/ui/puzzle/CubeImage'
import CubeModel3D from '@/shared/ui/puzzle/CubeModel3D'
import type { ScrambleDisplayProps } from '@/shared/ui/scramble-display/ui/scrambleDisplayProps'
import TwistyScrambleDisplay from '@/shared/ui/scramble-display/ui/TwistyScrambleDisplay'

export default function ScrambleDisplay(props: ScrambleDisplayProps) {
  const { show, scramble, event, visualization = '2D', puzzle, className, ...rest } = props
  const size = cubeSizeOf(puzzle ?? cubeCollection.find((item) => item.name === event)?.displayId ?? '3x3x3')

  const svg = useMemo(
    () => (show && size && visualization === '2D' ? renderCubeImage({ size, alg: scramble ?? '', view: 'net' }) : null),
    [show, size, visualization, scramble]
  )
  const request = useMemo<Cube3dRequest | null>(
    () =>
      show && size && visualization === '3D' ? { size, alg: scramble ?? '', stickering: 'full', lastLayer: 'U' } : null,
    [show, size, visualization, scramble]
  )

  if (!show) return null
  if (svg) return <CubeImage {...rest} svg={svg} className={className} id="scramble-display" />
  if (request) {
    return (
      <CubeModel3D
        request={request}
        className={className}
        id="scramble-display"
        style={{ display: 'block', width: '100%', height: '100%', aspectRatio: '1' }}
        fallback={<TwistyScrambleDisplay {...props} />}
      />
    )
  }
  return <TwistyScrambleDisplay {...props} />
}
