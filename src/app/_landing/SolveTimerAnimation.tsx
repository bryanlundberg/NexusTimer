'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type Phase = 'idle' | 'inspecting' | 'solving' | 'done'

export function SolveTimerAnimation() {
  const t = useTranslations('LandingPage')
  const [time, setTime] = useState(0)
  const [phase, setPhase] = useState<Phase>('idle')

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let interval: ReturnType<typeof setInterval> | undefined

    const cycle = () => {
      setPhase('inspecting')
      setTime(0)

      timeouts.push(
        setTimeout(() => {
          setPhase('solving')
          const solveTarget = 3 + Math.random() * 3
          const startTime = Date.now()

          interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000
            if (elapsed >= solveTarget) {
              setTime(solveTarget)
              setPhase('done')
              if (interval) clearInterval(interval)
              timeouts.push(setTimeout(cycle, 2200))
            } else {
              setTime(elapsed)
            }
          }, 10)
        }, 1500)
      )
    }

    timeouts.push(setTimeout(cycle, 800))
    return () => {
      timeouts.forEach(clearTimeout)
      if (interval) clearInterval(interval)
    }
  }, [])

  const formatTime = (value: number) => {
    const seconds = Math.floor(value)
    const ms = Math.floor((value % 1) * 100)
    return `${seconds}.${ms.toString().padStart(2, '0')}`
  }

  const color =
    phase === 'inspecting'
      ? '#d97706'
      : phase === 'solving'
        ? 'var(--primary)'
        : phase === 'done'
          ? '#059669'
          : '#111827'

  const running = phase === 'solving'
  const label =
    phase === 'inspecting'
      ? t('timer.inspection')
      : phase === 'solving'
        ? t('timer.solving')
        : phase === 'done'
          ? t('timer.solved')
          : ''

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Soft brand glow that only blooms while the solve is running */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          opacity: running ? 0.14 : 0
        }}
      />

      <div className="font-mono tabular-nums leading-none" style={{ color, transition: 'color 300ms ease' }}>
        <span className="block font-black tracking-tight" style={{ fontSize: 'clamp(3.5rem, 13vw, 8.5rem)' }}>
          {phase === 'idle' ? '0.00' : formatTime(time)}
        </span>
      </div>

      {/* Phase rail: three ticks that light up across inspect → solve → done */}
      <div className="mt-5 flex items-center gap-2" aria-hidden>
        {(['inspecting', 'solving', 'done'] as Phase[]).map((p) => {
          const order: Phase[] = ['idle', 'inspecting', 'solving', 'done']
          const active = order.indexOf(phase) >= order.indexOf(p)
          return (
            <span
              key={p}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: phase === p ? 28 : 10,
                backgroundColor: active ? color : 'rgb(229 231 235)'
              }}
            />
          )
        })}
      </div>

      <div
        className="mt-3 h-4 text-[11px] uppercase tracking-[0.3em] text-gray-400"
        style={{ opacity: phase === 'idle' ? 0 : 1, transition: 'opacity 300ms ease' }}
      >
        {label}
      </div>
    </div>
  )
}
