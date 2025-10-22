import { Button } from '@/components/ui/button'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Categories } from '@/interfaces/Categories'
import { cubeCollection } from '@/lib/const/cubeCollection'
import { cn } from '@/lib/utils'
import { useTimerStore } from '@/store/timerStore'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect } from 'react'
import { useNXData } from '@/hooks/useNXData'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function DrawerCreateCollection({
  closeDrawer
}: Readonly<{
  closeDrawer: () => void
}>) {
  const { saveCube, getAllCubes } = useNXData()
  const t = useTranslations('Index')
  const cubes = useTimerStore((state) => state.cubes)
  const setCubes = useTimerStore((state) => state.setCubes)
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    register,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      category: '2x2',
      name: ''
    }
  })

  const formWatch = watch()

  const handleSubmitNewCollection = async (form: { category: string; name: string }) => {
    try {
      if (form.name.trim() === '') {
        setError('category', {
          type: 'manual',
          message: t('Cubes-modal.name-required')
        })
        return
      }

      if (cubes?.some((cube) => cube.name === form.name.trim())) {
        setError('name', {
          type: 'manual',
          message: t('Cubes-modal.name-repeated')
        })
        return
      }

      await saveCube({
        name: form.name,
        category: form.category as Categories
      })
      const cubesDB = await getAllCubes()
      setCubes(cubesDB)
      closeDrawer()
      toast.success('Cube collection created successfully')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    reset({
      category: '2x2',
      name: ''
    })
  }, [reset, closeDrawer])

  return (
    <DrawerContent className="max-w-[800px] mx-auto" data-testid="drawer-create-collection">
      <ScrollArea className={'overflow-auto'}>
        <DrawerHeader>
          <DrawerTitle>{t('Cubes-modal.new-collection')}</DrawerTitle>
          <DrawerDescription>{t('Cubes-modal.new-collection-description')}</DrawerDescription>
        </DrawerHeader>

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
    </DrawerContent>
  )
}
