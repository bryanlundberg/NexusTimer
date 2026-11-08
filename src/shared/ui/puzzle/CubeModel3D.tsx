'use client'

import { useEffect, type CanvasHTMLAttributes, type ReactNode } from 'react'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { useCube3d } from '@/shared/ui/puzzle/useCube3d'

interface CubeModel3DProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  request: Cube3dRequest
  dragInput?: boolean
  fallback?: ReactNode
}

export default function CubeModel3D({ request, dragInput = true, fallback = null, ...rest }: CubeModel3DProps) {
  const { canvasRef, handle, unsupported } = useCube3d({ initial: request, dragInput })

  useEffect(() => {
    handle?.show(request)
  }, [handle, request])

  if (unsupported) return <>{fallback}</>
  return <canvas ref={canvasRef} {...rest} />
}
