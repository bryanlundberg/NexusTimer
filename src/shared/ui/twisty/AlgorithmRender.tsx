'use client'

import { useMemo } from 'react'
import { renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'
import { twistyConfigToCube3d } from '@/shared/lib/twisty/twistyConfigToCube3d'
import { twistyConfigToCubeImage } from '@/shared/lib/twisty/twistyConfigToCubeImage'
import { twistyConfigToPuzzleImage } from '@/shared/lib/twisty/twistyConfigToPuzzleImage'
import CubeImage from '@/shared/ui/puzzle/CubeImage'
import CubeModel3D from '@/shared/ui/puzzle/CubeModel3D'
import type { AlgorithmRenderProps } from '@/shared/ui/twisty/algorithmRenderProps'

const toCssSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)

export default function AlgorithmRender(props: AlgorithmRenderProps) {
  const { config, width = 140, height = 140, style, ...rest } = props

  const svg = useMemo(() => {
    const request = twistyConfigToCubeImage(config)
    return request ? renderCubeImage(request) : twistyConfigToPuzzleImage(config)
  }, [config])
  const scene = useMemo(() => (svg ? null : twistyConfigToCube3d(config)), [svg, config])
  const flat = useMemo(() => (scene ? renderCubeImage({ ...scene.request, view: 'net' }) : null), [scene])
  const sizeStyle = { ...style, width: toCssSize(width), height: toCssSize(height), maxWidth: '100%' }

  if (svg) return <CubeImage {...rest} svg={svg} style={sizeStyle} />
  if (scene) {
    return (
      <CubeModel3D
        request={scene.request}
        dragInput={scene.dragInput}
        className={rest.className}
        style={{ ...sizeStyle, display: 'block' }}
        fallback={flat ? <CubeImage {...rest} svg={flat} style={sizeStyle} /> : null}
      />
    )
  }
  return <div {...rest} style={sizeStyle} />
}
