import {
  formatCubesDatesAndOrder,
  importNexusTimerData,
  normalizeOldData,
  preventDuplicateDeleteStatus
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
import { Solve } from '@/entities/solve/model/types'

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

  const mergeAndUniqData = async (backupData: Cube[], localCubesData: Cube[]): Promise<Cube[]> => {
    const cubeMap = new Map<string, Cube>()

    for (const cube of [...backupData, ...localCubesData]) {
      const existing = cubeMap.get(cube.id)

      if (!existing) {
        cubeMap.set(cube.id, cube)
        continue
      }

      const baseCube = (cube.updatedAt ?? 0) > (existing.updatedAt ?? 0) ? cube : existing

      const otherCube = baseCube === cube ? existing : cube

      cubeMap.set(cube.id, {
        ...baseCube,
        solves: {
          session: [...baseCube.solves.session, ...otherCube.solves.session],
          all: [...baseCube.solves.all, ...otherCube.solves.all]
        }
      })
    }

    const mergedCubes = Array.from(cubeMap.values())
    return formatCubesDatesAndOrder(preventDuplicateDeleteStatus(normalizeOldData(mergedCubes)))
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

      if (mode === BackupLoadMode.REPLACE) {
        newCubes = formatCubesDatesAndOrder(preventDuplicateDeleteStatus(normalizeOldData(backupData)))
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
    handleDownloadData,
    handleUploadBackup,
    isUploading,
    uploadCompleted
  }
}
