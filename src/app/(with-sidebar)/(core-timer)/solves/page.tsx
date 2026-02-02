'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { useDebouncedCallback } from 'use-debounce'
import { useMemo } from 'react'
import SolvesPageHeader from '@/widgets/navigation-header/ui/SolvesPageHeader'
import SolvesGrid from '@/features/solves-grid/ui/SolvesGrid'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { useTranslations } from 'next-intl'

export default function SolvesPage() {
  const t = useTranslations('Index')
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
    return tabMode === SolveTab.SESSION ? selectedCube.solves.session : selectedCube.solves.all
  }, [selectedCube, tabMode])

  return (
    <div className={'h-dvh flex flex-col'}>
      <CoreHeader breadcrumbPath={'/solves'} breadcrumb={t('SolvesPage.title')} />
      <SolvesPageHeader handleSearch={handleSearch} />
      <SolvesGrid solves={displaySolves} />
    </div>
  )
}
