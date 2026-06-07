import DateRangeFilter from '@/features/deep-statistics/ui/DateRangeFilter'
import ButtonMoveSolves from '@/features/navigation/ui/button-move-solves'
import SolvesTabSwitcher from '@/features/navigation/ui/SolvesTabSwitcher'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import SolvesSearchButton from '@/features/solves-grid/ui/SolvesSearchButton'

export default function SolvesPageHeader() {
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  return (
    <div className="flex flex-wrap items-center w-full gap-2 px-3 mb-2">
      <div className="flex items-center w-full order-1 md:w-auto">
        <SolvesTabSwitcher />
      </div>

      <div className="flex items-center gap-2 w-full order-2 md:order-3 md:flex-1 md:min-w-0">
        <MainCubeSelector />
        {tabMode === SolveTab.SESSION && <ButtonMoveSolves />}
        <SolvesSearchButton />
        <DateRangeFilter />
      </div>
    </div>
  )
}
