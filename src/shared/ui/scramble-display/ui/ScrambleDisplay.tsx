import { useMemo } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import { cubeSizeOf, renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'
import CubeImage from '@/shared/ui/puzzle/CubeImage'
import type { ScrambleDisplayProps } from '@/shared/ui/scramble-display/ui/scrambleDisplayProps'
import TwistyScrambleDisplay from '@/shared/ui/scramble-display/ui/TwistyScrambleDisplay'

export default function ScrambleDisplay(props: ScrambleDisplayProps) {
  const { show, scramble, event, visualization = '2D', puzzle, className, ...rest } = props

  const svg = useMemo(() => {
    if (!show || visualization !== '2D') return null
    const size = cubeSizeOf(puzzle ?? cubeCollection.find((item) => item.name === event)?.displayId ?? '3x3x3')
    return size ? renderCubeImage({ size, alg: scramble ?? '', view: 'net' }) : null
  }, [show, visualization, puzzle, event, scramble])

  if (!show) return null
  if (!svg) return <TwistyScrambleDisplay {...props} />
  return <CubeImage {...rest} svg={svg} className={className} id="scramble-display" />
}
