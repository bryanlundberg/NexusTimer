import { useCallback, useEffect, useRef, useState } from 'react'
import type { SolveReplay } from '@/entities/replay/model/types'
import type { ReplayView } from '@/features/solve-replay/model/replayView'

export type ReplayStatus = 'idle' | 'playing' | 'paused' | 'done'

interface UseRealtimeReplayArgs {
  view: ReplayView | null
  replay: SolveReplay | null | undefined
  speed?: number
  loop?: boolean
}

const LOOP_PAUSE_MS = 900

export function useRealtimeReplay({ view, replay, speed = 1, loop = false }: UseRealtimeReplayArgs) {
  const [status, setStatus] = useState<ReplayStatus>('idle')
  const [index, setIndex] = useState(0)

  const total = replay?.moves.length ?? 0

  const idxRef = useRef(0)
  const lastMoveTimeRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)
  const speedRef = useRef(speed)
  const loopRef = useRef(loop)

  useEffect(() => {
    speedRef.current = speed
    loopRef.current = loop
  })

  const clearPending = useCallback(() => {
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const render = useCallback(
    (n: number) => {
      if (!view || !replay) return n
      const clamped = Math.max(0, Math.min(n, replay.moves.length))
      view.jumpTo(replay.moves.slice(0, clamped).map((move) => move.m))
      idxRef.current = clamped
      lastMoveTimeRef.current = clamped === 0 ? 0 : replay.moves[clamped - 1].t
      setIndex(clamped)
      return clamped
    },
    [view, replay]
  )

  const scheduleNext = useCallback(() => {
    if (!view || !replay) return
    const { moves } = replay
    if (idxRef.current >= moves.length) {
      if (!loopRef.current || moves.length === 0) {
        setStatus('done')
        return
      }
      timeoutRef.current = window.setTimeout(() => {
        render(0)
        scheduleNext()
      }, LOOP_PAUSE_MS)
      return
    }
    const target = moves[idxRef.current].t
    const delay = Math.max(0, target - lastMoveTimeRef.current) / speedRef.current
    timeoutRef.current = window.setTimeout(() => {
      const move = moves[idxRef.current]
      view.animate(move.m)
      lastMoveTimeRef.current = move.t
      idxRef.current += 1
      setIndex(idxRef.current)
      scheduleNext()
    }, delay)
  }, [view, replay, render])

  const playFrom = useCallback(
    (start: number) => {
      if (!view || !replay || replay.moves.length === 0) return
      clearPending()
      render(start)
      setStatus('playing')
      scheduleNext()
    },
    [view, replay, clearPending, render, scheduleNext]
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

  const jump = useCallback(
    (n: number) => {
      if (status === 'playing' && n < total) playFrom(n)
      else seek(n)
    },
    [status, total, playFrom, seek]
  )

  const next = useCallback(() => seek(idxRef.current + 1), [seek])
  const prev = useCallback(() => seek(idxRef.current - 1), [seek])
  const restart = useCallback(() => playFrom(0), [playFrom])

  const toggle = useCallback(() => {
    if (status === 'playing') pause()
    else if (idxRef.current >= total) playFrom(0)
    else playFrom(idxRef.current)
  }, [status, total, pause, playFrom])

  useEffect(() => clearPending, [clearPending, view, replay])

  const appliedSpeedRef = useRef(speed)

  useEffect(() => {
    if (appliedSpeedRef.current === speed) return
    appliedSpeedRef.current = speed
    if (status !== 'playing') return
    clearPending()
    scheduleNext()
  }, [speed, status, clearPending, scheduleNext])

  return { status, index, total, toggle, pause, restart, next, prev, seek, jump }
}
