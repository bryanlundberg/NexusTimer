import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useOnboardingStore } from '@/features/onboarding-tour/model/useOnboardingStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { CUBE_CATEGORIES, CubeCategory } from '@/shared/const/cube-categories'
import { cubeColorClass } from '@/shared/const/cube-colors'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { Check, ListFilter, PlusIcon, Search } from 'lucide-react'
import { Nexi } from '@/shared/ui/nexi'
import { cn } from '@/shared/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { CubeListItem } from '@/features/select-collection/ui/CubeListItem'

type Filter = CubeCategory | 'all'

const ONBOARDING_TARGET = 'onboarding-create-collection'

export default function SelectCollection() {
  const close = useOverlayStore((state) => state.close)
  const isOpen = useOverlayStore((state) => state.isOpen)
  const lockSelectClose = useOnboardingStore((state) => state.lockSelectClose)
  const cubes = useTimerStore((state) => state.cubes)
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const { handleCreate } = useCubeActions(undefined)
  const setSelectedCube = useTimerStore((state) => state.setSelectedCube)
  const setNewScramble = useTimerStore((state) => state.setNewScramble)
  const setLastSolve = useTimerStore((state) => state.setLastSolve)

  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  // While the category dropdown is open, swallow any outside pointer/escape at
  // the capture phase so it only closes the dropdown, never the whole dialog.
  useEffect(() => {
    if (!filterOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const insideDropdown = (e.target as Element | null)?.closest?.('[data-slot="dropdown-menu-content"]')
      if (insideDropdown) return
      e.preventDefault()
      e.stopPropagation()
      setFilterOpen(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      e.stopPropagation()
      setFilterOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [filterOpen])

  const allCubes = useMemo(() => cubes ?? [], [cubes])

  const disciplines = useMemo(() => {
    return CUBE_CATEGORIES.map((category) => ({
      category,
      count: allCubes.filter((c) => c.category === category).length
    })).filter((d) => d.count > 0)
  }, [allCubes])

  const visibleCubes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allCubes
      .filter((c) => (filter === 'all' ? true : c.category === filter))
      .filter((c) => (q ? c.name.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        if (a.favorite !== b.favorite) return a.favorite ? -1 : 1
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      })
  }, [allCubes, filter, query])

  const onSelect = (id: string) => {
    const choseCube = allCubes.find((cube) => cube.id === id)
    if (!choseCube) return
    setSelectedCube(choseCube)
    setNewScramble(choseCube)
    setLastSolve(null)
    close()
  }

  const filterLabel = filter === 'all' ? t('SolvesPage.all') : filter

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // During the onboarding tour, force the user to click the "create
        // collection" button — ignore outside-click/ESC dismissals.
        if (!open && lockSelectClose) return
        if (!open) close()
      }}
    >
      <DialogContent className="overflow-hidden p-0 sm:max-w-md" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden>

        <div className="flex h-[70dvh] max-h-112 min-w-0 flex-col overflow-hidden sm:h-104 sm:max-h-none">
          {/* Search + category filter */}
          <div className="flex items-center gap-2 border-b p-2">
            <div className="field-notch group flex flex-1 items-center gap-2 px-3">
              <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('Inputs.search')}
                className="relative z-[1] h-9 w-full min-w-0 border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <DropdownMenu modal={false} open={filterOpen} onOpenChange={setFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 gap-1.5"
                  aria-label={t('CubesPage.category')}
                >
                  {filter === 'all' ? (
                    <ListFilter className="size-4" />
                  ) : (
                    <span className={cn('size-2 shrink-0 rounded-full', cubeColorClass(filter))} />
                  )}
                  <span className="max-w-24 truncate">{filterLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[60] min-w-44">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  <span className="size-2 shrink-0 rounded-full bg-muted-foreground" />
                  <span className="flex-1">{t('SolvesPage.all')}</span>
                  <span className="text-xs text-muted-foreground">{allCubes.length}</span>
                  {filter === 'all' && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>
                {disciplines.map((d) => (
                  <DropdownMenuItem key={d.category} onClick={() => setFilter(d.category)}>
                    <span className={cn('size-2 shrink-0 rounded-full', cubeColorClass(d.category))} />
                    <span className="flex-1 truncate">{d.category}</span>
                    <span className="text-xs text-muted-foreground">{d.count}</span>
                    {filter === d.category && <Check className="size-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cube list */}
          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {visibleCubes.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-4">
                <Nexi state="solving" size={72} aria-label={t('Inputs.no-results')} />
                <p className="text-sm text-muted-foreground">
                  {t('Inputs.no-results')}
                  {query.trim() && <span className="ml-1 font-medium text-foreground">&quot;{query.trim()}&quot;</span>}
                </p>
                <Button onClick={handleCreate} variant="secondary" size="sm">
                  <PlusIcon className="size-4" />
                  {t('CubesPage.new-collection')}
                </Button>
              </div>
            ) : (
              visibleCubes.map((cube) => (
                <CubeListItem key={cube.id} cube={cube} onSelect={onSelect} isSelected={selectedCube?.id === cube.id} />
              ))
            )}
          </div>

          {/* Create collection (fixed footer) */}
          <div className="border-t p-2">
            <Button
              variant="secondary"
              onClick={handleCreate}
              data-tour={ONBOARDING_TARGET}
              className="w-full justify-center gap-2"
            >
              <PlusIcon className="size-4" />
              {t('CubesPage.new-collection')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
