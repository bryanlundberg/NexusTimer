import { useCallback, useEffect, useMemo } from 'react'
import { CubeEngine, type CubeSize } from 'cube-state-engine'
import type { Cube3dRequest } from '@/shared/lib/puzzle/cube3dRequest'
import type { MovePlayer } from '@/shared/lib/puzzle/movePlayer'
import { useCube3d } from '@/shared/ui/puzzle/useCube3d'

type HintFacelets = 'auto' | 'floating' | 'none'

interface UseVirtualCubeArgs {
  cubeSize: CubeSize
  scramble: string | null
  seed?: boolean
  tempoScale?: number
  dragInput?: 'auto' | 'none'
  sizePx?: string
  cameraDistance?: number
  hintFacelets?: HintFacelets
}

const PLAYER_SIZE_PX = 'min(320px, 30vw)'

export function useVirtualCube({
  cubeSize,
  scramble,
  seed = true,
  tempoScale = 3,
  dragInput,
  sizePx = PLAYER_SIZE_PX,
  cameraDistance,
  hintFacelets = 'none'
}: UseVirtualCubeArgs) {
  const initial = useMemo<Cube3dRequest>(
    () => ({ size: cubeSize, alg: seed && scramble ? scramble : '', stickering: 'full', lastLayer: 'U' }),
    [cubeSize, scramble, seed]
  )
  const { canvasRef, handle } = useCube3d({
    initial,
    tempoScale,
    cameraDistance,
    dragInput: dragInput !== 'none',
    hintFacelets: hintFacelets !== 'none',
    ownContext: true
  })
  const engine = useMemo(() => new CubeEngine('', { size: cubeSize }), [cubeSize])

  useEffect(() => {
    handle?.show(initial)
  }, [handle, initial])

  useEffect(() => {
    if (!seed || !scramble) return
    try {
      engine.reset()
      engine.applyMoves(scramble)
    } catch {}
  }, [engine, scramble, seed])

  const recreatePlayer = useCallback(() => handle?.show(initial), [handle, initial])
  const player: MovePlayer | null = handle
  const canvasStyle = useMemo(() => ({ width: sizePx, height: sizePx, display: 'block' }), [sizePx])

  return { canvasRef, canvasStyle, player, engine, recreatePlayer }
}
