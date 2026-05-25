'use client'
import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import formatTime from '@/shared/lib/formatTime'

function getIntegerPart(time: number) {
  return formatTime(time).split('.')[0]
}

function getDecimalPart(time: number, decimals: number) {
  const part = formatTime(time, decimals).split('.')[1]
  return part ? '.' + part : ''
}

export function SolvingTimeInteger() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const update = (time: number) => {
      if (ref.current) ref.current.textContent = getIntegerPart(time)
    }
    update(useTimerStore.getState().solvingTime)
    return useTimerStore.subscribe((state, prev) => {
      if (state.solvingTime !== prev.solvingTime) update(state.solvingTime)
    })
  }, [])

  return <span ref={ref}>{getIntegerPart(useTimerStore.getState().solvingTime)}</span>
}

export function SolvingTimeDecimals({ decimals }: { decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const update = (time: number) => {
      if (ref.current) ref.current.textContent = getDecimalPart(time, decimals)
    }
    update(useTimerStore.getState().solvingTime)
    return useTimerStore.subscribe((state, prev) => {
      if (state.solvingTime !== prev.solvingTime) update(state.solvingTime)
    })
  }, [decimals])

  return <span ref={ref}>{getDecimalPart(useTimerStore.getState().solvingTime, decimals)}</span>
}
