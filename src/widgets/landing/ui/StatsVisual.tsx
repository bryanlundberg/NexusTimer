'use client'

import { useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { TrendingDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useCycle } from '../model/useCycle'

const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
const MONTHLY = [14.08, 13.87, 13.71, 13.62, 13.12, 12.84]
const SWITCH_MONTH = 3

const CHART_X0 = 26
const CHART_W = 234
const CHART_H = 110
const TICKS = [
  { y: 18, tick: '14.0' },
  { y: 48, tick: '13.0' },
  { y: 78, tick: '12.0' }
]

const monthX = (i: number) => 42 + i * 38.8
const valueY = (v: number) => 18 + (14 - v) * 30
const toX = (x: number) => `${((x - CHART_X0) / CHART_W) * 100}%`
const toY = (y: number) => `${(y / CHART_H) * 100}%`

function curve(from: number, to: number) {
  const parts: string[] = []
  for (let i = from; i <= to; i++) {
    const x = monthX(i)
    const y = valueY(MONTHLY[i])
    if (i === from) {
      parts.push(`M${x} ${y}`)
      continue
    }
    const mid = (monthX(i - 1) + x) / 2
    parts.push(`C${mid} ${valueY(MONTHLY[i - 1])} ${mid} ${y} ${x} ${y}`)
  }
  return parts.join(' ')
}

const SERIES = [
  {
    label: 'Moyu Weilong GTS',
    from: 0,
    to: SWITCH_MONTH,
    color: 'var(--cube-orange)',
    ink: '#4a2c00',
    width: 2.5,
    bubble: { x: 40, y: 40 },
    stacked: true
  },
  {
    label: 'GAN 356',
    from: SWITCH_MONTH,
    to: MONTHLY.length - 1,
    color: 'var(--cube-green)',
    ink: '#10231a',
    width: 2.5,
    bubble: { x: 176, y: 66 },
    stacked: false
  }
]

export default function StatsVisual() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const cycle = useCycle(MONTHS.length, 1300, inView)
  const active = cycle < 0 ? (reduce ? MONTHS.length - 1 : 0) : cycle
  const activeMean = MONTHLY[active]

  return (
    <div ref={ref} className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ao100 trend</span>
        <span className="inline-flex items-center gap-2 font-mono text-[10px]">
          <span className="text-foreground">
            {MONTHS[active]} {activeMean.toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-1 bg-[var(--cube-green)]/15 px-1.5 py-0.5 font-bold text-[var(--cube-green)]">
            <TrendingDown className="size-3" aria-hidden />
            {(MONTHLY[0] - activeMean).toFixed(2)}s
          </span>
        </span>
      </div>

      <div aria-hidden className="relative h-32 w-full">
        {TICKS.map((g) => (
          <span
            key={g.y}
            className="absolute left-0 -translate-y-1/2 font-mono text-[8px] text-foreground/35"
            style={{ top: toY(g.y) }}
          >
            {g.tick}
          </span>
        ))}

        <div className="absolute inset-y-0 left-7 right-0">
          <svg
            viewBox={`${CHART_X0} 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {TICKS.map((g) => (
              <line
                key={g.y}
                x1={CHART_X0}
                y1={g.y}
                x2={CHART_X0 + CHART_W}
                y2={g.y}
                stroke="currentColor"
                className="text-foreground/8"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <svg
            viewBox={`${CHART_X0} 0 ${CHART_W} ${CHART_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {SERIES.map((s) => (
              <path
                key={s.label}
                d={curve(s.from, s.to)}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width}
                strokeLinecap="square"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <span
            className="absolute inset-y-0 w-px border-l border-dashed border-foreground/30 transition-[left] duration-500 ease-out"
            style={{ left: toX(monthX(active)) }}
          />
          <span
            className="absolute z-10 size-2.5 -translate-x-1/2 -translate-y-1/2 border-2 border-background transition-[left,top,background-color] duration-500 ease-out"
            style={{
              left: toX(monthX(active)),
              top: toY(valueY(activeMean)),
              backgroundColor: active < SWITCH_MONTH ? 'var(--cube-orange)' : 'var(--cube-green)'
            }}
          />

          {SERIES.map((s) => (
            <span
              key={`${s.label}-end`}
              className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2"
              style={{
                left: toX(monthX(s.to)),
                top: toY(valueY(MONTHLY[s.to])),
                backgroundColor: s.color
              }}
            />
          ))}

          <span
            className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap border border-border bg-background px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground"
            style={{ left: toX(monthX(SWITCH_MONTH)), top: `calc(${toY(valueY(MONTHLY[SWITCH_MONTH]))} - 8px)` }}
          >
            Switched to <span className="text-[var(--cube-green)]">GAN 356</span>
          </span>

          {SERIES.map((s) => {
            const last = MONTHLY[s.to].toFixed(2)
            return (
              <span
                key={`${s.label}-bubble`}
                className="absolute flex flex-col items-center whitespace-nowrap px-2 py-1 leading-none"
                style={{ left: toX(s.bubble.x), top: toY(s.bubble.y), backgroundColor: s.color, color: s.ink }}
              >
                {s.stacked ? (
                  <>
                    <span className="font-mono text-[10px] font-extrabold">{last}</span>
                    <span className="mt-0.5 text-[7px] font-bold">{s.label}</span>
                  </>
                ) : (
                  <span className="font-mono text-[9px] font-bold">
                    {s.label} {last}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-2.5">
        <span className="text-[8px] uppercase tracking-[0.15em] text-muted-foreground/70">3×3 monthly average</span>
        <div className="relative ml-7 mt-2 h-28">
          {MONTHS.map((label, i) => {
            const isActive = i === active
            const mean = MONTHLY[i]
            return (
              <span
                key={label}
                className="absolute inset-y-0 flex w-[11%] -translate-x-1/2 flex-col items-stretch justify-end gap-1"
                style={{ left: toX(monthX(i)) }}
              >
                <span
                  className={cn(
                    'text-center font-mono text-[10px] tabular-nums transition-colors duration-300',
                    isActive ? 'font-bold text-[var(--cube-green)]' : 'text-muted-foreground/70'
                  )}
                >
                  {mean.toFixed(2)}
                </span>
                <span
                  className="w-full transition-[background-color,box-shadow] duration-300"
                  style={{
                    height: `${Math.round(18 + ((mean - 12.5) / 1.6) * 46)}px`,
                    backgroundColor: isActive
                      ? 'var(--cube-green)'
                      : 'color-mix(in oklch, var(--foreground) 14%, transparent)',
                    boxShadow: isActive ? '0 0 14px color-mix(in oklch, var(--cube-green) 55%, transparent)' : 'none'
                  }}
                />
                <span
                  className={cn(
                    'pt-0.5 text-center font-mono text-[9px] transition-colors duration-300',
                    isActive ? 'text-foreground' : 'text-muted-foreground/60'
                  )}
                >
                  {label}
                </span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
