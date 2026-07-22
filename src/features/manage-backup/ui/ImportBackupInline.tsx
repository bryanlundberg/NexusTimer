import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import Image from 'next/image'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import importDataFromFile, {
  normalizeOldData,
  preventDuplicateDeleteStatus
} from '@/features/manage-backup/lib/importDataFromFile'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ImportReview from './ImportReview'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone'
import { Spinner } from '@/components/ui/spinner'
import { Cube } from '@/entities/cube/model/types'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cubesDB } from '@/entities/cube/api/indexdb'

const SUPPORTED_TIMERS = [
  { src: '/logo.png', alt: 'NexusTimer', name: 'NexusTimer', brand: true },
  { src: '/timer-logos/cstimer.jpg', alt: 'csTimer', name: 'csTimer' },
  { src: '/timer-logos/twistytimer.jpg', alt: 'TwistyTimer', name: 'TwistyTimer' },
  { src: '/timer-logos/cubedesk.jpg', alt: 'CubeDesk', name: 'CubeDesk' }
]

export default function ImportBackupInline() {
  const t = useTranslations('Index.backup-modal')
  const [isImporting, setIsImporting] = useState(false)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const setCubes = useTimerStore((state) => state.setCubes)
  const router = useRouter()
  const open = useOverlayStore((state) => state.open)
  const close = useOverlayStore((state) => state.close)

  const handleImportBackup = async (file: File[]) => {
    if (file && file.length > 0) {
      try {
        setIsImporting(true)
        const response = await importDataFromFile(file[0])
        if (response && !response?.length) return toast.error('No valid data found in the backup file.')
        if (response) {
          open({
            id: 'import-review',
            component: <ImportReview cubes={response} onCancel={close} onConfirm={handleConfirmReview} />
          })
        }
      } catch (error) {
        toast.error('Backup import failed. Please try again.')
        console.error(error)
      } finally {
        setIsImporting(false)
      }
    }
  }

  const handleConfirmReview = async (editedCubes: Cube[]) => {
    try {
      setIsImporting(true)
      await cubesDB.clear()
      await cubesDB.saveBatch(preventDuplicateDeleteStatus(normalizeOldData(editedCubes)))

      const cubes = await cubesDB.getAll()
      setCubes(cubes)
      router.push('/cubes')
      setSelectedCube(null)

      toast.success('Backup imported successfully!')
    } catch (error) {
      toast.error('Backup import failed. Please try again.')
      console.error(error)
    } finally {
      setIsImporting(false)
      close()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {!isImporting ? (
        <Dropzone
          onDrop={handleImportBackup}
          onError={console.error}
          accept={{ 'application/json': ['.json'], 'text/plain': ['.txt'] }}
          className="min-h-35"
          data-testid="import-backup-dropzone"
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      ) : (
        <div className="flex min-h-35 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center">
          <Spinner />
          <div className="mt-1">{t('loading-part-1')}</div>
          <div className="font-bold">{t('loading-part-2')}</div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {SUPPORTED_TIMERS.map((timer) => (
          <div key={timer.name} className="flex flex-col items-center gap-1">
            {timer.brand ? (
              <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary">
                <Image
                  src={timer.src}
                  alt={timer.alt}
                  width={36}
                  height={36}
                  draggable={false}
                  className="size-full p-2 invert"
                />
              </div>
            ) : (
              <Image
                src={timer.src}
                alt={timer.alt}
                width={48}
                height={48}
                draggable={false}
                className="size-8 rounded-full"
              />
            )}
            <span className="text-[10px] text-muted-foreground">{timer.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
