import _ from 'lodash'
import {
  ensureConsistency,
  formatCubesDatesAndOrder,
  importNexusTimerData,
  normalizeOldData
} from '@/features/manage-backup/lib/importDataFromFile'
import { toast } from 'sonner'
import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { UserDocument } from '@/entities/user/model/user'
import { useUploadThing } from '@/shared/lib/uploadthing-helpers'
import { BackupLoadMode } from '@/entities/backup/model/enums'
import { Cube } from '@/entities/cube/model/types'
import { cubesDB } from '@/entities/cube/api/indexdb'

export const useSyncBackup = () => {
  const { data: session } = useSession()
  const setCubes = useTimerStore((state) => state.setCubes)
  const [isUploading, setIsUploading] = useState(false)
  const updateSetting = useSettingsStore((state) => state.updateSetting)
  const [uploadCompleted, setUploadCompleted] = useState(false)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)

  const { startUpload } = useUploadThing('backupUploader', {
    onClientUploadComplete: () => {
      setIsUploading(false)
      toast.dismiss('upload-backup')
      setUploadCompleted(true)
    },
    onUploadError: (e) => {
      console.error(e)
      setIsUploading(false)
      toast.error('Error occurred while uploading')
    },
    onUploadBegin: () => {
      toast.loading('Saving new backup, please do not close this page...', { id: 'upload-backup' })
    }
  })

  const handleUploadBackup = async () => {
    if (isUploading) return
    setIsUploading(true)

    const cubes = await cubesDB.getAllDatabase()

    if (!cubes || !session || !session.user || !session.user.id) {
      setIsUploading(false)
      return toast.error('Failed to retrieve cubes or session data.')
    }

    const text = JSON.stringify(cubes)

    const compressed = compressSync(strToU8(text))
    const blob = new Blob([compressed], { type: 'application/octet-stream' })
    const file = new File([blob], `${session.user.id}.txt`, { type: 'application/octet-stream' })

    try {
      await startUpload([file])
    } catch (err) {
      console.error(err)
      setIsUploading(false)
      toast.error('Error occurred while uploading')
    }
  }

  const mergeAndUniqData = async (backupData: Cube[], localCubesData: Cube[]) => {
    const normalizedLocal = normalizeOldData(_.cloneDeep(localCubesData))
    let newCubes = normalizedLocal as Cube[]

    for (let i = 0; i < backupData.length; i++) {
      const backupCube = backupData[i]
      const existingCubeIndex = newCubes.findIndex((cube) => cube.id === backupCube.id)

      if (existingCubeIndex !== -1) {
        const existingCube = newCubes[existingCubeIndex]
        const backupUpdatedAt = backupCube.updatedAt ?? backupCube.createdAt ?? 0
        const existingUpdatedAt = existingCube.updatedAt ?? existingCube.createdAt ?? 0

        if (backupUpdatedAt > existingUpdatedAt) {
          const { solves: _backupSolves, ...restBackup } = backupCube
          Object.assign(existingCube, restBackup)
        }

        existingCube.solves.session = [...existingCube.solves.session, ...backupCube.solves.session]
        existingCube.solves.all = [...existingCube.solves.all, ...backupCube.solves.all]

        newCubes[existingCubeIndex] = ensureConsistency(existingCube)
      } else {
        newCubes.push(ensureConsistency(backupCube))
      }
    }

    return formatCubesDatesAndOrder(newCubes)
  }

  const handleDownloadData = async (
    {
      mode,
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

      let backupData = importNexusTimerData(data)
      const existingCubes = await cubesDB.getAllDatabase()

      let newCubes: Cube[] = []

      backupData = normalizeOldData(backupData)

      if (mode === BackupLoadMode.REPLACE) {
        newCubes = formatCubesDatesAndOrder(backupData).map((cube) => ensureConsistency(cube))
      }

      if (mode === BackupLoadMode.MERGE) {
        newCubes = await mergeAndUniqData(backupData, existingCubes)
      }

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
    } catch (error) {
      console.error('Error loading backup:', error)
    }
  }

  return {
    mergeAndUniqData,
    handleDownloadData,
    handleUploadBackup,
    isUploading,
    uploadCompleted
  }
}
