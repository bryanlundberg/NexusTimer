import { useMemo } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { cubeSizeOf } from '@/shared/lib/puzzle/renderCubeImage'
import { renderScrambleImage } from '@/shared/lib/puzzle/renderScrambleImage'
import CubeImage from '@/shared/ui/puzzle/CubeImage'
import CubeModel3D from '@/shared/ui/puzzle/CubeModel3D'
import PuzzleModel3D from '@/shared/ui/puzzle/PuzzleModel3D'
import type { ScrambleDisplayProps } from '@/shared/ui/scramble-display/ui/scrambleDisplayProps'

const CANVAS_STYLE = { display: 'block', aspectRatio: '1' } as const

export default function ScrambleDisplay(props: ScrambleDisplayProps) {
  const { show, scramble, event, visualization = '2D', puzzle, className, ...rest } = props
  const puzzleId = puzzle ?? cubeCollection.find((item) => item.name === event)?.displayId ?? '3x3x3'
  const size = cubeSizeOf(puzzleId)
  const threeD = visualization === '3D' && size !== null

  const svg = useMemo(() => (show ? renderScrambleImage(puzzleId, scramble ?? '') : null), [show, puzzleId, scramble])
  const request = useMemo<Cube3dRequest | null>(
    () => (show && threeD && size ? { size, alg: scramble ?? '', stickering: 'full', lastLayer: 'U' } : null),
    [show, threeD, size, scramble]
  )

  if (!show) return null
  const image = svg ? <CubeImage {...rest} svg={svg} className={className} id="scramble-display" /> : null
  if (request) {
    return (
      <CubeModel3D
        request={request}
        className={className}
        id="scramble-display"
        style={CANVAS_STYLE}
        fallback={image}
      />
    )
  }
  if (visualization === '3D' && size === null) {
    return (
      <PuzzleModel3D
        puzzle={puzzleId}
        alg={scramble ?? ''}
        className={className}
        id="scramble-display"
        style={CANVAS_STYLE}
        fallback={image}
      />
    )
  }
  return image ?? <div {...rest} className={className} id="scramble-display" />
}
