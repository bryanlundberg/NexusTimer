import { useLayoutEffect, useRef } from 'react'
import type { SolveClock } from '@/features/timer/model/useSolveClock'

interface SolveClockTextProps {
  clock: SolveClock
  format: (ms: number) => string
}

export function SolveClockText({ clock, format }: SolveClockTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { isRunning, solvingTime, getElapsed } = clock

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (!isRunning) {
      el.textContent = format(solvingTime)
      return
    }
    let raf = 0
    const tick = () => {
      el.textContent = format(getElapsed())
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [isRunning, solvingTime, getElapsed, format])

  return <span ref={ref} />
}
