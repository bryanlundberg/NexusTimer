import { useCallback, useEffect, useRef, useState } from 'react'
import type { TwistyPlayer } from 'cubing/twisty'
import type { SolveReplay } from '@/entities/replay/model/types'

export type ReplayStatus = 'idle' | 'playing' | 'paused' | 'done'

interface UseRealtimeReplayArgs {
  player: TwistyPlayer | null
  replay: SolveReplay | null | undefined
}

export function useRealtimeReplay({ player, replay }: UseRealtimeReplayArgs) {
  const [status, setStatus] = useState<ReplayStatus>('idle')
  const [speed, setSpeed] = useState(1)

  const idxRef = useRef(0)
  const lastMoveTimeRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const clearPending = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const resetCube = useCallback(() => {
    if (!player) return
    try {
      player.alg = ''
    } catch {}
  }, [player])

  const scheduleNext = useCallback(() => {
    if (!player || !replay) return
    const { moves } = replay
    if (idxRef.current >= moves.length) {
      setStatus('done')
      return
    }
    const target = moves[idxRef.current].t
    const delay = Math.max(0, (target - lastMoveTimeRef.current) / speedRef.current)
    timeoutRef.current = window.setTimeout(() => {
      const move = moves[idxRef.current]
      try {
        player.experimentalAddMove(move.m)
      } catch {}
      lastMoveTimeRef.current = move.t
      idxRef.current += 1
      scheduleNext()
    }, delay)
  }, [player, replay])

  const play = useCallback(() => {
    if (!player || !replay || replay.moves.length === 0) return
    clearPending()
    resetCube()
    idxRef.current = 0
    lastMoveTimeRef.current = 0
    setStatus('playing')
    scheduleNext()
  }, [player, replay, clearPending, resetCube, scheduleNext])

  const pause = useCallback(() => {
    clearPending()
    setStatus((prev) => (prev === 'playing' ? 'paused' : prev))
  }, [clearPending])

  const resume = useCallback(() => {
    if (!player || !replay) return
    setStatus('playing')
    scheduleNext()
  }, [player, replay, scheduleNext])

  const restart = useCallback(() => {
    play()
  }, [play])

  useEffect(() => clearPending, [clearPending, player, replay])

  return { status, speed, setSpeed, play, pause, resume, restart }
}
