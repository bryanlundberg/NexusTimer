'use client'
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
import { editCubeCollection } from '@/features/manage-cubes/api/editCubeCollection'
import { useEffect } from 'react'
import RatedIcon from '@/shared/ui/rate-icon/RateIcon'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { TriangleAlert } from 'lucide-react'

export default function EditCollectionForm() {
  const t = useTranslations('Index')
  const patchCube = useTimerStore((state) => state.patchCube)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)

  const close = useOverlayStore((state) => state.close)
  const activeOverlay = useOverlayStore((state) => state.activeOverlay)

  const metadata = activeOverlay?.metadata

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      patchCube(
        await editCubeCollection({
          id: metadata!.id,
          name: form.name,
          category: form.category
        })
      )

      if (metadata?.id === selectedCube?.id) {
        setSelectedCube(null)
      }

      close()
    } catch (err) {
      console.log(err)
      toast.error(t('Errors.collection-edit-failed'))
    }
  }

  useEffect(() => {
    activeOverlay ? reset() : null
  }, [activeOverlay])

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

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="edit-collection-name">{t('Cubes-modal.name')}</Label>
            <Input
              id="edit-collection-name"
              {...register('name')}
              aria-invalid={!!errors?.name}
              autoComplete="off"
              className="h-11 sm:h-10"
              data-testid="drawer-edit-input-name"
            />
            {errors?.name && (
              <p
                className="text-destructive text-[13px] font-medium sm:text-xs"
                data-testid="drawer-edit-collection-error-message"
              >
                {errors.name.message?.toString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-collection-category">{t('Cubes-modal.category')}</Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: t('Errors.required-field') }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="edit-collection-category"
                    className="h-11 w-full sm:h-10"
                    data-testid="drawer-edit-select-category"
                  >
                    <SelectValue placeholder={t('Cubes-modal.select-an-option')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cubeCollection.map((cube) => (
                      <SelectItem
                        key={cube.id}
                        value={cube.name}
                        data-testid={`drawer-edit-select-category-item-${cube.name}`}
                      >
                        <span className="size-4 shrink-0">
                          <CubeCategoryIcon category={cube.name} />
                        </span>
                        {cube.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="flex items-start gap-1.5 text-[13px] leading-snug text-muted-foreground sm:text-xs">
              <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
              {t('Cubes-modal.danger-msg')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end gap-2 [&>*]:flex-1 sm:[&>*]:flex-none [&>*]:pointer-coarse:h-11">
            <DialogClose asChild>
              <Button variant={'secondary'} data-testid="drawer-edit-cancel-button">
                {t('Inputs.cancel')}
              </Button>
            </DialogClose>

            <Button
              variant={'default'}
              onClick={handleSubmit(handleSubmitEditCubeCollection)}
              data-testid="drawer-edit-accept-button"
            >
              {t('Inputs.save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
