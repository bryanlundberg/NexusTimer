'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Trophy } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useCycle } from '../model/useCycle'

const USERS = [
  { name: 'redsito', avatar: 3 },
  { name: 'aki_3x3', avatar: 9 },
  { name: 'mia', avatar: 5 }
]
const CATEGORIES = [
  { cat: '3×3', color: 'var(--cube-red)', times: [6.4, 5.87, 6.72] },
  { cat: '2×2', color: 'var(--cube-yellow)', times: [1.94, 2.31, 2.02] },
  { cat: 'OH', color: 'var(--cube-blue)', times: [12.41, 11.86, 13.1] },
  { cat: 'Pyraminx', color: 'var(--cube-green)', times: [3.55, 3.9, 3.18] }
]
const HOLD_STEPS = 2
const COLS = 'grid grid-cols-[4.75rem_repeat(3,minmax(0,1fr))] items-center'

export default function CompareVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const cycle = useCycle(CATEGORIES.length + HOLD_STEPS, 1000, inView)
  const revealed = cycle < 0 ? (reduce ? CATEGORIES.length : 0) : Math.min(cycle + 1, CATEGORIES.length)

  const wins = USERS.map(
    (_, c) => CATEGORIES.slice(0, revealed).filter((row) => Math.min(...row.times) === row.times[c]).length
  )
  const done = revealed === CATEGORIES.length
  const leader = done ? wins.indexOf(Math.max(...wins)) : -1

  return (
    <div ref={ref} className="flex flex-col">
      <div className={`${COLS} border-b border-border pb-2`}>
        <span />
        {USERS.map((u, c) => (
          <span key={u.name} className="flex min-w-0 flex-col items-center gap-1">
            <span className="relative">
              <Image
                src={`https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_${u.avatar}.png`}
                alt=""
                width={28}
                height={28}
                className={cn(
                  'h-7 w-7 shrink-0 border-2 transition-colors duration-300',
                  c === leader ? 'border-record' : 'border-border'
                )}
              />
              {c === leader && (
                <m.span
                  key={`crown-${cycle}`}
                  className="absolute -right-2 -top-2 flex size-4 items-center justify-center bg-record"
                  initial={reduce ? false : { scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                >
                  <Trophy className="size-2.5 fill-background text-background" />
                </m.span>
              )}
            </span>
            <span
              className={cn(
                'max-w-full truncate text-[10px] font-bold transition-colors duration-300',
                c === leader ? 'text-record' : 'text-foreground'
              )}
            >
              {u.name}
            </span>
            <span className="font-mono text-[9px] tabular-nums text-muted-foreground">
              {wins[c]} {wins[c] === 1 ? 'win' : 'wins'}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-1.5 flex flex-col gap-1">
        {CATEGORIES.map((row, i) => {
          const best = Math.min(...row.times)
          const shown = i < revealed
          const current = i === revealed - 1 && !done
          return (
            <div
              key={row.cat}
              className={cn(
                `${COLS} border py-2 pl-2.5 pr-1 transition-colors duration-300`,
                current ? 'border-foreground/30 bg-foreground/8' : 'border-border bg-card/70'
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className="size-2 shrink-0" style={{ backgroundColor: row.color }} />
                <span className="text-[11px] font-semibold text-foreground">{row.cat}</span>
              </span>
              {row.times.map((tm, c) => {
                const isBest = shown && tm === best
                return (
                  <span
                    key={c}
                    className={cn(
                      'flex items-center justify-center gap-1 font-mono text-xs tabular-nums transition-colors duration-300',
                      isBest ? 'font-bold text-record' : 'text-muted-foreground'
                    )}
                  >
                    {isBest && (
                      <m.span
                        initial={reduce ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="inline-flex"
                      >
                        <Trophy className="size-3 shrink-0 fill-record text-record" />
                      </m.span>
                    )}
                    {tm.toFixed(2)}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
