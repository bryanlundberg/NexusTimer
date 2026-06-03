import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useEffect, useSyncExternalStore } from 'react'
import {
  getServerSnapshot,
  getSnapshot,
  requestDeepStats,
  subscribe
} from '@/features/deep-statistics/model/deepStatsController'

export default function useDeepStatistics() {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const cubes = useTimerStore((store) => store.cubes)

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    requestDeepStats(cubes || null, selectedCube || null, 0)
  }, [cubes, selectedCube])

  return state
}
