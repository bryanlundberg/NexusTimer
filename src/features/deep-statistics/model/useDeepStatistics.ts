import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { resolveAverages } from '@/shared/lib/statistics/averageSizes'
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
  const customAverages = useSettingsStore((store) => store.settings.features.customAverages)

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    requestDeepStats(cubes || null, selectedCube || null, 0, resolveAverages(customAverages))
  }, [cubes, selectedCube, customAverages])

  return state
}
