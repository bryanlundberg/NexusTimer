'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { createChart, AreaSeries } from 'lightweight-charts'
import { useTranslations } from 'next-intl'
import formatTime from '@/shared/lib/formatTime'
import { hexToRgba, readChartTheme } from '@/features/smart-cube-stats/lib/chartTheme'
import type { PhaseMeta, SmartSolvePoint } from '@/features/smart-cube-stats/lib/computeSmartCubeStats'

interface PhaseLayersLineChartProps {
  series: SmartSolvePoint[]
  phases: PhaseMeta[]
}

export default function PhaseLayersLineChart({ series, phases }: PhaseLayersLineChartProps) {
  const t = useTranslations('Index.StatsPage')
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  // Average share (%) per phase across the shown solves, for the legend.
  const legend = phases.map((phase) => {
    const avg = series.reduce((sum, s) => sum + (s.phaseDurations[phase.key] ?? 0), 0) / Math.max(series.length, 1)
    return { phase, avg }
  })
  const legendTotal = legend.reduce((sum, l) => sum + l.avg, 0) || 1

  useEffect(() => {
    const container = containerRef.current
    const tooltip = tooltipRef.current
    if (!container || !tooltip) return
    const theme = readChartTheme()
    container.innerHTML = ''

    const chart = createChart(container, {
      autoSize: true,
      hoveredSeriesOnTop: false,
      layout: {
        textColor: theme.text,
        background: { color: theme.background },
        attributionLogo: false,
        fontSize: 11
      },
      grid: { vertLines: { visible: false }, horzLines: { color: theme.grid } },
      leftPriceScale: { visible: true, borderVisible: false, scaleMargins: { top: 0.1, bottom: 0 } },
      rightPriceScale: { visible: false },
      timeScale: {
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        tickMarkFormatter: (time: number) => `#${time}`
      },
      localization: {
        priceFormatter: (value: number) => formatTime(value, 1),
        timeFormatter: (time: number) => `#${time}`
      },
      handleScroll: false,
      handleScale: false
    })

    // Stacked area: each phase's series holds the running cumulative so the
    // bands sit on top of each other. Draw top-to-bottom so the lower (smaller)
    // fills paint over and leave a clean colored band per phase.
    const cumulative = phases.map((phase, layer) => ({
      phase,
      data: series.map((point) => {
        let sum = 0
        for (let i = 0; i <= layer; i++) sum += point.phaseDurations[phases[i].key] ?? 0
        return { time: point.index as never, value: sum }
      })
    }))

    let markerSeries: ReturnType<typeof chart.addSeries> | null = null
    for (let i = cumulative.length - 1; i >= 0; i--) {
      const { phase, data } = cumulative[i]
      const area = chart.addSeries(AreaSeries, {
        priceScaleId: 'left',
        lineColor: phase.color,
        lineWidth: 2,
        topColor: hexToRgba(phase.color, 0.95),
        bottomColor: hexToRgba(phase.color, 0.95),
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerVisible: false
      })
      area.setData(data)
      markerSeries = area
    }

    // Left-axis marker per phase at its average cumulative level (no line).
    if (markerSeries) {
      let running = 0
      for (const { phase, avg } of legend) {
        running += avg
        markerSeries.createPriceLine({
          price: running,
          color: phase.color,
          lineVisible: false,
          axisLabelVisible: true,
          axisLabelColor: phase.color,
          axisLabelTextColor: '#ffffff'
        })
      }
    }

    chart.timeScale().fitContent()

    // Crosshair tooltip: per-solve phase breakdown.
    const pointByIndex = new Map(series.map((p) => [p.index, p]))
    let tooltipW = 0
    let tooltipH = 0
    let lastTime: number | null = null

    chart.subscribeCrosshairMove((param) => {
      if (
        !param.point ||
        param.time == null ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        tooltip.style.display = 'none'
        lastTime = null
        return
      }

      const point = pointByIndex.get(param.time as number)
      if (!point) {
        tooltip.style.display = 'none'
        lastTime = null
        return
      }

      if (param.time !== lastTime) {
        const rows = phases
          .map((ph) => {
            const dur = point.phaseDurations[ph.key] ?? 0
            const pct = point.total > 0 ? Math.round((dur / point.total) * 100) : 0
            return `
              <div class="flex items-center gap-2 text-xs">
                <span class="inline-block size-1.5 rounded-full shrink-0" style="background:${ph.color}"></span>
                <span class="text-muted-foreground">${ph.label}</span>
                <span class="ml-auto font-medium tabular-nums">${formatTime(dur, 1)}</span>
                <span class="w-8 text-right text-muted-foreground/70 tabular-nums">${pct}%</span>
              </div>`
          })
          .join('')

        tooltip.innerHTML = `
          <div class="flex flex-col gap-1 min-w-44">
            <div class="flex items-center justify-between gap-3">
              <span class="font-bold text-base tabular-nums leading-tight">${formatTime(point.total, 2)}</span>
              <span class="text-[10px] text-muted-foreground/70 tabular-nums">#${point.index}</span>
            </div>
            <div class="h-px bg-border/40 my-0.5"></div>
            ${rows}
          </div>`
        tooltip.style.display = 'block'
        tooltipW = tooltip.clientWidth
        tooltipH = tooltip.clientHeight
        lastTime = param.time as number
      }

      let left = param.point.x + 14
      if (left + tooltipW > container.clientWidth) left = param.point.x - tooltipW - 14
      let top = param.point.y - tooltipH - 10
      if (top < 0) top = param.point.y + 14
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
    })

    return () => chart.remove()
  }, [series, phases, resolvedTheme])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('smart-layers-title', { count: series.length })}
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {legend.map(({ phase, avg }) => (
            <span key={phase.key} className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <span className="inline-block size-2 rounded-full" style={{ background: phase.color }} />
              {phase.label}
              <span className="text-muted-foreground/60 tabular-nums">{Math.round((avg / legendTotal) * 100)}%</span>
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-56 w-full flex-1">
        <div ref={containerRef} className="absolute inset-0" />
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-10 hidden rounded-xl border border-border/50 bg-popover/95 p-2.5 text-popover-foreground shadow-xl backdrop-blur-md"
        />
      </div>
    </div>
  )
}
