'use client'

import { useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useCycle } from '../model/useCycle'

const LEARNED_BEFORE = 24
const OLL_TOTAL = 57
const MOVE_STEP_S = 0.22

export default function AlgorithmsVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const sets = [
    { label: 'OLL', count: 57, active: true },
    { label: 'PLL', count: 21, active: false },
    { label: 'F2L', count: 41, active: false },
    { label: 'CMLL', count: 42, active: false }
  ]
  // Top-face sticker maps. All three cases already have the cross oriented, so
  // they differ only in which corners are yellow: one for Sune and Anti-Sune,
  // none for Pi, which leaves the bare cross.
  const cases = [
    {
      name: 'OLL 27',
      alias: 'Sune',
      face: [1, 1, 0, 1, 1, 1, 0, 1, 0],
      moves: ['R', 'U', "R'", 'U', 'R', 'U2', "R'"]
    },
    {
      name: 'OLL 26',
      alias: 'Anti-Sune',
      face: [0, 1, 1, 1, 1, 1, 0, 1, 0],
      moves: ['R', 'U2', "R'", "U'", 'R', "U'", "R'"]
    },
    {
      name: 'OLL 22',
      alias: 'Pi',
      face: [0, 1, 0, 1, 1, 1, 0, 1, 0],
      moves: ['R', 'U2', 'R2', "U'", 'R2', "U'", 'R2', 'U2', 'R']
    }
  ]

  const cycle = useCycle(cases.length + 1, 2600, inView)
  const practicing = cycle < 0 ? (reduce ? cases.length : 0) : cycle
  const learned = LEARNED_BEFORE + Math.min(practicing, cases.length)

  return (
    <div ref={ref} className="flex flex-col">
      <div className="flex items-center gap-4 border-b border-border pb-2">
        {sets.map((st) => (
          <span
            key={st.label}
            className={cn(
              'relative inline-flex items-center gap-1 pb-1.5 text-[10px] font-semibold',
              st.active ? 'text-foreground' : 'text-muted-foreground/70'
            )}
          >
            {st.label}
            <span
              className={cn(
                'inline-flex min-w-[14px] items-center justify-center px-1 text-[8px] font-bold tabular-nums',
                st.active
                  ? 'bg-[var(--cube-blue)]/15 text-[var(--cube-blue)]'
                  : 'bg-foreground/8 text-muted-foreground/70'
              )}
            >
              {st.count}
            </span>
            {st.active && <span className="absolute -bottom-[9px] left-0 h-0.5 w-full bg-[var(--cube-blue)]" />}
          </span>
        ))}
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        <span className="h-1 flex-1 bg-foreground/10">
          <span
            className="block h-full bg-[var(--cube-blue)] transition-[width] duration-500 ease-out"
            style={{ width: `${(learned / OLL_TOTAL) * 100}%` }}
          />
        </span>
        <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
          <span className="text-foreground">{learned}</span>/{OLL_TOTAL} learned
        </span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5">
        {cases.map((c, ci) => {
          const isLearned = ci < practicing
          const isActive = ci === practicing
          return (
            <m.div
              key={c.name}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + ci * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'relative flex items-center gap-3 border px-2 py-1.5 transition-colors duration-300',
                isActive ? 'border-[var(--cube-blue)]/60 bg-[var(--cube-blue)]/10' : 'border-border bg-card/70'
              )}
            >
              <div className="grid shrink-0 grid-cols-3 gap-[3px]">
                {c.face.map((on, i) => (
                  <m.span
                    key={i}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + ci * 0.12 + i * 0.02, ease: [0.16, 1, 0.3, 1] }}
                    className="size-3"
                    style={{
                      backgroundColor: on
                        ? 'var(--cube-yellow)'
                        : 'color-mix(in oklch, var(--foreground) 12%, transparent)'
                    }}
                  />
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  <span className="font-semibold text-foreground">{c.name}</span> · {c.alias}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {c.moves.map((move, i) =>
                    isActive && !reduce ? (
                      <m.span
                        key={`${cycle}-${i}`}
                        initial={{ backgroundColor: 'color-mix(in oklch, var(--foreground) 5%, transparent)' }}
                        animate={{ backgroundColor: 'color-mix(in oklch, var(--cube-blue) 45%, transparent)' }}
                        transition={{ duration: 0.15, delay: 0.3 + i * MOVE_STEP_S }}
                        className="px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground"
                      >
                        {move}
                      </m.span>
                    ) : (
                      <span
                        key={i}
                        className={cn(
                          'px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground',
                          isLearned ? 'bg-[var(--cube-blue)]/20' : 'bg-foreground/[0.05]'
                        )}
                      >
                        {move}
                      </span>
                    )
                  )}
                </div>
              </div>
              {(isLearned || isActive) && (
                <m.span
                  key={isActive ? `learn-${cycle}` : 'learned'}
                  className="ml-auto inline-flex shrink-0 items-center gap-1 self-start font-mono text-[9px] text-[var(--cube-green)]"
                  initial={reduce || isLearned ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: isActive ? 0.45 + c.moves.length * MOVE_STEP_S : 0 }}
                >
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                  Learned
                </m.span>
              )}
            </m.div>
          )
        })}
      </div>
    </div>
  )
}
