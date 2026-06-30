import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { useOnboardingStore } from '@/features/onboarding-tour/model/useOnboardingStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { CUBE_CATEGORIES, CubeCategory } from '@/shared/const/cube-categories'
import { cubeColorClass } from '@/shared/const/cube-colors'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { PlusIcon, Search } from 'lucide-react'
import { Nexi } from '@/shared/ui/nexi'
import { cn } from '@/shared/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import { FilterRow } from '@/features/select-collection/ui/FilterRow'
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
  const [searchFocused, setSearchFocused] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const onChange = () => setIsDesktop(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

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
      <DialogContent className="overflow-hidden p-0 sm:max-w-lg" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden>

        <div className="flex h-[70dvh] max-h-112 min-w-0 flex-col overflow-hidden sm:h-104 sm:max-h-none sm:flex-row">
          <aside className="hidden w-44 shrink-0 flex-col border-r bg-muted/30 sm:flex">
            <div className="px-4 pb-2 pt-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {t('CubesPage.category')}
              </p>
            </div>

            <div className="flex-1 space-y-0.5 overflow-y-auto px-2">
              <FilterRow
                label={t('SolvesPage.all')}
                count={allCubes.length}
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              />
              {disciplines.map((d) => (
                <FilterRow
                  key={d.category}
                  label={d.category}
                  count={d.count}
                  colorClass={cubeColorClass(d.category)}
                  active={filter === d.category}
                  onClick={() => setFilter(d.category)}
                />
              ))}
            </div>

            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreate}
                data-tour={isDesktop ? ONBOARDING_TARGET : undefined}
                className="w-full justify-start gap-2"
              >
                <PlusIcon className="size-4" />
                {t('CubesPage.new-collection')}
              </Button>
            </div>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-2 border-b p-2">
              <div
                className={cn(
                  'flex flex-1 items-center gap-2 rounded-lg border px-3 transition-all duration-300 ease-out',
                  searchFocused
                    ? 'border-primary/40 bg-background ring-2 ring-primary/15'
                    : 'border-transparent bg-muted/40'
                )}
              >
                <Search
                  className={cn(
                    'size-4 shrink-0 transition-all duration-300',
                    searchFocused ? 'scale-110 text-primary' : 'text-muted-foreground'
                  )}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder={t('Inputs.search')}
                  className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {!isDesktop && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCreate}
                  data-tour={ONBOARDING_TARGET}
                  aria-label={t('CubesPage.new-collection')}
                  className="size-9 shrink-0"
                >
                  <PlusIcon className="size-4" />
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto p-2">
              {visibleCubes.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 py-4">
                  <Nexi state="solving" size={72} aria-label={t('Inputs.no-results')} />
                  <p className="text-sm text-muted-foreground">
                    {t('Inputs.no-results')}
                    {query.trim() && (
                      <span className="ml-1 font-medium text-foreground">&quot;{query.trim()}&quot;</span>
                    )}
                  </p>
                  <Button onClick={handleCreate} variant="secondary" size="sm">
                    <PlusIcon className="size-4" />
                    {t('CubesPage.new-collection')}
                  </Button>
                </div>
              ) : (
                visibleCubes.map((cube) => (
                  <CubeListItem
                    key={cube.id}
                    cube={cube}
                    onSelect={onSelect}
                    isSelected={selectedCube?.id === cube.id}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
