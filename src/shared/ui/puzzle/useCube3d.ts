import { useEffect, useRef, useState } from 'react'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import type { Cube3dHandle } from '@/shared/lib/puzzle/mountCube3d'

interface UseCube3dOptions {
  readonly initial: Cube3dRequest
  readonly enabled?: boolean
  readonly dragInput?: boolean
  readonly tempoScale?: number
  readonly cameraDistance?: number
  readonly hintFacelets?: boolean
  readonly ownContext?: boolean
  readonly turnSound?: boolean
}

export function useCube3d({
  initial,
  enabled = true,
  dragInput = true,
  tempoScale,
  cameraDistance,
  hintFacelets = false,
  ownContext = false,
  turnSound = false
}: UseCube3dOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initialRef = useRef(initial)
  const tempoRef = useRef(tempoScale)
  const [handle, setHandle] = useState<Cube3dHandle | null>(null)
  const [unsupported, setUnsupported] = useState(false)
  const { size } = initial

  useEffect(() => {
    initialRef.current = initial
    tempoRef.current = tempoScale
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!enabled || !canvas) return
    let cancelled = false
    let mounted: Cube3dHandle | null = null
    let observer: ResizeObserver | null = null
    const preparing = new AbortController()

    import('@/shared/lib/puzzle/mountCube3d').then(async ({ mountCube3d, prepareCube3d }) => {
      await prepareCube3d(size, preparing.signal)
      if (cancelled) return
      const options = { dragInput, tempoScale: tempoRef.current, cameraDistance, hintFacelets, ownContext, turnSound }
      mounted = mountCube3d(canvas, { ...initialRef.current, size }, options)
      if (!mounted) {
        setUnsupported(true)
        return
      }
      const current = mounted
      observer = new ResizeObserver(() => current.resize())
      observer.observe(canvas)
      setHandle(current)
    })

    return () => {
      cancelled = true
      preparing.abort()
      observer?.disconnect()
      mounted?.dispose()
      setHandle(null)
    }
  }, [enabled, size, dragInput, cameraDistance, hintFacelets, ownContext, turnSound])

  useEffect(() => {
    if (handle && tempoScale !== undefined) handle.setTempoScale(tempoScale)
  }, [handle, tempoScale])

  return { canvasRef, handle, unsupported }
}
