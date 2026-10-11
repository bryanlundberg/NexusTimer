import { useMemo } from 'react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'
import { bestBefore } from '@/features/timer/lib/solveMoment'

export function useSolveMoment() {
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const globalBest = useTimerStore((store) => store.timerStatistics.global.best)
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const cubes = useTimerStore((store) => store.cubes)
  const bestTimeAlert = useSettingsStore((store) => store.settings.alerts.bestTime)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)

  const isPersonalBest =
    !isFocusMode && lastSolve != null && !lastSolve.dnf && lastSolve.time <= globalBest && bestTimeAlert

  const improvement = useMemo(() => {
    if (!isPersonalBest || !lastSolve || !selectedCube) return null
    const previous = bestBefore(cubes, selectedCube.category, lastSolve)
    return previous !== null && previous > lastSolve.time ? previous - lastSolve.time : null
  }, [isPersonalBest, lastSolve, selectedCube, cubes])

  return { lastSolve, isPersonalBest, improvement }
}
