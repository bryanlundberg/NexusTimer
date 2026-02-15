import { useLocale, useTranslations } from 'next-intl'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
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
import calculateCurrentAo from '@/shared/lib/statistics/calculateCurrentAo'
import getMean from '@/shared/lib/statistics/getMean'
import getDeviation from '@/shared/lib/statistics/getDeviation'
import { Solve } from '@/entities/solve/model/types'
import moment from 'moment'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SolveDetails from '@/features/manage-solves/ui/SolveDetails'

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

  const {
    structuredData,
    solveMap,
    pbAtStepMap,
    ao5Map,
    ao12Map,
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

      // Precalculate Ao5 and Ao12
      const window = reversedDataSet.slice(0, index + 1).reverse()
      const ao5Value = calculateCurrentAo(window, 5)
      if (ao5Value > 0) ao5Map.set(timeIndex, ao5Value)

      const ao12Value = calculateCurrentAo(window, 12)
      if (ao12Value > 0) ao12Map.set(timeIndex, ao12Value)
    })

    const mean = getMean(dataSet)
    const validSolves = dataSet.filter((s) => !s.dnf)
    const sd = getDeviation(validSolves)
    const worst = getWorstTime(dataSet)

    const ao5Data = Array.from(ao5Map.entries()).map(([time, value]) => ({ time, value }))
    const ao12Data = Array.from(ao12Map.entries()).map(([time, value]) => ({ time, value }))

    return {
      structuredData,
      solveMap,
      pbAtStepMap,
      ao5Map,
      ao12Map,
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
        background: {
          color: backgroundColor
        },
        attributionLogo: false
      },
      grid: {
        vertLines: {
          color: gridColor
        },
        horzLines: {
          color: gridColor
        }
      },
      localization: {
        priceFormatter: (time: number) => {
          return formatTime(time)
        },
        timeFormatter: (time: number) => {
          return time.toString()
        }
      },
      timeScale: {
        tickMarkFormatter: (time: number) => {
          return time.toString()
        },
        fixRightEdge: true,
        fixLeftEdge: true,
        allowBoldLabels: false
      },
      kineticScroll: {
        mouse: true
      },
      handleScale: {
        axisPressedMouseMove: {
          price: false
        }
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
        vertLine: {
          color: primaryColor,
          width: 1,
          style: 2, // LineStyle.Dashed
          visible: true,
          labelVisible: false
        },
        horzLine: {
          color: primaryColor,
          width: 1,
          style: 2, // LineStyle.Dashed
          visible: true,
          labelVisible: true,
          labelBackgroundColor: primaryColor
        }
      }
    }
    const container = chartContainerRef.current
    const tooltip = tooltipRef.current

    if (container && tooltip) {
      container.innerHTML = ''
      const chart = createChart(container, chartOptions)

      const firstPane = chart.panes()[0]

      createTextWatermark(firstPane, {
        horzAlign: 'center',
        vertAlign: 'center',
        lines: [
          {
            text: 'nexustimer.com',
            color: 'rgba(120,120,120, 0.1)',
            fontSize: 24
          }
        ]
      })

      const lineSeries = chart.addSeries(LineSeries, {
        lastValueVisible: false,
        priceLineVisible: false,
        lineWidth: 1.5 as any,
        color: primaryColor,
        priceScaleId: 'right'
      })

      lineSeries.setData(structuredData)

      if (showBestTime) {
        const pbData: any[] = []
        const pbMarkers: any[] = []
        let currentBest = Infinity

        structuredData.forEach((item) => {
          if (item.value <= currentBest) {
            // It's a PB (or tie)
            currentBest = item.value
            pbData.push({
              time: item.time,
              value: item.value
            })
            // Add marker for the PB solve
            pbMarkers.push({
              time: item.time,
              position: 'inBar' as any,
              color: '#FBBF24',
              shape: 'circle' as any,
              size: 1
            })
          } else if (pbData.length > 0) {
            // Not a PB, but we want the line to continue horizontally
            pbData.push({
              time: item.time,
              value: currentBest
            })
          }
        })

        if (pbData.length > 0) {
          const pbSeries = chart.addSeries(LineSeries, {
            lastValueVisible: false,
            priceLineVisible: false,
            lineWidth: 2,
            color: '#FBBF24', // Yellow
            lineStyle: 2, // Dashed
            priceScaleId: 'right'
          })

          pbSeries.setData(pbData)
          createSeriesMarkers(pbSeries, pbMarkers)

          // Add a fixed price line for the current PB (the last value in pbData is the overall best)
          const overallBest = pbData[pbData.length - 1].value
          const pbPriceLine: CreatePriceLineOptions = {
            price: overallBest,
            color: '#FBBF24', // Yellow
            lineWidth: 1,
            lineStyle: 2, // Dashed
            axisLabelVisible: true,
            title: 'PB'
          }
          lineSeries.createPriceLine(pbPriceLine)
        }
      }

      if (showWorstTime) {
        const worstTimeLine: CreatePriceLineOptions = {
          price: worstTime,
          color: '#DC2626', // Red
          lineWidth: 1,
          lineStyle: 0, // Solid
          axisLabelVisible: true,
          title: 'Worst'
        }
        lineSeries.createPriceLine(worstTimeLine)
      }

      if (showStandardDeviation) {
        // Upper bound (mean + stdDev)
        const upperBoundLine: CreatePriceLineOptions = {
          price: meanTime + stdDev,
          color: '#8B5CF6', // Purple
          lineWidth: 1,
          lineStyle: 3, // Dotted
          axisLabelVisible: true,
          title: `+σ`
        }
        lineSeries.createPriceLine(upperBoundLine)

        // Lower bound (mean - stdDev)
        const lowerBoundLine: CreatePriceLineOptions = {
          price: Math.max(0, meanTime - stdDev),
          color: '#8B5CF6', // Purple
          lineWidth: 1,
          lineStyle: 3, // Dotted
          axisLabelVisible: true,
          title: `-σ`
        }
        lineSeries.createPriceLine(lowerBoundLine)
      }

      if (showAo5) {
        const ao5Series = chart.addSeries(LineSeries, {
          lastValueVisible: false,
          priceLineVisible: false,
          lineWidth: 1,
          color: '#3B82F6' // Blue
        })
        ao5Series.setData(ao5Data as any)
      }

      if (showAo12) {
        const ao12Series = chart.addSeries(LineSeries, {
          lastValueVisible: false,
          priceLineVisible: false,
          lineWidth: 1,
          color: '#10B981' // Emerald/Greenish
        })
        ao12Series.setData(ao12Data as any)
      }

      chart.autoSizeActive()
      chart.timeScale().fitContent()

      // Setup custom tooltip
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

        if (showAo5) {
          const ao5Value = ao5Map.get(param.time as number)
          if (ao5Value && ao5Value > 0) {
            tooltipContent += `<div class="mt-1 text-xs text-blue-400">Ao5: ${formatTime(ao5Value)}</div>`
          }
        }

        if (showAo12) {
          const ao12Value = ao12Map.get(param.time as number)
          if (ao12Value && ao12Value > 0) {
            tooltipContent += `<div class="mt-1 text-xs text-emerald-400">Ao12: ${formatTime(ao12Value)}</div>`
          }
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

        // Position the tooltip
        let left = param.point.x + 15
        if (left + tooltipWidth > chartRect.width) {
          left = param.point.x - tooltipWidth - 15
        }

        let top = param.point.y - tooltipHeight - 10
        if (top < 0) {
          top = param.point.y + 15
        }

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

      // Make chart responsive with screen resize
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length === 0 || entries[0].target !== container) {
          return
        }
        const newRect = entries[0].contentRect
        chart.applyOptions({ height: newRect.height, width: newRect.width })
      })
      resizeObserver.observe(container)

      return () => {
        resizeObserver.disconnect()
        chart.remove()
      }
    }
  }, [
    dataSet,
    locale,
    t,
    showBestTime,
    showWorstTime,
    showStandardDeviation,
    showAo5,
    showAo12,
    resolvedTheme,
    structuredData,
    solveMap,
    pbAtStepMap,
    ao5Map,
    ao12Map,
    meanTime,
    stdDev,
    worstTime,
    ao5Data,
    ao12Data,
    cubeNameById
  ])

  return {
    chartContainerRef,
    tooltipRef,
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
