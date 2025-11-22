import { Button } from '@/components/ui/button'
import { DrawerClose, DrawerDescription, DrawerFooter, DrawerTitle } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cubeCollection } from '@/lib/const/cubeCollection'
import { cn } from '@/lib/utils'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCubeFormData, createCubeFormSchema } from '@/entities/cube/model/schema'
import { CUBE_CATEGORIES } from '@/shared/config/cube-categories'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { cubesDB } from '@/entities/cube/api/indexdb'
import { DialogContent, DialogHeader } from '@/components/ui/dialog'
import { createCubeCollection } from '@/features/manage-cubes/api/createCubeCollection'

export default function CreateCollectionForm() {
  const t = useTranslations('Index')
  const setCubes = useTimerStore((state) => state.setCubes)
  const overlayStore = useOverlayStore((state) => ({
    close: state.close,
    activeOverlay: state.activeOverlay
  }))

  const {
    handleSubmit,
    setError,
    formState: { errors },
    register,
    watch,
    setValue
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
      if (cubes?.some((cube) => cube.name === form.name.trim())) {
        setError('name', {
          type: 'manual',
          message: 'Cube collection name already exists.'
        })
        return
      }

      await createCubeCollection(form)
      const newCubes = await cubesDB.getAll()
      setCubes(newCubes)
      overlayStore.close()
      toast.success('Cube collection created successfully')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <DialogContent className="max-w-[800px] mx-auto" data-testid="drawer-create-collection">
      <ScrollArea className={'overflow-auto'}>
        <DialogHeader>
          <DrawerTitle>{t('Cubes-modal.new-collection')}</DrawerTitle>
          <DrawerDescription>{t('Cubes-modal.new-collection-description')}</DrawerDescription>
        </DialogHeader>

        <div className="p-3 space-y-2">
          <Label htmlFor="name">{t('Cubes-modal.name')}</Label>
          <Input
            autoComplete={'off'}
            data-testid="drawer-input-name"
            id="name"
            placeholder="E.g: X Man Tornado V3 M"
            {...register('name', {
              required: 'A name is required'
            })}
          />

          {errors?.name && <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>}

          <div className="mt-3"></div>
          <Label>{t('Cubes-modal.category')}</Label>
          <div className="grid grid-cols-6 md:grid-cols-6 gap-5 place-items-center mt-3">
            {cubeCollection.map((e) => {
              return (
                <Image
                  data-testid={'checkbox-category-' + e.name}
                  key={e.name}
                  src={e.src}
                  alt={e.event || ''}
                  className={cn(
                    'w-full max-w-fit max-h-14 md:max-h-20 object-scale-down rounded hover:scale-105 transition duration-200',
                    `${formWatch.category === e.name ? 'rounded scale-105 outline-primary outline-4' : ''}`
                  )}
                  draggable={false}
                  onClick={() => {
                    setValue('category', e.name)
                  }}
                />
              )
            })}
          </div>

          <div className="mt-3"></div>
          <Label>
            {t('Cubes-modal.current-selection')} {formWatch.category}
          </Label>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit(handleSubmitNewCollection)} data-testid="drawer-accept-button">
            {t('Inputs.create')}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full" data-testid="drawer-cancel-button">
              {t('Inputs.cancel')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </ScrollArea>
    </DialogContent>
  )
}
