import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { useFocusModeStore } from '@/features/focus-mode/model/useFocusModeStore'

export function useSolveMoment() {
  const lastSolve = useTimerStore((store) => store.lastSolve)
  const globalBest = useTimerStore((store) => store.timerStatistics.global.best)
  const bestTimeAlert = useSettingsStore((store) => store.settings.alerts.bestTime)
  const isFocusMode = useFocusModeStore((store) => store.isFocusMode)

  const isPersonalBest =
    !isFocusMode && lastSolve != null && !lastSolve.dnf && lastSolve.time <= globalBest && bestTimeAlert

  return { lastSolve, isPersonalBest }
}
