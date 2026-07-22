import ButtonMoveSolves from '@/features/navigation/ui/button-move-solves'
import SolvesTabSwitcher from '@/features/navigation/ui/SolvesTabSwitcher'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import SolvesFilterButton from '@/features/solves-grid/ui/SolvesFilterButton'

export default function SolvesPageHeader() {
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const isSession = tabMode === SolveTab.SESSION

  return (
    <div className="flex flex-wrap items-center w-full gap-2 px-3 mb-2">
      <div className="flex items-center order-1 shrink-0 min-w-0">
        <SolvesTabSwitcher />
      </div>

      <div className="flex items-center gap-2 order-2 ml-auto md:order-3 md:ml-0">
        {isSession && <ButtonMoveSolves />}
        <SolvesFilterButton />
      </div>

      <div className="flex items-center min-w-0 w-full order-3 md:order-2 md:w-auto md:flex-1">
        <MainCubeSelector />
      </div>
    </div>
  )
}
