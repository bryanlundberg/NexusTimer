'use client'
import { useEffect, useRef, useState } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Cube } from '@/entities/cube/model/types'
import { detectSessionAppend } from '@/features/deep-statistics/lib/detectSessionAppend'

export default function StatisticsProvider({ children }: { children?: React.ReactNode }) {
  const [worker, setWorker] = useState<Worker | null>(null)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const cubes = useTimerStore((state) => state.cubes)
  const setTimerStatistics = useTimerStore((state) => state.setTimerStatistics)
  const sent = useRef<{ cubes: Cube[] | null; selectedCube: Cube | null } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = new Worker(new URL('../shared/worker/timer-stats.worker.ts', import.meta.url), { type: 'module' })

    sent.current = null
    setWorker(w)

    w.onmessage = (e: MessageEvent) => {
      if (e.data.resync) {
        const { cubes, selectedCube } = useTimerStore.getState()
        postReset(w, cubes, selectedCube)
        sent.current = { cubes, selectedCube }
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
    const append = previous && detectSessionAppend(previous.cubes, previous.selectedCube, cubes, selectedCube)
    if (append) {
      worker.postMessage({ command: 'append', data: append })
    } else {
      postReset(worker, cubes, selectedCube)
    }
    sent.current = { cubes, selectedCube }
  }, [worker, cubes, selectedCube])

  return children
}

function postReset(worker: Worker, cubes: Cube[] | null, selectedCube: Cube | null) {
  worker.postMessage({
    command: 'reset',
    data: {
      cubes: selectedCube ? (cubes ?? []).filter((cube) => cube.category === selectedCube.category) : [],
      selectedCube: selectedCube || null
    }
  })
}
