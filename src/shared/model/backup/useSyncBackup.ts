import { importNexusTimerData, normalizeOldData } from '@/features/manage-backup/lib/importDataFromFile'
import { toast } from 'sonner'
import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { UserDocument } from '@/entities/user/model/user'
import { BackupLoadMode } from '@/entities/backup/model/enums'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { mergeAndUniqData } from '@/shared/model/backup/mergeAndUniqData'

export const useSyncBackup = () => {
  const { data: session } = useSession()
  const setCubes = useTimerStore((state) => state.setCubes)
  const [isUploading, setIsUploading] = useState(false)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)

  const handleUploadBackup = async () => {
    if (isUploading) return
    setIsUploading(true)
    toast.loading('Saving new backup, please do not close this page...', { id: 'upload-backup' })

    const cubes = await cubesDB.getAllDatabase()

    if (!cubes || !session || !session.user || !session.user.id) {
      setIsUploading(false)
      toast.dismiss('upload-backup')
      return toast.error('Failed to retrieve cubes or session data.')
    }

    const text = JSON.stringify(cubes)

    const compressed = compressSync(strToU8(text))
    const blob = new Blob([compressed], { type: 'application/octet-stream' })

    try {
      const res = await fetch('/api/v1/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: blob
      })

      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`)

      setIsUploading(false)
      toast.dismiss('upload-backup')
      setUploadCompleted(true)
    } catch (err) {
      console.error(err)
      setIsUploading(false)
      toast.dismiss('upload-backup')
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
      const compressed = new Uint8Array(await doc.arrayBuffer())

      const decompressed = decompressSync(compressed)
      const data = strFromU8(decompressed)

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
    uploadCompleted
  }
}
