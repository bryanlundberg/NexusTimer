'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Bluetooth } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { DEMO_SEQUENCE } from '../lib/cubeMoves'
import TwistyCube from './TwistyCube'

const PAUSE_MS = 450
const LOG_SIZE = 4

type Sent = { step: number; move: string }

export default function SmartCubeVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const timer = useRef<number | undefined>(undefined)
  const [step, setStep] = useState(0)
  const [pulse, setPulse] = useState<Sent | null>(null)
  const [log, setLog] = useState<Sent[]>([])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const move = inView && !reduce ? DEMO_SEQUENCE[step % DEMO_SEQUENCE.length] : null

  const handleTurned = () => {
    setPulse({ step, move: DEMO_SEQUENCE[step % DEMO_SEQUENCE.length] })
    timer.current = window.setTimeout(() => setStep((s) => s + 1), PAUSE_MS)
  }

  const shown = reduce ? DEMO_SEQUENCE.slice(0, LOG_SIZE).map((demoMove, i) => ({ step: i, move: demoMove })) : log
  const slots = Array.from({ length: LOG_SIZE }, (_, i) => shown[i] ?? null)
  const newest = shown.at(-1)?.step

  return (
    <div ref={ref} className="flex h-32 items-center gap-3">
      <span className="shrink-0">
        <TwistyCube size={104} load={inView} move={move} step={step} onTurned={handleTurned} />
      </span>

      <span className="flex size-6 shrink-0 items-center justify-center bg-foreground">
        <Bluetooth className="size-3.5 text-[var(--lp-accent)]" strokeWidth={2.5} aria-hidden />
      </span>

      <span aria-hidden className="relative h-px min-w-4 flex-1 border-t border-dashed border-foreground/40">
        {pulse && (
          <m.span
            key={pulse.step}
            className="absolute -top-[3.5px] size-1.5 bg-foreground"
            initial={{ left: '0%', opacity: 1 }}
            animate={{ left: '100%', opacity: [1, 1, 0] }}
            transition={{ duration: 0.45, ease: 'linear' }}
            onAnimationComplete={() => setLog((prev) => [...prev, pulse].slice(-LOG_SIZE))}
          />
        )}
      </span>

      <span className="grid shrink-0 grid-cols-2 gap-1">
        {slots.map((entry, i) => (
          <span
            key={entry?.step ?? `empty-${i}`}
            className={cn(
              'flex h-8 min-w-8 items-center justify-center border px-1.5 font-mono text-sm font-bold transition-colors duration-300',
              entry ? 'border-foreground/40' : 'border-dashed border-foreground/25',
              entry && entry.step === newest && !reduce && 'bg-foreground/20'
            )}
          >
            {entry?.move}
          </span>
        ))}
      </span>
    </div>
  )
}
