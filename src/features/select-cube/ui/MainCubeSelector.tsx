import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { Button } from '@/components/ui/button'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SelectCollection from '@/features/select-collection/ui/SelectCollection'
import { useEffect } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Box, ChevronDown } from 'lucide-react'

export default function MainCubeSelector() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const open = useOverlayStore((state) => state.open)
  const t = useTranslations('Index')

  const selectedCubeData = cubeCollection.find((cube) => cube.name === selectedCube?.category)

  const handleOpenSelector = () => {
    open({
      component: <SelectCollection />,
      id: 'Select Collection',
      metadata: {}
    })
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleOpenSelector()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="flex-1 min-w-0">
      <Button
        variant={'outline'}
        notch={false}
        className={'w-full justify-between h-9 items-center text-left rounded-sm px-3 hover:bg-transparent'}
        onClick={handleOpenSelector}
        data-tour="onboarding-cube-selector"
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedCubeData ? (
            <Image
              src={selectedCubeData.src}
              alt={selectedCubeData.name}
              width={20}
              height={20}
              className="invert dark:invert-0 shrink-0 size-4"
            />
          ) : (
            <Box className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="h-5 w-px shrink-0 bg-border" aria-hidden />
          <span className={'min-w-0 flex-1 truncate'}>
            {selectedCube ? selectedCube.name : t('HomePage.select-cube')}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="h-5 w-px bg-border" aria-hidden />
          <ChevronDown className="size-3 text-primary" />
        </div>
      </Button>
    </div>
  )
}
