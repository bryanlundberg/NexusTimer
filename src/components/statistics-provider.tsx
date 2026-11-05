'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Cube } from '@/entities/cube/model/types'
import { detectSessionAppend } from '@/features/deep-statistics/lib/detectSessionAppend'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { DESKTOP_MIN_WIDTH, timerStatSizes } from '@/shared/lib/statistics/averageSizes'
import { useMinWidth } from '@/shared/model/use-min-width'

export default function StatisticsProvider({ children }: { children?: React.ReactNode }) {
  const [worker, setWorker] = useState<Worker | null>(null)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const cubes = useTimerStore((state) => state.cubes)
  const setTimerStatistics = useTimerStore((state) => state.setTimerStatistics)
  const timerAverages = useSettingsStore((state) => state.settings.features.timerAverages)
  const railAverages = useSettingsStore((state) => state.settings.features.railAverages)
  const isDesktop = useMinWidth(DESKTOP_MIN_WIDTH)
  const averages = useMemo(
    () => timerStatSizes({ railAverages, timerAverages }, isDesktop),
    [railAverages, timerAverages, isDesktop]
  )
  const sent = useRef<{ cubes: Cube[] | null; selectedCube: Cube | null; averages: number[] } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = new Worker(new URL('../shared/worker/timer-stats.worker.ts', import.meta.url), { type: 'module' })

    sent.current = null
    setWorker(w)

    w.onmessage = (e: MessageEvent) => {
      if (e.data.resync) {
        const { cubes, selectedCube } = useTimerStore.getState()
        const averages = timerStatSizes(
          useSettingsStore.getState().settings.features,
          window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`).matches
        )
        postReset(w, cubes, selectedCube, averages)
        sent.current = { cubes, selectedCube, averages }
        return
      }
      setTimerStatistics(e.data.result)
    }

    w.onerror = (err) => {
      console.error('Worker error:', err)
    }

    return () => {
      w.terminate()
    }
  }, [])

  useEffect(() => {
    if (!worker) return
    const previous = sent.current
    const append =
      previous?.averages.join() === averages.join() &&
      detectSessionAppend(previous.cubes, previous.selectedCube, cubes, selectedCube)
    if (append) {
      worker.postMessage({ command: 'append', data: append })
    } else {
      postReset(worker, cubes, selectedCube, averages)
    }
    sent.current = { cubes, selectedCube, averages }
  }, [worker, cubes, selectedCube, averages])

  return children
}

function postReset(worker: Worker, cubes: Cube[] | null, selectedCube: Cube | null, averages: number[]) {
  worker.postMessage({
    command: 'reset',
    data: {
      cubes: selectedCube ? (cubes ?? []).filter((cube) => cube.category === selectedCube.category) : [],
      selectedCube: selectedCube || null,
      averages
    }
  })
}
