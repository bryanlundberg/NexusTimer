'use client'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { useMemo } from 'react'
import SolvesPageHeader from '@/widgets/navigation-header/ui/SolvesPageHeader'
import SolvesGrid from '@/features/solves-grid/ui/SolvesGrid'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { useTranslations } from 'next-intl'

export default function SolvesPage() {
  const t = useTranslations('Index')
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const displaySolves = useMemo(() => {
    if (!selectedCube) return []
    return tabMode === SolveTab.SESSION ? selectedCube.solves.session : selectedCube.solves.all
  }, [selectedCube, tabMode])

  return (
    <div className={'flex-1 min-h-0 flex flex-col'}>
      <CoreHeader breadcrumbs={[{ label: t('SolvesPage.title'), href: '/solves' }]} />
      <PageBody variant="data">
        <SolvesPageHeader />
      </PageBody>
      <SolvesGrid solves={displaySolves} />
    </div>
  )
}
