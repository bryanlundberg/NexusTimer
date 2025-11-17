import {
  defaultChartAoValues,
  defaultChartValuesA,
  defaultChartValuesN,
  defaultChartValuesS
} from '@/lib/const/defaultChartValues'
import { useTimerStore } from '@/store/timerStore'
import { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { useQueryState } from 'nuqs'
import { DateRange } from '@/enums/DateRange'
import type { Cube } from '@/interfaces/Cube'
import type { Solve } from '@/interfaces/Solve'
import { STATES } from '@/shared/const/states'

export default function useDeepStatistics() {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const cubes = useTimerStore((store) => store.cubes)
  const [dateRange] = useQueryState(STATES.STATISTICS_PAGE.DATE_RANGE.KEY, {
    defaultValue: STATES.STATISTICS_PAGE.DATE_RANGE.DEFAULT_VALUE as DateRange
  })
  const [isLoading, setIsLoading] = useState(true)
  const [worker, setWorker] = useState<Worker | null>(null)
  const [stats, setStats] = useState({
    average: defaultChartValuesN,
    timeSpent: defaultChartValuesS,
    counter: defaultChartValuesN,
    stats: defaultChartAoValues,
    deviation: defaultChartValuesN,
    successRate: defaultChartValuesS,
    best: defaultChartValuesN,
    data: defaultChartValuesA
  })

  const startTimestamp = useMemo(() => {
    switch (dateRange as DateRange) {
      case DateRange.TODAY:
        return moment().startOf('day').valueOf()
      case DateRange.THIS_WEEK:
        return moment().startOf('week').valueOf()
      case DateRange.LAST_WEEK:
        return moment().subtract(7, 'days').startOf('day').valueOf()
      case DateRange.THIS_MONTH:
        return moment().startOf('month').valueOf()
      case DateRange.LAST_MONTH:
        return moment().subtract(30, 'days').startOf('day').valueOf()
      case DateRange.THIS_YEAR:
        return moment().startOf('year').valueOf()
      case DateRange.LAST_YEAR:
        return moment().subtract(365, 'days').startOf('day').valueOf()
      case DateRange.ALL_TIME:
      default:
        return 0 // no filter
    }
  }, [dateRange])

  const filterSolves = (solves: Solve[]): Solve[] => {
    if (!solves) return []
    if (!startTimestamp || startTimestamp <= 0) return solves
    return solves.filter((s) => {
      const ts = s.endTime ?? s.startTime
      return ts >= startTimestamp
    })
  }

  const filteredCubes: Cube[] | null = useMemo(() => {
    if (!cubes) return null
    return cubes.map((c) => ({
      ...c,
      solves: {
        session: filterSolves(c.solves?.session || []),
        all: filterSolves(c.solves?.all || [])
      }
    }))
  }, [cubes, startTimestamp])

  const filteredSelectedCube: Cube | null = useMemo(() => {
    if (!selectedCube) return null
    return {
      ...selectedCube,
      solves: {
        session: filterSolves(selectedCube.solves?.session || []),
        all: filterSolves(selectedCube.solves?.all || [])
      }
    } as Cube
  }, [selectedCube, startTimestamp])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = new Worker(new URL('../worker/deep-statistics.worker.ts', import.meta.url), { type: 'module' })

    setWorker(w)

    w.onmessage = (e: MessageEvent) => {
      setStats(e.data.result)
      setIsLoading(false)
    }

    w.onerror = (err) => {
      console.error('Worker error:', err)
    }

    w.postMessage({
      command: 'start',
      data: {
        cubes: filteredCubes || [],
        selectedCube: filteredSelectedCube || null
      }
    })

    return () => {
      w.terminate()
    }
  }, [])

  useEffect(() => {
    if (!worker) return
    if (!filteredCubes || !filteredSelectedCube) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    worker.postMessage({
      command: 'start',
      data: {
        cubes: filteredCubes || [],
        selectedCube: filteredSelectedCube || null
      }
    })
  }, [filteredCubes, filteredSelectedCube, worker])

  return {
    stats,
    isLoading
  }
}
