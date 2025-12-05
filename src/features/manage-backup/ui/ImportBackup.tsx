import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import Image from 'next/image'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import importDataFromFile from '@/features/manage-backup/lib/importDataFromFile'
import { useRouter } from 'next/navigation'
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import ImportReview from './ImportReview'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone'
import { Spinner } from '@/components/ui/spinner'
import { Cube } from '@/entities/cube/model/types'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cubesDB } from '@/entities/cube/api/indexdb'

export default function ImportBackup() {
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
      await cubesDB.saveBatch(editedCubes)

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
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-auto items-center justify-center">
            <DialogTitle>{t('title')}</DialogTitle>
          </div>
        </DialogHeader>
        {!isImporting ? (
          <Dropzone onDrop={handleImportBackup} onError={console.error} accept={{ 'application/txt': ['.txt'] }}>
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        ) : (
          <div className="text-center mx-auto flex-col items-center gap-2">
            <div className="flex justify-center mt-3">
              <Spinner />
            </div>
            <div className="mx-auto mt-2">{t('loading-part-1')}</div>
            <div className="font-bold">{t('loading-part-2')}</div>
          </div>
        )}
        <div className="flex flex-auto items-center justify-center">
          <div className="font-medium mt-3">{t('welcome')}</div>
        </div>
        <DialogFooter>
          <ul className="flex items-center justify-center flex-auto gap-2">
            <div className="rounded-2xl size-[64px] flex items-center justify-center bg-sidebar-primary">
              <Image
                src={'/logo.png'}
                alt={'logo'}
                width={48}
                height={48}
                draggable={false}
                className={'p-3 w-full h-full invert'}
              />
            </div>
            <Image
              src={'/timer-logos/cstimer.jpg'}
              alt="cstimer logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />

            <Image
              src={'/timer-logos/twistytimer.jpg'}
              alt="twistytimer logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />

            <Image
              src={'/timer-logos/cubedesk.jpg'}
              alt="cubedesk logo"
              width={64}
              height={64}
              className="rounded-2xl"
              draggable={false}
            />
          </ul>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
