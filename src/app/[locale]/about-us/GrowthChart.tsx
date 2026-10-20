'use client'

import { useEffect, useRef, useState } from 'react'
import type { GrowthPoint } from './content'

interface GrowthChartProps {
  months: GrowthPoint[]
  seriesLabel: string
  monthLabel: string
  tableLabel: string
}

const HEIGHT = 300
const PAD = { top: 24, right: 12, bottom: 32, left: 44 }
const LINE = 'var(--primary)'
const SURFACE = 'var(--lp-bg)'
const numberFormat = new Intl.NumberFormat('en-US')

function monthIndex(month: string) {
  const [year, m] = month.split('-').map(Number)
  return year * 12 + m - 1
}

function formatMonth(month: string) {
  const [year, m] = month.split('-').map(Number)
  return new Date(Date.UTC(year, m - 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

function niceStep(max: number) {
  const raw = Math.max(max, 1) / 4
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const norm = raw / magnitude
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * magnitude
}

export default function GrowthChart({ months, seriesLabel, monthLabel, tableLabel }: GrowthChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const lastIndex = months.length - 1
  const first = months[0]
  const last = months[lastIndex]
  const start = monthIndex(first.month)
  const span = Math.max(monthIndex(last.month) - start, 1)
  const peak = Math.max(...months.map((p) => p.total))
  const step = niceStep(peak)
  const yMax = Math.max(Math.ceil(peak / step), 1) * step
  const ticks = Array.from({ length: Math.round(yMax / step) + 1 }, (_, i) => i * step)
  const years = Array.from({ length: span + 1 }, (_, i) => start + i).filter((i) => i % 12 === 0)

  const plotWidth = Math.max(width - PAD.left - PAD.right, 0)
  const plotHeight = HEIGHT - PAD.top - PAD.bottom
  const x = (month: string) => PAD.left + ((monthIndex(month) - start) / span) * plotWidth
  const y = (value: number) => PAD.top + plotHeight - (value / yMax) * plotHeight

  const line = months.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.month)},${y(p.total)}`).join('')
  const area = `${line}L${x(last.month)},${y(0)}L${x(first.month)},${y(0)}Z`

  const nearest = (clientX: number, rect: DOMRect) => {
    const px = clientX - rect.left
    let best = 0
    months.forEach((p, i) => {
      if (Math.abs(x(p.month) - px) < Math.abs(x(months[best].month) - px)) best = i
    })
    return best
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const current = active ?? lastIndex
    const next =
      event.key === 'ArrowLeft'
        ? current - 1
        : event.key === 'ArrowRight'
          ? current + 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? lastIndex
              : null
    if (next === null) return
    event.preventDefault()
    setActive(Math.min(Math.max(next, 0), lastIndex))
  }

  const activePoint = active === null ? null : months[active]
  const tooltipLeft = activePoint ? Math.min(Math.max(x(activePoint.month), 70), width - 70) : 0
  const tooltipY = activePoint ? y(activePoint.total) : 0
  const tooltipAbove = tooltipY > 90
  const summary = `${seriesLabel}: ${numberFormat.format(first.total)} in ${formatMonth(first.month)}, ${numberFormat.format(last.total)} in ${formatMonth(last.month)}.`

  return (
    <div>
      <div ref={containerRef} className="relative w-full" style={{ height: HEIGHT }}>
        {width > 0 && (
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={summary}
            tabIndex={0}
            onPointerMove={(e) => setActive(nearest(e.clientX, e.currentTarget.getBoundingClientRect()))}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(lastIndex)}
            onBlur={() => setActive(null)}
            onKeyDown={onKeyDown}
            className="block touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {ticks.map((tick) => (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={PAD.left + plotWidth}
                  y1={y(tick)}
                  y2={y(tick)}
                  stroke="rgba(17,24,39,0.08)"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 10}
                  y={y(tick)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="fill-muted-foreground text-[11px] tabular-nums"
                >
                  {numberFormat.format(tick)}
                </text>
              </g>
            ))}

            {years.map((index) => (
              <text
                key={index}
                x={PAD.left + ((index - start) / span) * plotWidth}
                y={HEIGHT - 10}
                textAnchor="middle"
                className="fill-muted-foreground text-[11px] tabular-nums"
              >
                {Math.floor(index / 12)}
              </text>
            ))}

            <path d={area} fill={LINE} fillOpacity={0.1} />
            <path d={line} fill="none" stroke={LINE} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

            {activePoint && (
              <line
                x1={x(activePoint.month)}
                x2={x(activePoint.month)}
                y1={PAD.top}
                y2={y(0)}
                stroke="rgba(17,24,39,0.25)"
                strokeWidth="1"
              />
            )}

            <circle cx={x(last.month)} cy={y(last.total)} r={4.5} fill={LINE} stroke={SURFACE} strokeWidth="2" />
            {activePoint && active !== lastIndex && (
              <circle
                cx={x(activePoint.month)}
                cy={y(activePoint.total)}
                r={4.5}
                fill={LINE}
                stroke={SURFACE}
                strokeWidth="2"
              />
            )}

            {active !== lastIndex && (
              <text
                x={x(last.month) - 10}
                y={y(last.total) - 10}
                textAnchor="end"
                className="fill-foreground text-xs font-semibold"
              >
                {numberFormat.format(last.total)}
              </text>
            )}
          </svg>
        )}

        {activePoint && (
          <div
            aria-hidden
            className={`pointer-events-none absolute -translate-x-1/2 border border-border bg-card px-3 py-2 shadow-float ${tooltipAbove ? '-translate-y-full' : ''}`}
            style={{ left: tooltipLeft, top: tooltipAbove ? tooltipY - 14 : tooltipY + 14 }}
          >
            <p className="text-sm font-semibold text-foreground">{numberFormat.format(activePoint.total)}</p>
            <p className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-[11px] text-muted-foreground">
              <svg width="12" height="4" aria-hidden>
                <line x1="1" y1="2" x2="11" y2="2" stroke={LINE} strokeWidth="2" />
              </svg>
              {formatMonth(activePoint.month)}
            </p>
          </div>
        )}
      </div>

      <details className="mt-6 text-sm text-muted-foreground">
        <summary className="cursor-pointer select-none transition-colors duration-300 hover:text-foreground">
          {tableLabel}
        </summary>
        <table className="mt-4 w-full max-w-sm text-left">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              <th className="py-2 font-medium">{monthLabel}</th>
              <th className="py-2 text-right font-medium">{seriesLabel}</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {months.map((point) => (
              <tr key={point.month} className="border-b border-border last:border-0">
                <td className="py-1.5">{formatMonth(point.month)}</td>
                <td className="py-1.5 text-right text-foreground">{numberFormat.format(point.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  )
}
