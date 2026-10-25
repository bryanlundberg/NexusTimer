import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { convertCSS } from 'colorizr'
import {
  ChartOptions,
  createChart,
  createSeriesMarkers,
  CreatePriceLineOptions,
  DeepPartial,
  IChartApi,
  IPriceLine,
  ISeriesApi,
  LineSeries,
  LineType,
  UTCTimestamp
} from 'lightweight-charts'
import formatTime from '@/shared/lib/formatTime'
import getWorstTime from '@/shared/lib/statistics/getWorstTime'
import getMean from '@/shared/lib/statistics/getMean'
import getDeviation from '@/shared/lib/statistics/getDeviation'
import { rollingAo } from '@/shared/lib/statistics/rollingAo'
import { Solve } from '@/entities/solve/model/types'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'

export const CHART_COLORS = {
  pb: '#FBBF24',
  worst: '#DC2626',
  ao5: '#3B82F6',
  ao12: '#10B981',
  sd: '#8B5CF6'
} as const

export const CHART_RANGES = [50, 100, 500] as const
export type ChartRange = (typeof CHART_RANGES)[number] | 'all'

const AO5_SIZE = 5
const AO12_SIZE = 12

export type ChartPoint = {
  index: number
  solve: Solve
  pb: number | null
  ao5: number | null
  ao12: number | null
}

function cssColor(variable: string, fallback: string) {
  try {
    return convertCSS(getComputedStyle(document.documentElement).getPropertyValue(variable), 'rgb')
  } catch {
    return fallback
  }
}

