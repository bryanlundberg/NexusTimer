import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import {
  importNexusTimerData,
  normalizeOldData,
  preventDuplicateDeleteStatus
} from '@/features/manage-backup/lib/importDataFromFile'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import useAlert from '@/shared/model/useAlert'
import { BackupFile } from '@/entities/backup/model/types'

export function useApplyBackup() {
  const t = useTranslations('Index')
  const alert = useAlert()
  const setCubes = useTimerStore((state) => state.setCubes)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const [applyingId, setApplyingId] = useState<string | null>(null)

  const applyBackup = async (backup: BackupFile) => {
    const confirmed = await alert({
      title: t('SettingsPage.backup-apply-title'),
      subtitle: t('SettingsPage.backup-apply-subtitle'),
      confirmText: t('SettingsPage.backup-apply-confirm'),
      cancelText: t('Inputs.cancel')
    })
    if (!confirmed) return

    setApplyingId(backup.id)
    try {
      const res = await fetch(backup.url)
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`)

      const data = await res.text()
      const cubes = preventDuplicateDeleteStatus(normalizeOldData(importNexusTimerData(data)))

      await cubesDB.clear()
      await cubesDB.saveBatch(cubes)

      const fresh = await cubesDB.getAll()
      setCubes(fresh)
      setSelectedCube(null)

      toast.success(t('SettingsPage.backup-applied'))
    } catch (error) {
      console.error(error)
      toast.error(t('SettingsPage.backup-apply-error'))
    } finally {
      setApplyingId(null)
    }
  }

  return { applyBackup, applyingId }
}
