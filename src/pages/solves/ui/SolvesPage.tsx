'use client'
import { useTimerStore } from '@/store/timerStore'
import { useQueryState } from 'nuqs'
import { STATES } from '@/constants/states'
import { useDebouncedCallback } from 'use-debounce'
import { useMemo } from 'react'
import { DisplaySolvesTabs } from '@/enums/DisplaySolvesTabs'
import SolvesPageHeader from '@/widgets/navigation-header/ui/SolvesPageHeader'
import SolvesGrid from '@/features/solves-grid/ui/SolvesGrid'

export default function SolvesPage() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })
  const [, setQuery] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, {
    defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE
  })

  const handleSearch = useDebouncedCallback((value) => setQuery(value), 1000)

  const displaySolves = useMemo(() => {
    if (!selectedCube) return []
    return tabMode === DisplaySolvesTabs.SESSION ? selectedCube.solves.session : selectedCube.solves.all
  }, [selectedCube, tabMode])

  return (
    <div className={'h-dvh flex flex-col'}>
      <SolvesPageHeader handleSearch={handleSearch} />
      <SolvesGrid solves={displaySolves} />
    </div>
  )
}
