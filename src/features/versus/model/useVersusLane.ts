'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LaneStatus, VersusPlayer } from '@/features/versus/model/types'
import { useVersusStore } from '@/features/versus/model/useVersusStore'

const HOLD_DELAY_MS = 300

function capturePointer(element: HTMLElement, pointerId: number) {
  try {
    element.setPointerCapture(pointerId)
  } catch {}
}

function releasePointer(element: HTMLElement, pointerId: number) {
  try {
    element.releasePointerCapture(pointerId)
  } catch {}
}

export function useVersusLane(player: VersusPlayer) {
  const setLaneStatus = useVersusStore((state) => state.setLaneStatus)
  const finishLane = useVersusStore((state) => state.finishLane)

  const [elapsed, setElapsed] = useState(0)
  const startedAtRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const statusRef = useRef(player.status)

  statusRef.current = player.status

  const clearHoldTimeout = useCallback(() => {
    if (holdTimeoutRef.current === null) return
    clearTimeout(holdTimeoutRef.current)
    holdTimeoutRef.current = null
  }, [])

  const cancelFrame = useCallback(() => {
    if (rafRef.current === null) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = null
  }, [])

  const tick = useCallback(() => {
    setElapsed(Date.now() - startedAtRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (player.status !== LaneStatus.IDLE) return
    setElapsed(0)
    clearHoldTimeout()
    cancelFrame()
  }, [player.status, cancelFrame, clearHoldTimeout])

  useEffect(
    () => () => {
      clearHoldTimeout()
      cancelFrame()
    },
    [cancelFrame, clearHoldTimeout]
  )

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault()
      capturePointer(event.currentTarget, event.pointerId)

      if (statusRef.current === LaneStatus.RUNNING) {
        cancelFrame()
        const finalTime = Date.now() - startedAtRef.current
        setElapsed(finalTime)
        finishLane(player.id, finalTime)
        return
      }

      if (statusRef.current !== LaneStatus.IDLE) return

      setLaneStatus(player.id, LaneStatus.HOLDING)
      clearHoldTimeout()
      holdTimeoutRef.current = setTimeout(() => setLaneStatus(player.id, LaneStatus.READY), HOLD_DELAY_MS)
    },
    [cancelFrame, clearHoldTimeout, finishLane, player.id, setLaneStatus]
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      releasePointer(event.currentTarget, event.pointerId)
      clearHoldTimeout()

      if (statusRef.current === LaneStatus.HOLDING) {
        setLaneStatus(player.id, LaneStatus.IDLE)
        return
      }

      if (statusRef.current !== LaneStatus.READY) return

      startedAtRef.current = Date.now()
      setElapsed(0)
      setLaneStatus(player.id, LaneStatus.RUNNING)
      rafRef.current = requestAnimationFrame(tick)
    },
    [clearHoldTimeout, player.id, setLaneStatus, tick]
  )

  const onPointerCancel = useCallback(() => {
    clearHoldTimeout()
    if (statusRef.current === LaneStatus.HOLDING || statusRef.current === LaneStatus.READY) {
      setLaneStatus(player.id, LaneStatus.IDLE)
    }
  }, [clearHoldTimeout, player.id, setLaneStatus])

  return {
    displayTime: player.status === LaneStatus.DONE ? (player.timeMs ?? 0) : elapsed,
    handlers: { onPointerDown, onPointerUp, onPointerCancel }
  }
}
