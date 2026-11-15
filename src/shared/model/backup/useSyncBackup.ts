import { BACKUP_SUFFIX_HEADER, BACKUP_TIMEZONE_HEADER } from '@nexustimer/contracts'
import { toast } from 'sonner'
import { useSession } from '@/shared/model/useSession'
import { useTranslations } from 'next-intl'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { UserDocument } from '@/entities/user/model/user'
import { BackupLoadMode } from '@/entities/backup/model/enums'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { uploadWithProgress } from '@/shared/lib/backup/uploadWithProgress'
import { gzipJson } from '@/shared/lib/backup/gzip'
import { newBackupSuffix } from '@/shared/lib/backup/newBackupSuffix'
import { showUploadToast, UPLOAD_BACKUP_TOAST_ID } from '@/shared/model/backup/uploadToast'
import { useBackupUploadStore } from '@/shared/model/backup/useBackupUploadStore'
import { writeSyncMarker } from '@/shared/model/backup/syncMarker'
import { forcePull } from '@/shared/model/backup/pullIfBehind'

export type BackupDownloadResult = 'merged' | 'unreachable' | 'unreadable'

export const useSyncBackup = () => {
  const { data: session } = useSession()
  const t = useTranslations('Index.SettingsPage')
  const isUploading = useBackupUploadStore((state) => state.isUploading)
  const uploadProgress = useBackupUploadStore((state) => state.progress)
  const updateSetting = useSettingsStore((state) => state.updateSetting)

  const handleUploadBackup = async () => {
    const upload = useBackupUploadStore.getState()
    if (upload.isUploading) return false
    upload.start()
    showUploadToast(t('backup-uploading'), t('backup-uploading-hint'))

    try {
      const cubes = await cubesDB.getAllDatabase()
      const userId = session?.user?.id
      if (!cubes || !userId) throw new Error('Missing cubes or session')

      const suffix = newBackupSuffix()
      const blob = await gzipJson(JSON.stringify(cubes))
      const res = await uploadWithProgress('/api/v1/backups', blob, upload.setProgress, {
        [BACKUP_TIMEZONE_HEADER]: Intl.DateTimeFormat().resolvedOptions().timeZone,
        [BACKUP_SUFFIX_HEADER]: suffix
      })
      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`)

      await writeSyncMarker(userId, suffix)
      updateSetting('sync.totalSolves', 0)
      toast.dismiss(UPLOAD_BACKUP_TOAST_ID)
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
  ): Promise<BackupDownloadResult> => {
    if (!session || !session.user || !session.user.email) return 'unreachable'

    if (!user?.backup?.url) {
      toast.error(t('backup-not-found'))
      return 'unreachable'
    }

    const result = await forcePull(session.user.id, user.backup)
    if (result.status !== 'merged') toast.error(t('backup-download-error'))
    return result.status
  }

  return {
    handleDownloadData,
    handleUploadBackup,
    isUploading,
    uploadProgress
  }
}
