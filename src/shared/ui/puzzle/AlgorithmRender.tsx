'use client'

import { useMemo, type CSSProperties, type HTMLAttributes } from 'react'
import { caseCube3d, caseImage, type CaseRender } from '@/shared/lib/puzzle/caseRender'
import { renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'
import CubeImage from '@/shared/ui/puzzle/CubeImage'
import CubeModel3D from '@/shared/ui/puzzle/CubeModel3D'

interface AlgorithmRenderProps extends HTMLAttributes<HTMLDivElement> {
  config?: CaseRender
  interactive?: boolean
  width?: number | string
  height?: number | string
  style?: CSSProperties
}

const toCssSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)

export default function AlgorithmRender(props: AlgorithmRenderProps) {
  const { config, interactive = false, width = 140, height = 140, style, ...rest } = props
  const puzzle = config?.puzzle
  const alg = config?.alg
  const view = config?.viz.view
  const stickering = config?.viz.stickering
  const dragInput = config?.viz.dragInput

  const render = useMemo<CaseRender | null>(
    () =>
      puzzle && view && stickering && alg !== undefined ? { puzzle, alg, viz: { view, stickering, dragInput } } : null,
    [puzzle, alg, view, stickering, dragInput]
  )
  const svg = useMemo(() => (render ? caseImage(render) : null), [render])
  const scene = useMemo(() => (render && !svg ? caseCube3d(render) : null), [render, svg])
  const flat = useMemo(() => (scene ? renderCubeImage({ ...scene.request, view: 'net' }) : null), [scene])
  const sizeStyle = { ...style, width: toCssSize(width), height: toCssSize(height), maxWidth: '100%' }

  if (svg) return <CubeImage {...rest} svg={svg} style={sizeStyle} />
  if (scene) {
    return (
      <CubeModel3D
        request={scene.request}
        dragInput={interactive && scene.dragInput}
        className={rest.className}
        style={{ ...sizeStyle, display: 'block' }}
        fallback={flat ? <CubeImage {...rest} svg={flat} style={sizeStyle} /> : null}
      />
    )
  }
  return <div {...rest} style={sizeStyle} />
}
