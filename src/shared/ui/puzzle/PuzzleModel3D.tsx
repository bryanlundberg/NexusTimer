'use client'

import { useEffect, type CanvasHTMLAttributes, type ReactNode } from 'react'
import { usePuzzle3d } from '@/shared/ui/puzzle/usePuzzle3d'

interface PuzzleModel3DProps extends CanvasHTMLAttributes<HTMLCanvasElement> {
  puzzle: string
  alg: string
  fallback?: ReactNode
}

export default function PuzzleModel3D({ puzzle, alg, fallback = null, ...rest }: PuzzleModel3DProps) {
  const { canvasRef, handle, unsupported } = usePuzzle3d({ puzzle, initialAlg: alg })

  useEffect(() => {
    handle?.show(alg)
  }, [handle, alg])

  if (unsupported) return <>{fallback}</>
  return <canvas ref={canvasRef} {...rest} />
}
