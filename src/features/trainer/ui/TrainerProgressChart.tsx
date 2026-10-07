'use client'

import { useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { TrainerSolveListItem } from '@/features/trainer/model/types'
import { monotonePath } from '@/features/trainer/lib/monotonePath'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { CHART_CONTRAST, DEFAULT_CHART_CONTRAST } from '@/shared/lib/chartContrastColor'

interface TrainerProgressChartProps {
  solves: TrainerSolveListItem[]
  targetMs?: number
  label: string
}

const SIZE = 100
const GRID_LINES = [0, 25, 50, 75, 100]

export default function TrainerProgressChart({ solves, targetMs, label }: TrainerProgressChartProps) {
  const colorTheme = useSettingsStore((store) => store.settings.preferences.colorTheme)
  const color = (CHART_CONTRAST[colorTheme] ?? DEFAULT_CHART_CONTRAST).hex
  const [active, setActive] = useState<number | null>(null)

  const chart = useMemo(() => {
    const values = [...solves].reverse().map((solve) => +(solve.timeMs / 1000).toFixed(2))
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = (max - min) * 0.1 || 1
    const low = min - padding
    const high = max + padding
    const toY = (seconds: number) => ((high - seconds) / (high - low)) * SIZE
    const points = values.map((seconds, i) => ({ x: (i / Math.max(values.length - 1, 1)) * SIZE, y: toY(seconds) }))
    const line = monotonePath(points)
    const target = targetMs != null && targetMs / 1000 >= low && targetMs / 1000 <= high ? toY(targetMs / 1000) : null
    return { values, points, line, area: `${line}L${SIZE},${SIZE}L0,${SIZE}Z`, target }
  }, [solves, targetMs])

  if (chart.values.length < 2) return null

  const last = chart.values.length - 1
  const point = active != null ? { ...chart.points[active], seconds: chart.values[active] } : null

  const pick = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - box.left) / box.width
    setActive(Math.min(last, Math.max(0, Math.round(ratio * last))))
  }

  const step = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const delta = event.key === 'ArrowLeft' ? -1 : 1
    setActive((current) => Math.min(last, Math.max(0, (current ?? (delta < 0 ? last + 1 : -1)) + delta)))
  }

  return (
    <div className="h-32 w-full px-1 pt-1 text-xs">
      <div
        role="application"
        aria-label={label}
        tabIndex={0}
        className="relative size-full touch-pan-y outline-none"
        onPointerDown={pick}
        onPointerMove={pick}
        onPointerLeave={() => setActive(null)}
        onKeyDown={step}
        onBlur={() => setActive(null)}
      >
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          preserveAspectRatio="none"
          className="size-full overflow-visible"
          aria-hidden="true"
        >
          {GRID_LINES.map((y) => (
            <line
              key={y}
              x1={0}
              x2={SIZE}
              y1={y}
              y2={y}
              className="stroke-border/50"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {chart.target != null && (
            <line
              x1={0}
              x2={SIZE}
              y1={chart.target}
              y2={chart.target}
              stroke="var(--cube-green)"
              strokeOpacity={0.7}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path d={chart.area} fill={color} fillOpacity={0.12} />
          <path d={chart.line} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>

        {point && (
          <>
            <span
              className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${point.x}%`, top: `${point.y}%`, backgroundColor: color }}
            />
            <div
              className="pointer-events-none absolute grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-white/10 bg-black px-2.5 py-1.5 text-xs text-white shadow-xl"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: `translate(${point.x > 50 ? 'calc(-100% - 10px)' : '10px'}, ${point.y > 50 ? 'calc(-100% - 10px)' : '10px'})`
              }}
            >
              <div className="flex w-full items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: color }} />
                <div className="flex flex-1 items-center justify-between gap-2 leading-none">
                  <span className="text-white/80">{label}</span>
                  <span className="font-mono font-medium tabular-nums text-white">
                    {point.seconds.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
