import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cubesDB } from '@/entities/cube/api/indexdb'

export default function DialogMoveHistorial() {
  const overlayStore = useOverlayStore()
  const t = useTranslations('Index')
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setCubes = useTimerStore((state) => state.setCubes)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)

  const handleMoveSessionToHistorial = async () => {
    if (selectedCube) {
      await cubesDB.endSessionForCube(selectedCube)
      const cubes = await cubesDB.getAll()
      setCubes(cubes)
      const currentCube = await cubesDB.getById(selectedCube.id)
      setSelectedCube(currentCube)
      return
    }

    toast(t('SolvesPage.toast.unable-action'), {
      description: t('SolvesPage.toast.warning-select-cube')
    })
  }

  return (
    <>
      <DialogContent className="max-w-96 rounded-md">
        <DialogHeader>
          <DialogTitle>{t('SolvesPage.dialogs.move-to-history')}</DialogTitle>
          <DialogDescription>{t('SolvesPage.dialogs.move-to-history-para')}</DialogDescription>
          <DialogFooter>
            <div className="flex justify-end gap-1 mt-5">
              <Button variant={'ghost'} onClick={overlayStore.close}>
                {t('Inputs.cancel')}
              </Button>
              <Button variant={'ghost'} onClick={handleMoveSessionToHistorial}>
                {t('Inputs.move')}
              </Button>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </>
  )
}
