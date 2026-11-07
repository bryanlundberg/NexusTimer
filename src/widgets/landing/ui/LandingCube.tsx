'use client'

import { useEffect, useRef, useState } from 'react'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import { useCube3d } from '@/shared/ui/puzzle/useCube3d'
import { DEMO_SEQUENCE } from '../lib/cubeMoves'

const QUARTER_MS = 420
const HALF_MS = 620
const SOLVED: Cube3dRequest = { size: 3, alg: '', stickering: 'full', lastLayer: 'U' }

export default function LandingCube({
  size,
  load,
  move,
  step,
  onTurned
}: {
  size: number
  load: boolean
  move: string | null
  step: number
  onTurned: () => void
}) {
  const [loaded, setLoaded] = useState(load)
  if (load && !loaded) setLoaded(true)
  const { canvasRef, handle } = useCube3d({
    initial: SOLVED,
    enabled: loaded,
    dragInput: false,
    tempoScale: 3,
    ownContext: true
  })
  const appliedStep = useRef(-1)
  const turnTimer = useRef<number | undefined>(undefined)
  const onTurnedRef = useRef(onTurned)

  useEffect(() => {
    onTurnedRef.current = onTurned
  })

  useEffect(() => {
    if (!handle || !move || appliedStep.current === step) return
    appliedStep.current = step
    if (step > 0 && step % DEMO_SEQUENCE.length === 0) handle.show(SOLVED)
    handle.play(move)
    turnTimer.current = window.setTimeout(() => onTurnedRef.current(), move.endsWith('2') ? HALF_MS : QUARTER_MS)
  }, [handle, move, step])

  useEffect(() => () => window.clearTimeout(turnTimer.current), [])

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />
}
