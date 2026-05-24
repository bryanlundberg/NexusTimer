import { useCallback, useEffect, useRef, useState } from 'react'
import { TwistyPlayer } from 'cubing/twisty'
import { CubeEngine } from 'cube-state-engine'

interface UseVirtualCubeArgs {
  cubeSize: number
  scramble: string | null
}

const PLAYER_SIZE_PX = '320px'

const buildPlayer = (cubeSize: number, scramble: string | null) => {
  const player = new TwistyPlayer({
    puzzle: cubeSize === 2 ? '2x2x2' : '3x3x3',
    controlPanel: 'none',
    tempoScale: 3,
    background: 'none'
  })
  player.style.width = PLAYER_SIZE_PX
  player.style.height = PLAYER_SIZE_PX
  if (scramble) {
    try {
      player.experimentalSetupAlg = scramble
    } catch {}
  }
  return player
}

export function useVirtualCube({ cubeSize, scramble }: UseVirtualCubeArgs) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [player, setPlayer] = useState<TwistyPlayer | null>(null)
  const [engine, setEngine] = useState<CubeEngine | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      player?.remove()
    } catch {}

    const newEngine = new CubeEngine('', { size: cubeSize })
    const newPlayer = buildPlayer(cubeSize, scramble)
    containerRef.current.appendChild(newPlayer)

    if (scramble) {
      try {
        newEngine.reset()
        newEngine.applyMoves(scramble)
      } catch {}
    }

    setPlayer(newPlayer)
    setEngine(newEngine)

    return () => {
      try {
        newPlayer.remove()
      } catch {}
    }
  }, [cubeSize])

  useEffect(() => {
    if (!player || !engine || !scramble) return
    try {
      player.experimentalSetupAlg = scramble
      engine.reset()
      engine.applyMoves(scramble)
    } catch {}
  }, [player, engine, scramble])

  const recreatePlayer = useCallback(() => {
    if (!containerRef.current) return
    try {
      player?.remove()
    } catch {}
    const newPlayer = buildPlayer(cubeSize, scramble)
    containerRef.current.appendChild(newPlayer)
    setPlayer(newPlayer)
  }, [player, cubeSize, scramble])

  return { containerRef, player, engine, recreatePlayer }
}
