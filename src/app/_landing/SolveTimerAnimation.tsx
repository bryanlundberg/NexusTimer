'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export function SolveTimerAnimation() {
  const t = useTranslations('LandingPage')
  const [time, setTime] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'inspecting' | 'solving' | 'done'>('idle')

  useEffect(() => {
    const cycle = () => {
      setPhase('inspecting')
      setTime(0)

      setTimeout(() => {
        setPhase('solving')
        const solveTarget = 7.5 + Math.random() * 5
        const startTime = Date.now()

        const interval = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000
          if (elapsed >= solveTarget) {
            setTime(solveTarget)
            setPhase('done')
            clearInterval(interval)
            setTimeout(cycle, 3000)
          } else {
            setTime(elapsed)
          }
        }, 10)
      }, 1500)
    }

    const initial = setTimeout(cycle, 800)
    return () => clearTimeout(initial)
  }, [])

  const formatTime = (t: number) => {
    const seconds = Math.floor(t)
    const ms = Math.floor((t % 1) * 100)
    return `${seconds}.${ms.toString().padStart(2, '0')}`
  }

  const color = phase === 'inspecting' ? '#d97706' : phase === 'done' ? '#059669' : '#111827'

  return (
    <div className="relative">
      <div className="font-mono tabular-nums" style={{ color, transition: 'color 300ms ease' }}>
        <span className="text-7xl md:text-[120px] lg:text-[160px] font-black tracking-tighter leading-none">
          {phase === 'idle' ? '0.00' : formatTime(time)}
        </span>
      </div>
      <div
        className="text-xs uppercase tracking-[0.3em] text-gray-400 text-center mt-3"
        style={{ opacity: phase === 'inspecting' ? 1 : 0.4, transition: 'opacity 300ms ease' }}
      >
        {phase === 'inspecting'
          ? t('timer.inspection')
          : phase === 'solving'
            ? t('timer.solving')
            : phase === 'done'
              ? t('timer.solved')
              : ''}
      </div>
    </div>
  )
}
