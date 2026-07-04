import { importNexusTimerData, normalizeOldData } from '@/features/manage-backup/lib/importDataFromFile'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { UserDocument } from '@/entities/user/model/user'
import { BackupLoadMode } from '@/entities/backup/model/enums'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { mergeAndUniqData } from '@/shared/model/backup/mergeAndUniqData'
import { uploadWithProgress } from '@/shared/lib/backup/uploadWithProgress'
import { gzipJson } from '@/shared/lib/backup/gzip'
import { showUploadToast, UPLOAD_BACKUP_TOAST_ID } from '@/shared/model/backup/uploadToast'

export const useSyncBackup = () => {
  const { data: session } = useSession()
  const setCubes = useTimerStore((state) => state.setCubes)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)

  const handleUploadBackup = async () => {
    if (isUploading) return
    setIsUploading(true)
    setUploadProgress(0)
    showUploadToast(0)

    const cubes = await cubesDB.getAllDatabase()

    if (!cubes || !session || !session.user || !session.user.id) {
      setIsUploading(false)
      toast.dismiss(UPLOAD_BACKUP_TOAST_ID)
      return toast.error('Failed to retrieve cubes or session data.')
    }

    const text = JSON.stringify(cubes)

    const blob = await gzipJson(text)

    try {
      const res = await uploadWithProgress('/api/v1/backups', blob, (percent) => {
        setUploadProgress(percent)
        showUploadToast(percent)
      })

      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`)

      setIsUploading(false)
      setUploadProgress(0)
      toast.dismiss(UPLOAD_BACKUP_TOAST_ID)
      setUploadCompleted(true)
    } catch (err) {
      console.error(err)
      setIsUploading(false)
      setUploadProgress(0)
      toast.dismiss(UPLOAD_BACKUP_TOAST_ID)
      toast.error('Error occurred while uploading')
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

      updateSetting('sync.lastSync', Date.now())
      updateSetting('sync.totalSolves', 0)

      await cubesDB.clear()
      await cubesDB.saveBatch(newCubes)
      const newCubesDB = await cubesDB.getAll()
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
    uploadProgress,
    uploadCompleted
  }
}
