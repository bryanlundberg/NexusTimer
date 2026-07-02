import { useCallback, useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { CubeEngine } from 'cube-state-engine'
import { disposeTwistyPlayer } from '@/shared/lib/twisty/disposeTwistyPlayer'

interface UseVirtualCubeArgs {
  cubeSize: number
  scramble: string | null
  seed?: boolean
  tempoScale?: number
  dragInput?: 'auto' | 'none'
  sizePx?: string
  cameraDistance?: number
}

const PLAYER_SIZE_PX = 'min(320px, 30vw)'

interface PlayerOptions {
  seed?: boolean
  tempoScale?: number
  dragInput?: 'auto' | 'none'
  sizePx?: string
  cameraDistance?: number
}

const buildPlayer = (cubeSize: number, scramble: string | null, opts?: PlayerOptions) => {
  const player = new TwistyPlayer({
    puzzle: cubeSize === 2 ? '2x2x2' : '3x3x3',
    controlPanel: 'none',
    tempoScale: opts?.tempoScale ?? 3,
    background: 'none',
    ...(opts?.cameraDistance != null ? { cameraDistance: opts.cameraDistance } : {}),
    ...(opts?.dragInput ? { experimentalDragInput: opts.dragInput } : {})
  })
  const size = opts?.sizePx ?? PLAYER_SIZE_PX
  player.style.width = size
  player.style.height = size
  if (opts?.seed !== false && scramble) {
    try {
      player.experimentalSetupAlg = scramble
    } catch {}
  }
  return player
}

export function useVirtualCube({
  cubeSize,
  scramble,
  seed = true,
  tempoScale,
  dragInput,
  sizePx,
  cameraDistance
}: UseVirtualCubeArgs) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [player, setPlayer] = useState<TwistyPlayer | null>(null)
  const [engine, setEngine] = useState<CubeEngine | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    disposeTwistyPlayer(player)

    const newEngine = new CubeEngine('', { size: cubeSize })
    const newPlayer = buildPlayer(cubeSize, scramble, { seed, tempoScale, dragInput, sizePx, cameraDistance })
    containerRef.current.appendChild(newPlayer)

    if (seed && scramble) {
      try {
        newEngine.reset()
        newEngine.applyMoves(scramble)
      } catch {}
    }

    setPlayer(newPlayer)
    setEngine(newEngine)

    return () => {
      disposeTwistyPlayer(newPlayer)
    }
  }, [cubeSize])

  useEffect(() => {
    if (!seed) return
    if (!player || !engine || !scramble) return
    try {
      player.experimentalSetupAlg = scramble
      engine.reset()
      engine.applyMoves(scramble)
    } catch {}
  }, [player, engine, scramble, seed])

  const recreatePlayer = useCallback(() => {
    if (!containerRef.current) return
    disposeTwistyPlayer(player)
    const newPlayer = buildPlayer(cubeSize, scramble, { seed, tempoScale, dragInput, sizePx, cameraDistance })
    containerRef.current.appendChild(newPlayer)
    setPlayer(newPlayer)
  }, [player, cubeSize, scramble, seed, tempoScale, dragInput, sizePx, cameraDistance])

  return { containerRef, player, engine, recreatePlayer }
}
