'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeleteCollectionFormData, deleteCollectionSchema } from '@/features/manage-cubes/model/schemas'
import { deleteCubeCollection } from '@/features/manage-cubes/api/deleteCubeCollection'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { useEffect } from 'react'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'
import { AlertCircleIcon } from 'lucide-react'

export default function DeleteCollectionForm() {
  const t = useTranslations('Index')
  const setCubes = useTimerStore((state) => state.setCubes)
  const { close, activeOverlay } = useOverlayStore((state) => ({
    close: state.close,
    activeOverlay: state.activeOverlay
  }))

  const { handleSubmit, control, watch, reset } = useForm({
    resolver: zodResolver(deleteCollectionSchema),
    defaultValues: {
      confirmDeletion: false
    }
  })

  const confirmDeletion = watch('confirmDeletion')

  const handleDeleteCube = async (_form: DeleteCollectionFormData) => {
    if (!activeOverlay?.metadata?.id) return
    try {
      await deleteCubeCollection({ id: activeOverlay?.metadata.id })
      const cubes = await cubesDB.getAll()
      setCubes(cubes)
      close()
      toast.success(t('Errors.collection-deleted'))
    } catch (err) {
      console.log(err)
      toast.error(t('Errors.collection-delete-failed'))
    }
  }

  useEffect(() => {
    activeOverlay ? reset() : null
  }, [activeOverlay])

  return (
    <>
      <DialogContent className="sm:max-w-[425px]" data-testid="dialog-delete-cube-container">
        <DialogHeader>
          <DialogTitle data-testid="dialog-delete-cube-title" className={'flex gap-2 align-center'}>
            <div>
              <RatedIcon type={'cross'} />
            </div>
            <div className={'w-full my-auto'}>{t('Cubes-modal.delete-collection')}</div>
          </DialogTitle>
          <DialogDescription data-testid="dialog-delete-cube-description">
            {t('Cubes-modal.delete-collection-description')}
          </DialogDescription>
        </DialogHeader>

        <Alert
          variant="destructive"
          data-tone="danger"
          className={'alert-notch'}
          data-testid="dialog-delete-cube-warning"
        >
          <AlertCircleIcon />
          <AlertTitle>{t('Errors.permanent-delete-warning')}</AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc text-sm">
              <li>
                {activeOverlay?.metadata?.solves.session.length} {t('CubesPage.session-solves')}
              </li>
              <li>
                {activeOverlay?.metadata?.solves.all.length} {t('CubesPage.historical-solves')}
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <Controller
          control={control}
          name="confirmDeletion"
          render={({ field }) => (
            <Label className="flex items-start gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                data-testid="dialog-delete-cube-checkbox"
              />
              <span className="text-secondary-foreground text-sm">
                {t('Cubes-modal.delete-confirmation-check', { name: activeOverlay?.metadata?.name ?? '' })}
              </span>
            </Label>
          )}
        />

        <DialogFooter>
          <div className="flex justify-end gap-2 w-full">
            <DialogClose asChild>
              <Button variant={'secondary'} data-testid="dialog-delete-cube-cancel-button">
                {t('Inputs.cancel')}
              </Button>
            </DialogClose>

            <Button
              variant={'default'}
              disabled={!confirmDeletion}
              onClick={handleSubmit(handleDeleteCube)}
              data-testid="dialog-delete-cube-accept-button"
            >
              {t('Inputs.continue')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
