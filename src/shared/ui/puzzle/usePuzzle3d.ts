import { useEffect, useRef, useState } from 'react'
import type { Puzzle3dHandle } from '@/shared/lib/puzzle/mountPuzzle3d'

interface UsePuzzle3dOptions {
  readonly puzzle: string
  readonly initialAlg: string
  readonly tempoScale?: number
}

export function usePuzzle3d({ puzzle, initialAlg, tempoScale }: UsePuzzle3dOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initialAlgRef = useRef(initialAlg)
  const tempoRef = useRef(tempoScale)
  const [handle, setHandle] = useState<Puzzle3dHandle | null>(null)
  const [unsupportedPuzzle, setUnsupportedPuzzle] = useState<string | null>(null)

  useEffect(() => {
    initialAlgRef.current = initialAlg
    tempoRef.current = tempoScale
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let mounted: Puzzle3dHandle | null = null
    let observer: ResizeObserver | null = null

    import('@/shared/lib/puzzle/mountPuzzle3d').then(({ mountPuzzle3d }) => {
      if (cancelled) return
      mounted = mountPuzzle3d(canvas, puzzle, initialAlgRef.current, { tempoScale: tempoRef.current })
      if (!mounted) {
        setUnsupportedPuzzle(puzzle)
        return
      }
      const current = mounted
      observer = new ResizeObserver(() => current.resize())
      observer.observe(canvas)
      setHandle(current)
    })

    return () => {
      cancelled = true
      observer?.disconnect()
      mounted?.dispose()
      setHandle(null)
    }
  }, [puzzle])

  useEffect(() => {
    if (handle && tempoScale !== undefined) handle.setTempoScale(tempoScale)
  }, [handle, tempoScale])

  return { canvasRef, handle, unsupported: unsupportedPuzzle === puzzle }
}
