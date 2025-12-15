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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    reset
  } = useForm({
    resolver: zodResolver(deleteCollectionSchema),
    defaultValues: {
      confirmationName: ''
    }
  })

  const handleDeleteCube = async (form: DeleteCollectionFormData) => {
    if (!activeOverlay?.metadata?.id) return
    try {
      if (form.confirmationName.trim() !== activeOverlay?.metadata?.name) {
        setError('confirmationName', {
          type: 'manual',
          message: 'Collection name does not match.'
        })
        return
      }

      await deleteCubeCollection({ id: activeOverlay?.metadata.id })
      const cubes = await cubesDB.getAll()
      setCubes(cubes)
      close()
      toast.success('Collection deleted successfully')
    } catch (err) {
      console.log(err)
      toast.error('Failed to delete collection')
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

        <Alert variant="destructive" className={'bg-black'} data-testid="dialog-delete-cube-warning">
          <AlertCircleIcon />
          <AlertTitle>This will permanently delete the collection.</AlertTitle>
          <AlertDescription>
            <ul className="list-inside list-disc text-sm">
              <li>{activeOverlay?.metadata?.solves.session.length} session solves</li>
              <li>{activeOverlay?.metadata?.solves.all.length} history solves</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Label className="text-secondary-foreground/50 flex flex-wrap">
          <span>{t('Cubes-modal.input-collection-name')} </span>
          <span className="text-secondary-foreground">{activeOverlay?.metadata?.name}</span>{' '}
          <span>{t('Cubes-modal.to-continue')}</span>
        </Label>
        <Input
          {...register('confirmationName', {
            required: true,
            validate: (value) => value.trim() !== ''
          })}
          data-testid="dialog-delete-cube-input"
        />

        {errors && errors.confirmationName && (
          <p className="text-destructive text-sm" data-testid="dialog-delete-cube-error-message">
            {errors.confirmationName.message?.toString()}
          </p>
        )}
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant={'outline'} data-testid="dialog-delete-cube-cancel-button">
                {t('Inputs.cancel')}
              </Button>
            </DialogClose>

            <Button
              variant={'default'}
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
