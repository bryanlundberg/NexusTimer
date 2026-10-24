import { useOverlayStore } from '@/shared/model/overlay-store/useOverlayStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useCubeActions } from '@/features/manage-cubes/model/useCubeActions'
import { PlusIcon, Search } from 'lucide-react'
import { Nexi } from '@/shared/ui/nexi'
import { useEffect, useMemo, useState } from 'react'
import { CubeListItem } from '@/features/select-collection/ui/CubeListItem'
import CubeCategoryFilter, {
  CubeCategoryFilterValue as Filter
} from '@/features/filter-cube-category/ui/CubeCategoryFilter'

export default function SelectCollection() {
  const close = useOverlayStore((state) => state.close)
  const isOpen = useOverlayStore((state) => state.isOpen)
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
            <div className="field group flex flex-1 items-center gap-2 px-3">
              <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('Inputs.search')}
                className="relative z-[1] h-9 w-full min-w-0 border-0 bg-transparent text-base outline-none placeholder:text-muted-foreground pointer-coarse:h-11 sm:text-sm"
              />
            </div>

            <CubeCategoryFilter
              value={filter}
              onChange={setFilter}
              cubes={allCubes}
              modal={false}
              open={filterOpen}
              onOpenChange={setFilterOpen}
              className="pointer-coarse:h-11"
              contentClassName="z-[60]"
            />
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
                <Button onClick={handleCreate} variant="outline" size="sm">
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
            <Button variant="outline" onClick={handleCreate} className="w-full justify-center gap-2">
              <PlusIcon className="size-4" />
              {t('CubesPage.new-collection')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
