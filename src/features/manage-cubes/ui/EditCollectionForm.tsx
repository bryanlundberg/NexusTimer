'use client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cubeCollection } from '@/shared/const/cube-collection'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateCollectionFormData, updateCollectionSchema } from '@/features/manage-cubes/model/schemas'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { editCubeCollection } from '@/features/manage-cubes/api/editCubeCollection'
import { useEffect } from 'react'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'

export default function EditCollectionForm() {
  const t = useTranslations('Index')
  const setCubes = useTimerStore((state) => state.setCubes)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)

  const overlayStore = useOverlayStore((state) => ({
    close: state.close,
    activeOverlay: state.activeOverlay
  }))

  const metadata = overlayStore.activeOverlay?.metadata

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    reset
  } = useForm({
    resolver: zodResolver(updateCollectionSchema),
    defaultValues: {
      name: metadata?.name || '',
      category: metadata?.category || '2x2'
    }
  })

  const handleSubmitEditCubeCollection = async (form: UpdateCollectionFormData) => {
    try {
      const cubes = await cubesDB.getAll()

      if (metadata?.name !== form.name && cubes?.some((e) => e.name.toLowerCase() === form.name.trim().toLowerCase())) {
        setError('name', {
          type: 'manual',
          message: 'Cube collection name already exists.'
        })
        return
      }

      await editCubeCollection({
        id: metadata!.id,
        name: form.name,
        category: form.category
      })

      const updatedCubes = await cubesDB.getAll()

      setCubes(updatedCubes)

      if (metadata?.id === selectedCube?.id) {
        setSelectedCube(null)
      }

      overlayStore.close()
      toast.success('Cube edited successfully')
    } catch (err) {
      console.log(err)
      toast.error('Failed to edit cube')
    }
  }

  useEffect(() => {
    overlayStore.activeOverlay ? reset() : null
  }, [overlayStore.activeOverlay])

  return (
    <>
      <DialogContent className="sm:max-w-[425px]" data-testid="drawer-edit-collection-container">
        <DialogHeader>
          <DialogTitle data-testid="dialog-edit-title-modal" className={'flex gap-2 align-center'}>
            <div>
              <RatedIcon type={'partial'} />
            </div>
            <div className={'w-full my-auto'}>{t('Cubes-modal.edit-collection')}</div>
          </DialogTitle>
        </DialogHeader>

        <Alert className="bg-black">
          <AlertDescription className="text-yellow-300">{t('Cubes-modal.danger-msg')}</AlertDescription>
        </Alert>

        <Label>{t('Cubes-modal.name')}</Label>
        <Input {...register('name')} data-testid="drawer-edit-input-name" />

        {errors?.name && (
          <p className="text-destructive text-sm" data-testid="drawer-edit-collection-error-message">
            {errors.name.message?.toString()}
          </p>
        )}

        <Label>{t('Cubes-modal.category')}</Label>
        <Controller
          name="category"
          control={control}
          rules={{ required: 'Required field' }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={'w-full'} data-testid="drawer-edit-select-category">
                <SelectValue placeholder={t('Cubes-modal.select-an-option')} />
              </SelectTrigger>
              <SelectContent>
                {cubeCollection.map((cube) => (
                  <SelectItem
                    key={cube.id}
                    value={cube.name}
                    data-testid={`drawer-edit-select-category-item-${cube.name}`}
                  >
                    {cube.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <DialogFooter>
          <div className="flex justify-between w-full">
            <DialogClose asChild>
              <Button variant={'outline'} data-testid="drawer-edit-cancel-button">
                {t('Inputs.cancel')}
              </Button>
            </DialogClose>

            <Button
              variant={'default'}
              onClick={handleSubmit(handleSubmitEditCubeCollection)}
              data-testid="drawer-edit-accept-button"
            >
              {t('Inputs.continue')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
