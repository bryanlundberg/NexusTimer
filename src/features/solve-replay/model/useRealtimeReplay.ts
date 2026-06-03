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
  const [index, setIndex] = useState(0)

  const total = replay?.moves.length ?? 0

  const idxRef = useRef(0)
  const lastMoveTimeRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  const clearPending = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const render = useCallback(
    (n: number) => {
      if (!player || !replay) return n
      const clamped = Math.max(0, Math.min(n, replay.moves.length))
      try {
        player.alg = replay.moves
          .slice(0, clamped)
          .map((move) => move.m)
          .join(' ')
        player.jumpToEnd()
      } catch {}
      idxRef.current = clamped
      lastMoveTimeRef.current = clamped === 0 ? 0 : replay.moves[clamped - 1].t
      setIndex(clamped)
      return clamped
    },
    [player, replay]
  )

  const scheduleNext = useCallback(() => {
    if (!player || !replay) return
    const { moves } = replay
    if (idxRef.current >= moves.length) {
      setStatus('done')
      return
    }
    const target = moves[idxRef.current].t
    const delay = Math.max(0, target - lastMoveTimeRef.current)
    timeoutRef.current = window.setTimeout(() => {
      const move = moves[idxRef.current]
      try {
        player.experimentalAddMove(move.m)
      } catch {}
      lastMoveTimeRef.current = move.t
      idxRef.current += 1
      setIndex(idxRef.current)
      scheduleNext()
    }, delay)
  }, [player, replay])

  const playFrom = useCallback(
    (start: number) => {
      if (!player || !replay || replay.moves.length === 0) return
      clearPending()
      render(start)
      setStatus('playing')
      scheduleNext()
    },
    [player, replay, clearPending, render, scheduleNext]
  )

  const pause = useCallback(() => {
    clearPending()
    setStatus((prev) => (prev === 'playing' ? 'paused' : prev))
  }, [clearPending])

  const seek = useCallback(
    (n: number) => {
      clearPending()
      const clamped = render(n)
      setStatus(clamped >= total && total > 0 ? 'done' : 'paused')
    },
    [clearPending, render, total]
  )

  const next = useCallback(() => seek(idxRef.current + 1), [seek])
  const prev = useCallback(() => seek(idxRef.current - 1), [seek])
  const restart = useCallback(() => playFrom(0), [playFrom])

  const toggle = useCallback(() => {
    if (status === 'playing') pause()
    else if (idxRef.current >= total) playFrom(0)
    else playFrom(idxRef.current)
  }, [status, total, pause, playFrom])

  useEffect(() => clearPending, [clearPending, player, replay])

  return { status, index, total, toggle, pause, restart, next, prev, seek }
}
