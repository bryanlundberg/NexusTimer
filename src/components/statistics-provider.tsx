import { useEffect, useState } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'

export default function StatisticsProvider({ children }: { children?: React.ReactNode }) {
  const [worker, setWorker] = useState<Worker | null>(null)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const cubes = useTimerStore((state) => state.cubes)
  const setTimerStatistics = useTimerStore((state) => state.setTimerStatistics)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const w = new Worker(new URL('../worker/timer-stats.worker.ts', import.meta.url), { type: 'module' })

    setWorker(w)

    w.onmessage = (e: MessageEvent) => {
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
    worker.postMessage({
      command: 'start',
      data: {
        cubes: cubes || [],
        selectedCube: selectedCube || null
      }
    })
  }, [worker, cubes, selectedCube])

  return children
}
