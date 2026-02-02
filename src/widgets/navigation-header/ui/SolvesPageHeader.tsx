import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import DateRangeFilter from '@/features/deep-statistics/ui/DateRangeFilter'
import ButtonMoveSolves from '@/features/navigation/ui/button-move-solves'
import SolvesTabSwitcher from '@/features/navigation/ui/SolvesTabSwitcher'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import * as React from 'react'

interface SolvesPageHeaderProps {
  handleSearch: (query: string) => void
}

export default function SolvesPageHeader({ handleSearch }: SolvesPageHeaderProps) {
  const t = useTranslations('Index')
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  return (
    <div className="px-2 flex flex-col w-full gap-2">
      <MainCubeSelector />
      <div className={'flex justify-center items-center gap-2 mb-2'}>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="flex gap-2 items-center flex-1">
            <SolvesTabSwitcher />
            {tabMode === SolveTab.SESSION && <ButtonMoveSolves />}
          </div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder={t('SolvesPage.filter-by-time')}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-background w-full sm:w-64"
            />
            <DateRangeFilter />
          </div>
        </div>
      </div>
    </div>
  )
}
