import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SelectCollection from '@/features/select-collection/ui/SelectCollection'
import { useEffect } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { useTranslations } from 'next-intl'
import { ChevronDownIcon } from 'lucide-react'
import { CubeNavIcon } from '@/components/ui/nav-icons'
import { cn } from '@/shared/lib/utils'

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
      <button
        type="button"
        className={cn(
          "field-notch field-notch-alt field-notch-hover [--f-border:var(--border)] cursor-pointer hover:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex h-9 w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm whitespace-nowrap transition-[color] outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          !selectedCube && 'text-muted-foreground'
        )}
        onClick={handleOpenSelector}
        data-tour="onboarding-cube-selector"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedCubeData ? (
            <span className="size-4 shrink-0">
              <CubeCategoryIcon category={selectedCubeData.name} />
            </span>
          ) : (
            <CubeNavIcon className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="min-w-0 flex-1 truncate">
            {selectedCube ? selectedCube.name : t('HomePage.select-cube')}
          </span>
        </span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
      </button>
    </div>
  )
}
