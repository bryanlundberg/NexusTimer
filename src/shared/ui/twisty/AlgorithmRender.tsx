'use client'

import { useMemo } from 'react'
import { renderCubeImage } from '@/shared/lib/puzzle/renderCubeImage'
import { twistyConfigToCubeImage } from '@/shared/lib/twisty/twistyConfigToCubeImage'
import CubeImage from '@/shared/ui/puzzle/CubeImage'
import type { AlgorithmRenderProps } from '@/shared/ui/twisty/algorithmRenderProps'
import TwistyAlgorithmRender from '@/shared/ui/twisty/TwistyAlgorithmRender'

const toCssSize = (size: number | string) => (typeof size === 'number' ? `${size}px` : size)

export default function AlgorithmRender(props: AlgorithmRenderProps) {
  const { config, width = 140, height = 140, style, ...rest } = props

  const svg = useMemo(() => {
    const request = twistyConfigToCubeImage(config)
    return request ? renderCubeImage(request) : null
  }, [config])

  if (!svg) return <TwistyAlgorithmRender {...props} />
  return (
    <CubeImage
      {...rest}
      svg={svg}
      style={{ ...style, width: toCssSize(width), height: toCssSize(height), maxWidth: '100%' }}
    />
  )
}
