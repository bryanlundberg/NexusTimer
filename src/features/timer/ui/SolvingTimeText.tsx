'use client'
import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { getIntegerPart, getDecimalPart } from '@/shared/lib/formatTimeParts'
import { digitCellsHTML } from '@/shared/lib/digitCells'

export function SolvingTimeInteger() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const update = (time: number) => {
      if (ref.current) ref.current.innerHTML = digitCellsHTML(getIntegerPart(time))
    }
    update(useTimerStore.getState().solvingTime)
    return useTimerStore.subscribe((state, prev) => {
      if (state.solvingTime !== prev.solvingTime) update(state.solvingTime)
    })
  }, [])

  return (
    <span
      ref={ref}
      dangerouslySetInnerHTML={{ __html: digitCellsHTML(getIntegerPart(useTimerStore.getState().solvingTime)) }}
    />
  )
}

export function SolvingTimeDecimals({ decimals }: { decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const update = (time: number) => {
      if (ref.current) ref.current.innerHTML = digitCellsHTML(getDecimalPart(time, decimals))
    }
    update(useTimerStore.getState().solvingTime)
    return useTimerStore.subscribe((state, prev) => {
      if (state.solvingTime !== prev.solvingTime) update(state.solvingTime)
    })
  }, [decimals])

  return (
    <span
      className={'opacity-60'}
      ref={ref}
      dangerouslySetInnerHTML={{
        __html: digitCellsHTML(getDecimalPart(useTimerStore.getState().solvingTime, decimals))
      }}
    />
  )
}
