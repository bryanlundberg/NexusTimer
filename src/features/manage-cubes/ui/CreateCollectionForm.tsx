import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cubeCollection } from '@/shared/const/cube-collection'
import { cn } from '@/shared/lib/utils'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCubeFormData, createCubeFormSchema } from '@/entities/cube/model/schema'
import { CUBE_CATEGORIES } from '@/shared/const/cube-categories'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cubesDB } from '@/entities/cube/api/indexdb'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { createCubeCollection } from '@/features/manage-cubes/api/createCubeCollection'
import { useEffect } from 'react'
import { Check } from 'lucide-react'
import { Nexi } from '@/shared/ui/nexi'
import { ProductSearchInput } from '@/features/search/ui/ProductSearchInput'

export default function CreateCollectionForm() {
  const t = useTranslations('Index')
  const setCubes = useTimerStore((state) => state.setCubes)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const overlayStore = useOverlayStore((state) => ({
    close: state.close,
    activeOverlay: state.activeOverlay
  }))

  const {
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(createCubeFormSchema),
    defaultValues: {
      category: CUBE_CATEGORIES[0],
      name: ''
    }
  })

  const formWatch = watch()

  const handleSubmitNewCollection = async (form: CreateCubeFormData) => {
    try {
      const cubes = await cubesDB.getAll()
      if (cubes?.some((cube) => cube.name.toLowerCase() === form.name.trim().toLowerCase())) {
        setError('name', {
          type: 'manual',
          message: t('Errors.repeated-name')
        })
        return
      }

      const newCube = await createCubeCollection(form)
      const newCubes = await cubesDB.getAll()
      setCubes(newCubes)
      setSelectedCube(newCube)
      setNewScramble(newCube)
      overlayStore.close()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    overlayStore.activeOverlay ? reset() : null
  }, [overlayStore.activeOverlay])

  return (
    <DialogContent
      className="flex max-h-[85dvh] flex-col p-4 sm:max-w-2xl sm:p-6"
      data-testid="drawer-create-collection"
    >
      <DialogHeader className="shrink-0">
        <DialogTitle className="flex items-center gap-3">
          <Nexi state="idle" size={38} />
          <span className="my-auto">{t('Cubes-modal.new-collection')}</span>
        </DialogTitle>
        <DialogDescription>{t('CubesPage.new-collection-description')}</DialogDescription>
      </DialogHeader>

      <div className="-mx-2 min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-2">
        <div className="space-y-5 py-1">
          <div className="space-y-2">
            <Label htmlFor="name">{t('Cubes-modal.name')}</Label>
            <ProductSearchInput
              id="name"
              data-testid="drawer-input-name"
              placeholder="E.g: X Man Tornado V3 M"
              value={formWatch.name}
              onValueChange={(value) => setValue('name', value, { shouldValidate: true })}
              onSelect={(hit) => setValue('name', hit.name, { shouldValidate: true })}
            />

            {errors?.name && (
              <p className="text-destructive text-xs" data-testid="drawer-create-collection-error-message">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
              <Label>{t('Cubes-modal.category')}</Label>
              <span className="text-muted-foreground text-xs">
                {t('Cubes-modal.current-selection')}{' '}
                <span className="text-foreground font-medium">{formWatch.category}</span>
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
              {cubeCollection.map((e) => {
                const selected = formWatch.category === e.name
                return (
                  <button
                    type="button"
                    key={e.name}
                    data-testid={'checkbox-category-' + e.name}
                    aria-pressed={selected}
                    aria-label={e.name}
                    title={e.name}
                    onClick={() => setValue('category', e.name)}
                    className={cn(
                      'group focus-visible:ring-ring focus-visible:ring-offset-background relative flex min-w-0 flex-col items-center gap-1 rounded-lg border-0 p-1.5 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-1.5 sm:border sm:p-2',
                      selected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-border hover:border-primary/40 hover:bg-accent'
                    )}
                  >
                    {selected && (
                      <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full">
                        <Check className="size-3" />
                      </span>
                    )}
                    <Image
                      priority
                      unoptimized
                      src={e.src}
                      alt={e.event || ''}
                      width={56}
                      height={56}
                      draggable={false}
                      className="size-9 transition-transform duration-150 group-hover:scale-105 motion-reduce:transform-none sm:size-12"
                    />
                    <span
                      className={cn(
                        'hidden w-full truncate text-center text-[11px] leading-tight font-medium sm:block',
                        selected ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {e.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="shrink-0">
        <div className="flex w-full justify-between">
          <DialogClose asChild>
            <Button variant={'ghost'} data-testid="drawer-cancel-button">
              {t('Inputs.cancel')}
            </Button>
          </DialogClose>

          <Button
            variant={'default'}
            onClick={handleSubmit(handleSubmitNewCollection)}
            data-testid="drawer-accept-button"
          >
            {t('Inputs.create')}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}
