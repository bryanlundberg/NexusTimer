import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import SelectCollection from '@/features/select-collection/ui/SelectCollection'
import { useEffect } from 'react'
import { cubeCollection } from '@/shared/const/cube-collection'
import { CubeCategoryIcon } from '@/shared/ui/cube-category-icon/CubeCategoryIcon'
import { useTranslations } from 'next-intl'
import { ChevronDownIcon } from 'lucide-react'
import { CubeNavIcon } from '@/components/ui/nav-icons-solid'
import { cn } from '@/shared/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/ui/kbd'
import { useIsShortcutFree } from '@/features/timer/model/useIsShortcutFree'
import { useSettingsStore } from '@/shared/model/settings/useSettingsStore'
import { TimerStatus } from '@/features/timer/model/enums'

export default function MainCubeSelector() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const open = useOverlayStore((state) => state.open)
  const t = useTranslations('Index')
  const isShortcutFree = useIsShortcutFree('KeyC')

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
      if (e.key.toLowerCase() !== 'c') return
      if (e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return
      const el = document.activeElement as HTMLElement | null
      const tag = el?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el?.isContentEditable || el?.role === 'textbox')
        return
      if (useOverlayStore.getState().isOpen) return
      if (document.querySelector('[role="dialog"], [role="alertdialog"], [role="menu"]')) return
      const { isSolving, timerStatus } = useTimerStore.getState()
      if (isSolving || timerStatus !== TimerStatus.IDLE) return
      if (e.code === useSettingsStore.getState().settings.timer.activationKey) return
      e.preventDefault()
      handleOpenSelector()
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="flex-1 min-w-0">
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                "field field-hover cursor-pointer hover:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex h-9 w-full items-center justify-between pointer-coarse:h-10 gap-2 px-3 py-2 text-left text-sm whitespace-nowrap transition-[color] outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                !selectedCube && 'text-muted-foreground'
              )}
              onClick={handleOpenSelector}
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
          </TooltipTrigger>
          <TooltipContent className="pointer-coarse:hidden">
            <p className="flex items-center gap-2">
              {t('HomePage.select-cube')}
              {isShortcutFree && <Kbd>C</Kbd>}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
