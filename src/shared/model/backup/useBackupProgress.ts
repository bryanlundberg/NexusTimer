import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { BACKUP_INTERVAL_SOLVES } from '@/shared/model/backup/useBackupSuggestion'

export function useBackupProgress() {
  const totalSolves = useSettingsStore((state) => state.settings.sync.totalSolves)
  const current = Math.min(BACKUP_INTERVAL_SOLVES, Math.max(0, Number(totalSolves) || 0))
  const remaining = Math.max(0, BACKUP_INTERVAL_SOLVES - current)

  return { remaining, percent: (current / BACKUP_INTERVAL_SOLVES) * 100, isLast: remaining === 1 }
}
