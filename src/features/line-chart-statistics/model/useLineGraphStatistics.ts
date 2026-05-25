import { useLocale, useTranslations } from 'next-intl'
import React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { convert } from 'colorizr'
import {
  ChartOptions,
  createChart,
  createSeriesMarkers,
  CreatePriceLineOptions,
  createTextWatermark,
  DeepPartial,
  LineSeries
} from 'lightweight-charts'
import formatTime from '@/shared/lib/formatTime'
import getWorstTime from '@/shared/lib/statistics/getWorstTime'
import calcCurrentAo from '@/shared/lib/statistics/calcCurrentAo'
import getMean from '@/shared/lib/statistics/getMean'
import getDeviation from '@/shared/lib/statistics/getDeviation'
import { Solve } from '@/entities/solve/model/types'
import moment from 'moment'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'

export const CHART_COLORS = {
  pb: '#FBBF24',
  worst: '#DC2626',
  ao5: '#3B82F6',
  ao12: '#10B981',
  sd: '#8B5CF6'
} as const

export default function useLineGraphStatistics(dataSet: Solve[]) {
  const t = useTranslations('Index.StatsPage')
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const locale = useLocale()
  const { resolvedTheme } = useTheme()
  const [showBestTime, setShowBestTime] = useState(true)
  const [showWorstTime, setShowWorstTime] = useState(true)
  const [showAo5, setShowAo5] = useState(true)
  const [showAo12, setShowAo12] = useState(true)
  const [showStandardDeviation, setShowStandardDeviation] = useState(true)
  const cubes = useTimerStore((s) => s.cubes)
  const overlay = useOverlayStore()

  const chartRef = useRef<any>(null)
  const lineSeriesRef = useRef<any>(null)
  const pbSeriesRef = useRef<any>(null)
  const ao5SeriesRef = useRef<any>(null)
  const ao12SeriesRef = useRef<any>(null)
  const pbPriceLineRef = useRef<any>(null)
  const worstPriceLineRef = useRef<any>(null)
  const sdUpperPriceLineRef = useRef<any>(null)
  const sdLowerPriceLineRef = useRef<any>(null)

  const stateRef = useRef({ showBestTime, showWorstTime, showAo5, showAo12, showStandardDeviation })
  stateRef.current = { showBestTime, showWorstTime, showAo5, showAo12, showStandardDeviation }

  const {
    structuredData,
    solveMap,
    pbAtStepMap,
    ao5Map,
    ao12Map,
    pbData,
    pbMarkers,
    pbValue,
    meanTime,
    stdDev,
    worstTime,
    ao5Data,
    ao12Data,
    cubeNameById
  } = React.useMemo(() => {
    const reversedDataSet = [...dataSet].reverse()
    const structuredData: any[] = []
    const solveMap = new Map<number, Solve>()
    const pbAtStepMap = new Map<number, number>()
    const ao5Map = new Map<number, number>()
    const ao12Map = new Map<number, number>()
    const cubeNameById = new Map<string, string>()

    if (cubes) {
      for (const c of cubes) cubeNameById.set(c.id, c.name)
    }

    let runningBest = Infinity
    reversedDataSet.forEach((i: Solve, index: number) => {
      const timeIndex = index + 1
      structuredData.push({
        time: timeIndex,
        value: i.time
      })
      solveMap.set(timeIndex, i)

      if (i.time <= runningBest) {
        runningBest = i.time
      }
      pbAtStepMap.set(timeIndex, runningBest)

      if (index >= 4) {
        const window5 = reversedDataSet.slice(index - 4, index + 1)
        const ao5Value = calcCurrentAo(window5, 5)
        if (ao5Value > 0) ao5Map.set(timeIndex, ao5Value)
      }

      if (index >= 11) {
        const window12 = reversedDataSet.slice(index - 11, index + 1)
        const ao12Value = calcCurrentAo(window12, 12)
        if (ao12Value > 0) ao12Map.set(timeIndex, ao12Value)
      }
    })

    const mean = getMean(dataSet)
    const validSolves = dataSet.filter((s) => !s.dnf)
    const sd = getDeviation(validSolves)
    const worst = getWorstTime(dataSet)

    const ao5Data = Array.from(ao5Map.entries()).map(([time, value]) => ({ time, value }))
    const ao12Data = Array.from(ao12Map.entries()).map(([time, value]) => ({ time, value }))

    const pbData: any[] = []
    const pbMarkers: any[] = []
    let currentBest = Infinity
    structuredData.forEach((item) => {
      if (item.value <= currentBest) {
        currentBest = item.value
        pbData.push({ time: item.time, value: item.value })
        pbMarkers.push({
          time: item.time,
          position: 'inBar' as any,
          color: CHART_COLORS.pb,
          shape: 'circle' as any,
          size: 1
        })
      } else if (pbData.length > 0) {
        pbData.push({ time: item.time, value: currentBest })
      }
    })
    const pbValue = pbData.length > 0 ? pbData[pbData.length - 1].value : null

    return {
      structuredData,
      solveMap,
      pbAtStepMap,
      ao5Map,
      ao12Map,
      pbData,
      pbMarkers,
      pbValue,
      meanTime: mean,
      stdDev: sd,
      worstTime: worst,
      ao5Data,
      ao12Data,
      cubeNameById
    }
  }, [dataSet, cubes])

  useEffect(() => {
    const backgroundColor = convert(getComputedStyle(document.documentElement).getPropertyValue('--background'), 'rgb')
    const gridColor = 'rgba(78,78,78,0.22)'
    const primaryColor = convert(getComputedStyle(document.documentElement).getPropertyValue('--primary'), 'rgb')

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: 'gray',
        background: { color: backgroundColor },
        attributionLogo: false
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor }
      },
      localization: {
        priceFormatter: (time: number) => formatTime(time),
        timeFormatter: (time: number) => time.toString()
      },
      timeScale: {
        tickMarkFormatter: (time: number) => time.toString(),
        fixRightEdge: true,
        fixLeftEdge: true,
        allowBoldLabels: false
      },
      kineticScroll: { mouse: true },
      handleScale: { axisPressedMouseMove: { price: false } },
      crosshair: {
        mode: 1,
        vertLine: { color: primaryColor, width: 1, style: 2, visible: true, labelVisible: false },
        horzLine: {
          color: primaryColor,
          width: 1,
          style: 2,
          visible: true,
          labelVisible: true,
          labelBackgroundColor: primaryColor
        }
      }
    }

    const container = chartContainerRef.current
    const tooltip = tooltipRef.current
    if (!container || !tooltip) return

    container.innerHTML = ''
    const chart = createChart(container, chartOptions)
    chartRef.current = chart

    const firstPane = chart.panes()[0]
    createTextWatermark(firstPane, {
      horzAlign: 'center',
      vertAlign: 'center',
      lines: [{ text: 'nexustimer.com', color: 'rgba(120,120,120, 0.1)', fontSize: 24 }]
    })

    const lineSeries = chart.addSeries(LineSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      lineWidth: 1.5 as any,
      color: primaryColor,
      priceScaleId: 'right'
    })
    lineSeries.setData(structuredData)
    lineSeriesRef.current = lineSeries

    if (pbData.length > 0) {
      const pbSeries = chart.addSeries(LineSeries, {
        lastValueVisible: false,
        priceLineVisible: false,
        lineWidth: 2,
        color: CHART_COLORS.pb,
        lineStyle: 2,
        priceScaleId: 'right',
        visible: stateRef.current.showBestTime
      })
      pbSeries.setData(pbData)
      createSeriesMarkers(pbSeries, pbMarkers)
      pbSeriesRef.current = pbSeries

      if (stateRef.current.showBestTime && pbValue != null) {
        const pbPriceLine: CreatePriceLineOptions = {
          price: pbValue,
          color: CHART_COLORS.pb,
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'PB'
        }
        pbPriceLineRef.current = lineSeries.createPriceLine(pbPriceLine)
      }
    }

    if (stateRef.current.showWorstTime) {
      worstPriceLineRef.current = lineSeries.createPriceLine({
        price: worstTime,
        color: CHART_COLORS.worst,
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: true,
        title: 'Worst'
      })
    }

    if (stateRef.current.showStandardDeviation) {
      sdUpperPriceLineRef.current = lineSeries.createPriceLine({
        price: meanTime + stdDev,
        color: CHART_COLORS.sd,
        lineWidth: 1,
        lineStyle: 3,
        axisLabelVisible: true,
        title: `+σ`
      })
      sdLowerPriceLineRef.current = lineSeries.createPriceLine({
        price: Math.max(0, meanTime - stdDev),
        color: CHART_COLORS.sd,
        lineWidth: 1,
        lineStyle: 3,
        axisLabelVisible: true,
        title: `-σ`
      })
    }

    const ao5Series = chart.addSeries(LineSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      lineWidth: 1,
      color: CHART_COLORS.ao5,
      visible: stateRef.current.showAo5
    })
    ao5Series.setData(ao5Data as any)
    ao5SeriesRef.current = ao5Series

    const ao12Series = chart.addSeries(LineSeries, {
      lastValueVisible: false,
      priceLineVisible: false,
      lineWidth: 1,
      color: CHART_COLORS.ao12,
      visible: stateRef.current.showAo12
    })
    ao12Series.setData(ao12Data as any)
    ao12SeriesRef.current = ao12Series

    chart.autoSizeActive()
    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((param) => {
      if (
        param.point === undefined ||
        !param.time ||
        param.point.x < 0 ||
        param.point.x > container.clientWidth ||
        param.point.y < 0 ||
        param.point.y > container.clientHeight
      ) {
        tooltip.style.display = 'none'
        return
      }

      const solve = solveMap.get(param.time as number)
      if (!solve) {
        tooltip.style.display = 'none'
        return
      }

      moment.locale(locale)
      const cubeName = cubeNameById.get(solve.cubeId) || 'Unknown'
      const currentPb = pbAtStepMap.get(param.time as number)
      let tooltipContent = `
        <div class="mt-1 text-xs">${cubeName}</div>
        <div class="font-bold text-base">${formatTime(solve.time)}</div>
        <div class="text-xs opacity-80">Solve #${param.time}</div>
        <div class="mt-1 text-xs">${moment(solve.endTime).format('LL')}</div>
        ${currentPb !== undefined ? `<div class="mt-1 text-xs text-yellow-500">PB: ${formatTime(currentPb)}</div>` : ''}
      `

      const ao5Value = ao5Map.get(param.time as number)
      if (ao5Value && ao5Value > 0) {
        tooltipContent += `<div class="mt-1 text-xs text-blue-400">Ao5: ${formatTime(ao5Value)}</div>`
      }
      const ao12Value = ao12Map.get(param.time as number)
      if (ao12Value && ao12Value > 0) {
        tooltipContent += `<div class="mt-1 text-xs text-emerald-400">Ao12: ${formatTime(ao12Value)}</div>`
      }

      if (solve.dnf) {
        tooltipContent += `<div class="mt-1 text-xs text-red-500">DNF</div>`
      } else if (solve.plus2) {
        tooltipContent += `<div class="mt-1 text-xs text-yellow-500">+2</div>`
      }

      tooltip.innerHTML = tooltipContent
      tooltip.style.display = 'block'

      const tooltipWidth = tooltip.clientWidth
      const tooltipHeight = tooltip.clientHeight
      const chartRect = container.getBoundingClientRect()
      let left = param.point.x + 15
      if (left + tooltipWidth > chartRect.width) left = param.point.x - tooltipWidth - 15
      let top = param.point.y - tooltipHeight - 10
      if (top < 0) top = param.point.y + 15
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${top}px`
    })

    chart.subscribeClick((param) => {
      if (!param.time) return
      const solve = solveMap.get(param.time as number)
      if (!solve) return
      overlay.open({
        id: 'solve-details',
        metadata: { ...solve },
        component: React.createElement(SolveDetails)
      })
    })

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== container) return
      const newRect = entries[0].contentRect
      chart.applyOptions({ height: newRect.height, width: newRect.width })
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
      chartRef.current = null
      lineSeriesRef.current = null
      pbSeriesRef.current = null
      ao5SeriesRef.current = null
      ao12SeriesRef.current = null
      pbPriceLineRef.current = null
      worstPriceLineRef.current = null
      sdUpperPriceLineRef.current = null
      sdLowerPriceLineRef.current = null
    }
  }, [
    locale,
    resolvedTheme,
    structuredData,
    solveMap,
    pbAtStepMap,
    ao5Map,
    ao12Map,
    pbData,
    pbMarkers,
    pbValue,
    meanTime,
    stdDev,
    worstTime,
    ao5Data,
    ao12Data,
    cubeNameById
  ])

  // Toggle: PB series
  useEffect(() => {
    const series = lineSeriesRef.current
    const pbSeries = pbSeriesRef.current
    if (!series) return
    if (pbSeries) pbSeries.applyOptions({ visible: showBestTime })

    if (showBestTime && pbValue != null && !pbPriceLineRef.current) {
      pbPriceLineRef.current = series.createPriceLine({
        price: pbValue,
        color: CHART_COLORS.pb,
        lineWidth: 1,
        lineStyle: 2,
        axisLabelVisible: true,
        title: 'PB'
      })
    } else if (!showBestTime && pbPriceLineRef.current) {
      series.removePriceLine(pbPriceLineRef.current)
      pbPriceLineRef.current = null
    }
  }, [showBestTime, pbValue])

  // Toggle: worst price line
  useEffect(() => {
    const series = lineSeriesRef.current
    if (!series) return
    if (showWorstTime && !worstPriceLineRef.current) {
      worstPriceLineRef.current = series.createPriceLine({
        price: worstTime,
        color: CHART_COLORS.worst,
        lineWidth: 1,
        lineStyle: 0,
        axisLabelVisible: true,
        title: 'Worst'
      })
    } else if (!showWorstTime && worstPriceLineRef.current) {
      series.removePriceLine(worstPriceLineRef.current)
      worstPriceLineRef.current = null
    }
  }, [showWorstTime, worstTime])

  // Toggle: standard deviation price lines
  useEffect(() => {
    const series = lineSeriesRef.current
    if (!series) return
    if (showStandardDeviation && !sdUpperPriceLineRef.current) {
      sdUpperPriceLineRef.current = series.createPriceLine({
        price: meanTime + stdDev,
        color: CHART_COLORS.sd,
        lineWidth: 1,
        lineStyle: 3,
        axisLabelVisible: true,
        title: `+σ`
      })
      sdLowerPriceLineRef.current = series.createPriceLine({
        price: Math.max(0, meanTime - stdDev),
        color: CHART_COLORS.sd,
        lineWidth: 1,
        lineStyle: 3,
        axisLabelVisible: true,
        title: `-σ`
      })
    } else if (!showStandardDeviation && sdUpperPriceLineRef.current) {
      series.removePriceLine(sdUpperPriceLineRef.current)
      if (sdLowerPriceLineRef.current) series.removePriceLine(sdLowerPriceLineRef.current)
      sdUpperPriceLineRef.current = null
      sdLowerPriceLineRef.current = null
    }
  }, [showStandardDeviation, meanTime, stdDev])

  // Toggle: Ao5 / Ao12 visibility
  useEffect(() => {
    if (ao5SeriesRef.current) ao5SeriesRef.current.applyOptions({ visible: showAo5 })
  }, [showAo5])

  useEffect(() => {
    if (ao12SeriesRef.current) ao12SeriesRef.current.applyOptions({ visible: showAo12 })
  }, [showAo12])

  const hasData = useMemo(() => dataSet.length > 0, [dataSet])

  return {
    chartContainerRef,
    tooltipRef,
    hasData,
    showBestTime,
    setShowBestTime,
    showWorstTime,
    setShowWorstTime,
    showAo5,
    setShowAo5,
    showAo12,
    setShowAo12,
    showStandardDeviation,
    setShowStandardDeviation
  }
}