function withAlpha(rgb: string, alpha: number) {
  const parts = rgb.match(/[\d.]+/g)
  if (!parts || parts.length < 3) return rgb
  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`
}

export default function useLineGraphStatistics(dataSet: Solve[]) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()
  const [showBestTime, setShowBestTime] = useState(true)
  const [showWorstTime, setShowWorstTime] = useState(true)
  const [showAo5, setShowAo5] = useState(true)
  const [showAo12, setShowAo12] = useState(true)
  const [showStandardDeviation, setShowStandardDeviation] = useState(true)
  const [showSolves, setShowSolves] = useState(true)
  const [range, setRange] = useState<ChartRange>('all')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const openOverlay = useOverlayStore((state) => state.open)

  const chartRef = useRef<IChartApi | null>(null)
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const pbSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const ao5SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const ao12SeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const worstPriceLineRef = useRef<IPriceLine | null>(null)
  const sdPriceLinesRef = useRef<IPriceLine[]>([])

  const stateRef = useRef({ showBestTime, showWorstTime, showAo5, showAo12, showStandardDeviation, showSolves, range })
  stateRef.current = { showBestTime, showWorstTime, showAo5, showAo12, showStandardDeviation, showSolves, range }

  const data = React.useMemo(() => {
    const ordered = [...dataSet].reverse()
    const lastIndex = ordered.length - 1
    const ao5Values = rollingAo(dataSet, AO5_SIZE)
    const ao12Values = rollingAo(dataSet, AO12_SIZE)
    const points = new Map<number, ChartPoint>()
    const solvesData: { time: UTCTimestamp; value: number }[] = []
    const pbData: { time: UTCTimestamp; value: number }[] = []
    const pbMarkers: { time: UTCTimestamp; position: 'inBar'; color: string; shape: 'circle'; size: number }[] = []
    const ao5Data: { time: UTCTimestamp; value: number }[] = []
    const ao12Data: { time: UTCTimestamp; value: number }[] = []
    let runningBest = Infinity

    ordered.forEach((solve, position) => {
      const index = position + 1
      const time = index as UTCTimestamp
      const aoAt = (size: number, values: Float64Array) => {
        if (position < size - 1) return null
        const value = values[lastIndex - position]
        return value > 0 ? value : null
      }

      if (!solve.dnf) {
        solvesData.push({ time, value: solve.time })
        if (solve.time <= runningBest) {
          runningBest = solve.time
          pbMarkers.push({ time, position: 'inBar', color: CHART_COLORS.pb, shape: 'circle', size: 1 })
        }
        pbData.push({ time, value: runningBest })
      }

      const ao5 = aoAt(AO5_SIZE, ao5Values)
      const ao12 = aoAt(AO12_SIZE, ao12Values)
      if (ao5 !== null) ao5Data.push({ time, value: ao5 })
      if (ao12 !== null) ao12Data.push({ time, value: ao12 })
      points.set(index, { index, solve, pb: runningBest === Infinity ? null : runningBest, ao5, ao12 })
    })

    const validSolves = dataSet.filter((solve) => !solve.dnf)
    return {
      points,
      count: ordered.length,
      solvesData,
      pbData,
      pbMarkers,
      ao5Data,
      ao12Data,
      pbValue: runningBest === Infinity ? null : runningBest,
      meanTime: getMean(dataSet),
      stdDev: getDeviation(validSolves),
      worstTime: getWorstTime(dataSet)
    }
  }, [dataSet])

  const applyRange = useCallback(
    (next: ChartRange) => {
      const chart = chartRef.current
      if (!chart) return
      if (next === 'all' || data.count <= next) {
        chart.timeScale().fitContent()
        return
      }
      chart.timeScale().setVisibleRange({
        from: (data.count - next + 1) as UTCTimestamp,
        to: data.count as UTCTimestamp
      })
    },
    [data.count]
  )

  useEffect(() => {
    const container = chartContainerRef.current
    if (!container) return

    const textColor = cssColor('--muted-foreground', '#888')
    const primaryColor = cssColor('--primary', '#888')
    const crosshairColor = withAlpha(textColor, 0.5)

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor,
        background: { color: 'transparent' },
        attributionLogo: false,
        fontFamily: getComputedStyle(document.body).fontFamily,
        fontSize: 11
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: 'rgba(120,120,120,0.08)', style: 0 }
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.12, bottom: 0.08 }
      },
      localization: {
        priceFormatter: (time: number) => formatTime(time),
        timeFormatter: (time: number) => `#${time}`
      },
      timeScale: {
        tickMarkFormatter: (time: number) => `#${time}`,
        fixRightEdge: true,
        fixLeftEdge: true,
        allowBoldLabels: false,
        borderVisible: false,
        enableConflation: true
      },
      hoveredSeriesOnTop: false,
      kineticScroll: { mouse: true },
      handleScale: { axisPressedMouseMove: { price: false } },
      crosshair: {
        mode: 1,
        vertLine: {
          color: crosshairColor,
          width: 1,
          style: 3,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: textColor
        },
        horzLine: {
          color: crosshairColor,
          width: 1,
          style: 3,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: textColor
        }
      }
    }

    container.innerHTML = ''
    const chart = createChart(container, chartOptions)
    chartRef.current = chart
    const state = stateRef.current

    const lineSeries = chart.addSeries(LineSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      lineWidth: 1,
      color: withAlpha(primaryColor, state.showSolves ? 0.55 : 0),
      priceScaleId: 'right',
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderWidth: 2,
      crosshairMarkerBorderColor: primaryColor,
      crosshairMarkerBackgroundColor: primaryColor
    })
    lineSeries.setData(data.solvesData)
    lineSeriesRef.current = lineSeries

    const pbSeries = chart.addSeries(LineSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      lineWidth: 2,
      lineType: LineType.WithSteps,
      color: CHART_COLORS.pb,
      visible: state.showBestTime,
      crosshairMarkerVisible: false
    })
    pbSeries.setData(data.pbData)
    createSeriesMarkers(pbSeries, data.pbMarkers)
    pbSeriesRef.current = pbSeries

    const ao12Series = chart.addSeries(LineSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      lineWidth: 2,
      color: CHART_COLORS.ao12,
      visible: state.showAo12,
      crosshairMarkerVisible: false
    })
    ao12Series.setData(data.ao12Data)
    ao12SeriesRef.current = ao12Series

    const ao5Series = chart.addSeries(LineSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      lineWidth: 2,
      color: CHART_COLORS.ao5,
      visible: state.showAo5,
      crosshairMarkerVisible: false
    })
    ao5Series.setData(data.ao5Data)
    ao5SeriesRef.current = ao5Series

    chart.autoSizeActive()
    if (state.range === 'all' || data.count <= state.range) chart.timeScale().fitContent()
    else
      chart.timeScale().setVisibleRange({
        from: (data.count - state.range + 1) as UTCTimestamp,
        to: data.count as UTCTimestamp
      })

    let lastHovered: number | null = null
    chart.subscribeCrosshairMove((param) => {
      const next = param.point && param.time ? (param.time as number) : null
      if (next === lastHovered) return
      lastHovered = next
      setHoveredIndex(next)
    })

    let lastPointerType = 'mouse'
    const onPointerDown = (event: PointerEvent) => {
      lastPointerType = event.pointerType
    }
    container.addEventListener('pointerdown', onPointerDown, { capture: true })

    chart.subscribeClick((param) => {
      if (lastPointerType !== 'mouse' || !param.time) return
      const point = data.points.get(param.time as number)
      if (!point) return
      openOverlay({ id: 'solve-details', metadata: { ...point.solve }, component: React.createElement(SolveDetails) })
    })

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== container) return
      const rect = entries[0].contentRect
      chart.applyOptions({ height: rect.height, width: rect.width })
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('pointerdown', onPointerDown, { capture: true })
      chart.remove()
      chartRef.current = null
      lineSeriesRef.current = null
      pbSeriesRef.current = null
      ao5SeriesRef.current = null
      ao12SeriesRef.current = null
      worstPriceLineRef.current = null
      sdPriceLinesRef.current = []
      setHoveredIndex(null)
    }
  }, [resolvedTheme, data, openOverlay])

  useEffect(() => {
    applyRange(range)
  }, [range, applyRange])

  useEffect(() => {
    const series = lineSeriesRef.current
    if (!series) return
    series.applyOptions({ color: withAlpha(cssColor('--primary', '#888'), showSolves ? 0.55 : 0) })
  }, [showSolves, resolvedTheme, data])

  useEffect(() => {
    pbSeriesRef.current?.applyOptions({ visible: showBestTime })
  }, [showBestTime, data])

  useEffect(() => {
    ao5SeriesRef.current?.applyOptions({ visible: showAo5 })
  }, [showAo5, data])

  useEffect(() => {
    ao12SeriesRef.current?.applyOptions({ visible: showAo12 })
  }, [showAo12, data])

  useEffect(() => {
    const series = lineSeriesRef.current
    if (!series) return
    if (showWorstTime && !worstPriceLineRef.current && data.worstTime > 0) {
      const line: CreatePriceLineOptions = {
        price: data.worstTime,
        color: CHART_COLORS.worst,
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: ''
      }
      worstPriceLineRef.current = series.createPriceLine(line)
    } else if (!showWorstTime && worstPriceLineRef.current) {
      series.removePriceLine(worstPriceLineRef.current)
      worstPriceLineRef.current = null
    }
  }, [showWorstTime, data, resolvedTheme])

  useEffect(() => {
    const series = lineSeriesRef.current
    if (!series) return
    if (showStandardDeviation && sdPriceLinesRef.current.length === 0 && data.stdDev > 0) {
      sdPriceLinesRef.current = [data.meanTime + data.stdDev, Math.max(0, data.meanTime - data.stdDev)].map(
        (price, index) =>
          series.createPriceLine({
            price,
            color: CHART_COLORS.sd,
            lineWidth: 1,
            lineStyle: 3,
            axisLabelVisible: true,
            title: index === 0 ? '+σ' : '-σ'
          })
      )
    } else if (!showStandardDeviation && sdPriceLinesRef.current.length > 0) {
      sdPriceLinesRef.current.forEach((line) => series.removePriceLine(line))
      sdPriceLinesRef.current = []
    }
  }, [showStandardDeviation, data, resolvedTheme])

  const activePoint = data.points.get(hoveredIndex ?? data.count) ?? null

  return {
    chartContainerRef,
    activePoint,
    isHovering: hoveredIndex !== null,
    count: data.count,
    range,
    setRange,
    toggles: {
      solves: [showSolves, setShowSolves],
      pb: [showBestTime, setShowBestTime],
      ao5: [showAo5, setShowAo5],
      ao12: [showAo12, setShowAo12],
      worst: [showWorstTime, setShowWorstTime],
      sd: [showStandardDeviation, setShowStandardDeviation]
    } as const
  }
}
