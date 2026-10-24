'use client'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useLocale, useTranslations } from 'next-intl'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateCollectionFormData, updateCollectionSchema } from '@/features/manage-cubes/model/schemas'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { editCubeCollection } from '@/features/manage-cubes/api/editCubeCollection'
import { useEffect } from 'react'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { TriangleAlert } from 'lucide-react'
import dayjs from '@/shared/lib/dayjs'
import { Solve } from '@/entities/solve/model/types'
import CubeCategoryGrid from '@/features/manage-cubes/ui/CubeCategoryGrid'

export default function EditCollectionForm() {
  const t = useTranslations('Index')
  const locale = useLocale()
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
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(updateCollectionSchema),
    defaultValues: {
      name: metadata?.name || '',
      category: metadata?.category || '2x2'
    }
  })

  const category = useWatch({ control, name: 'category' })
  const categoryChanged = !!metadata && category !== metadata.category
  const solveCount = metadata
    ? new Set([...metadata.solves.all, ...metadata.solves.session].map((solve: Solve) => solve.id)).size
    : 0

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
      <DialogContent
        className="flex max-h-[85dvh] flex-col sm:max-w-2xl"
        data-testid="drawer-edit-collection-container"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle data-testid="dialog-edit-title-modal" className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center bg-muted text-foreground">
              <span className="size-6">
                <CubeCategoryIcon category={category} />
              </span>
            </span>
            <span className="flex min-w-0 flex-col gap-0.5 text-left">
              <span>{t('Cubes-modal.edit-collection')}</span>
              {metadata && (
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {t('CubesPage.total-solves-count', { count: solveCount })} · {t('CubesPage.created')}{' '}
                  {dayjs(metadata.createdAt).locale(locale).format('L')}
                </span>
              )}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="-mx-2 min-h-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto px-2 py-1">
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

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <Label>{t('Cubes-modal.category')}</Label>
              <span className="text-xs text-muted-foreground">
                {t('Cubes-modal.current-selection')} <span className="font-medium text-foreground">{category}</span>
              </span>
            </div>
            <CubeCategoryGrid
              value={category}
              onChange={(next) => setValue('category', next)}
              testIdPrefix="drawer-edit-category"
            />
            {categoryChanged && (
              <p className="flex items-start gap-1.5 text-[13px] leading-snug text-muted-foreground sm:text-xs">
                <TriangleAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-warning" />
                {t('Cubes-modal.danger-msg')}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <div className="flex w-full justify-end gap-2 [&>*]:flex-1 sm:[&>*]:flex-none [&>*]:pointer-coarse:h-11">
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
              {t('Inputs.save')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
