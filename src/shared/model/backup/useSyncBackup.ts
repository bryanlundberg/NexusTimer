import { importNexusTimerData, normalizeOldData } from '@/features/manage-backup/lib/importDataFromFile'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { UserDocument } from '@/entities/user/model/user'
import { BackupLoadMode } from '@/entities/backup/model/enums'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { mergeAndUniqData } from '@/shared/model/backup/mergeAndUniqData'
import { uploadWithProgress } from '@/shared/lib/backup/uploadWithProgress'
import { gzipJson } from '@/shared/lib/backup/gzip'
import { showUploadToast, UPLOAD_BACKUP_TOAST_ID } from '@/shared/model/backup/uploadToast'
import { useBackupUploadStore } from '@/shared/model/backup/useBackupUploadStore'

export const useSyncBackup = () => {
  const { data: session } = useSession()
  const t = useTranslations('Index.SettingsPage')
  const setCubes = useTimerStore((state) => state.setCubes)
  const isUploading = useBackupUploadStore((state) => state.isUploading)
  const uploadProgress = useBackupUploadStore((state) => state.progress)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)

  const handleUploadBackup = async () => {
    const upload = useBackupUploadStore.getState()
    if (upload.isUploading) return false
    upload.start()
    showUploadToast(t('backup-uploading'))

    try {
      const cubes = await cubesDB.getAllDatabase()
      if (!cubes || !session?.user?.id) throw new Error('Missing cubes or session')

      const blob = await gzipJson(JSON.stringify(cubes))
      const res = await uploadWithProgress('/api/v1/backups', blob, upload.setProgress, {
        'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
      })
      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`)

      updateSetting('sync.totalSolves', 0)
      toast.dismiss(UPLOAD_BACKUP_TOAST_ID)
      toast.success(t('save-data-toast'))
      return true
    } catch (err) {
      console.error(err)
      toast.dismiss(UPLOAD_BACKUP_TOAST_ID)
      toast.error(t('backup-upload-error'))
      return false
    } finally {
      upload.finish()
    }
  }

  const handleDownloadData = async (
    {
      user
    }: {
      mode?: BackupLoadMode
      user?: UserDocument
    } = {
      mode: BackupLoadMode.MERGE,
      user: undefined
    }
  ) => {
    if (!session || !session.user || !session.user.email) return

    try {
      if (!user?.backup?.url) {
        toast.error('No backup found for this user.')
        return false
      }

      const doc = await fetch(`${user.backup.url}`)
      const data = await doc.text()

      const backupData = importNexusTimerData(data)
      const existingCubes = await cubesDB.getAllDatabase()

      const newCubes: Cube[] = await mergeAndUniqData(normalizeOldData(backupData), normalizeOldData(existingCubes))

      const newCubesDB = await cubesDB.replaceAll(newCubes)
      setCubes(newCubesDB)

      if (selectedCube) {
        const isSelectedCubeStillExists = newCubesDB.find((cube) => cube.id === selectedCube.id && !cube.isDeleted)
        if (isSelectedCubeStillExists) {
          setSelectedCube(isSelectedCubeStillExists)
        } else {
          setSelectedCube(null)
        }
      }
    } catch {
      toast.error('Error loading backup')
    }
  }

  return {
    handleDownloadData,
    handleUploadBackup,
    isUploading,
    uploadProgress
  }
}
