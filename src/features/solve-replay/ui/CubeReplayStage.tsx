'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { ReplayView } from '@/features/solve-replay/model/replayView'
import { FULL_COLOR_STICKERING, type Cube3dRequest, type Cube3dStickering } from '@/shared/lib/puzzle/cube3dRequest'
import { useCube3d } from '@/shared/ui/puzzle/useCube3d'

interface CubeReplayStageProps {
  replay: SolveReplay
  cubeSize: number
  size: number
  tempoScale: number
  stickering?: Cube3dStickering
  onReady: (view: ReplayView | null) => void
}

export default function CubeReplayStage({
  replay,
  cubeSize,
  size,
  tempoScale,
  stickering = FULL_COLOR_STICKERING,
  onReady
}: CubeReplayStageProps) {
  const initial = useMemo<Cube3dRequest>(
    () => ({ size: cubeSize, alg: replay.scramble, ...stickering }),
    [cubeSize, replay.scramble, stickering]
  )
  const { canvasRef, handle } = useCube3d({ initial, tempoScale, ownContext: true, turnSound: true })
  const onReadyRef = useRef(onReady)

  useEffect(() => {
    onReadyRef.current = onReady
  })

  useEffect(() => {
    if (!handle) return
    handle.show(initial)
    onReadyRef.current({
      jumpTo: (moves) => handle.show({ ...initial, alg: [initial.alg, ...moves].join(' ') }),
      animate: (move) => handle.play(move)
    })
    return () => onReadyRef.current(null)
  }, [handle, initial])

  return <canvas ref={canvasRef} style={{ width: size, height: size, maxWidth: '100%', display: 'block' }} />
}
