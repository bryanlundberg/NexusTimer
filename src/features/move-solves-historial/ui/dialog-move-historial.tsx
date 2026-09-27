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
  const patchCubes = useTimerStore((state) => state.patchCubes)

  const handleMoveSessionToHistorial = async () => {
    if (selectedCube) {
      patchCubes(await cubesDB.endSessionForCube(selectedCube))
      overlayStore.close()
      return
    }

    toast(t('SolvesPage.toast.unable-action'), {
      description: t('SolvesPage.toast.warning-select-cube')
    })
  }

  return (
    <>
      <DialogContent className="max-w-96">
        <DialogHeader>
          <DialogTitle>{t('SolvesPage.dialogs.move-to-history')}</DialogTitle>
          <DialogDescription>{t('SolvesPage.dialogs.move-to-history-para')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full justify-end gap-2 [&>*]:flex-1 sm:[&>*]:flex-none [&>*]:pointer-coarse:h-11">
            <Button variant={'secondary'} onClick={overlayStore.close}>
              {t('Inputs.cancel')}
            </Button>
            <Button onClick={handleMoveSessionToHistorial}>{t('SolvesPage.dialogs.confirm')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
