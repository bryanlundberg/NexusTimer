import _ from 'lodash'
import { formatCubesDatesAndOrder, importNexusTimerData, normalizeOldData } from '@/lib/importDataFromFile'
import { toast } from 'sonner'
import { compressSync, decompressSync, strFromU8, strToU8 } from 'fflate'
import { useNXData } from '@/hooks/useNXData'
import { useSession } from 'next-auth/react'
import { useTimerStore } from '@/store/timerStore'
import { useState } from 'react'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { UserDocument } from '@/models/user'
import { useUploadThing } from '@/shared/lib/uploadthing-helpers'
import { BackupLoadMode } from '@/entities/backup/model/enums'
import { Cube } from '@/entities/cube/model/types'

export const useSyncBackup = () => {
  const { clearCubes, getAllCubes, saveBatchCubes, getAllDatabase } = useNXData()
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

    const cubes = await getAllCubes()

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
    let newCubes = _.cloneDeep(localCubesData) as Cube[]

    for (let i = 0; i < backupData.length; i++) {
      const backupCube = backupData[i]
      const existingCube = newCubes.find((cube) => cube.id === backupCube.id)

      if (existingCube) {
        const backupUpdatedAt = backupCube.updatedAt || backupCube.createdAt || 0
        const existingUpdatedAt = existingCube.updatedAt || existingCube.createdAt || 0

        if (backupUpdatedAt > existingUpdatedAt) {
          existingCube.name = backupCube.name
          existingCube.category = backupCube.category
          existingCube.favorite = backupCube.favorite
          existingCube.updatedAt = backupCube.updatedAt
          existingCube.isDeleted = backupCube.isDeleted
        }

        const mergedSession = [...existingCube.solves.session, ...backupCube.solves.session]
        const sessionMap = new Map()

        mergedSession.forEach((solve) => {
          const existing = sessionMap.get(solve.id)
          if (!existing) {
            sessionMap.set(solve.id, solve)
          } else {
            const existingTime = existing.updatedAt || existing.endTime || 0
            const newTime = solve.updatedAt || solve.endTime || 0
            if (newTime > existingTime) {
              sessionMap.set(solve.id, solve)
            }
          }
        })

        const mergedAll = [...existingCube.solves.all, ...backupCube.solves.all]
        const allMap = new Map()

        mergedAll.forEach((solve) => {
          const existing = allMap.get(solve.id)
          if (!existing) {
            allMap.set(solve.id, solve)
          } else {
            const existingTime = existing.updatedAt || existing.startTime || 0
            const newTime = solve.updatedAt || solve.startTime || 0
            if (newTime > existingTime) {
              allMap.set(solve.id, solve)
            }
          }
        })

        existingCube.solves.session = Array.from(sessionMap.values())
        existingCube.solves.all = Array.from(allMap.values())
      } else {
        newCubes.push(backupCube)
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
      const existingCubes = await getAllDatabase()

      let newCubes: Cube[] = []

      backupData = normalizeOldData(backupData)

      if (mode === BackupLoadMode.REPLACE) {
        newCubes = formatCubesDatesAndOrder(backupData)
      }

      if (mode === BackupLoadMode.MERGE) {
        newCubes = await mergeAndUniqData(backupData, existingCubes)
      }

      updateSetting('sync.lastSync', Date.now())
      updateSetting('sync.totalSolves', 0)

      await clearCubes()
      await saveBatchCubes(newCubes)
      const newCubesDB = await getAllCubes()
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
