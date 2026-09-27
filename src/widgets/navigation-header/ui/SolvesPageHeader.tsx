import ButtonMoveSolves from '@/features/navigation/ui/button-move-solves'
import SolvesTabSwitcher from '@/features/navigation/ui/SolvesTabSwitcher'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'
import SolvesViewOptionsButton from '@/features/solves-grid/ui/SolvesViewOptionsButton'

export default function SolvesPageHeader() {
  const [tabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const isSession = tabMode === SolveTab.SESSION

  return (
    <div className="@container mb-2 w-full px-3">
      <div className="flex flex-col gap-2 @2xl:flex-row @2xl:items-center">
        <div className="flex items-center gap-2 @2xl:contents">
          <div className="flex min-w-0 flex-1 items-center @2xl:order-1 @2xl:flex-none">
            <SolvesTabSwitcher
              className="w-full @2xl:w-auto"
              listClassName="[&_[data-slot=tabs-trigger]]:grow @2xl:[&_[data-slot=tabs-trigger]]:grow-0"
            />
          </div>
          {isSession && (
            <div className="flex shrink-0 items-center @2xl:order-3">
              <ButtonMoveSolves />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 @2xl:contents">
          <div className="flex min-w-0 flex-1 items-center @2xl:order-2">
            <MainCubeSelector />
          </div>
          <div className="flex shrink-0 items-center @2xl:order-4">
            <SolvesViewOptionsButton />
          </div>
        </div>
      </div>
    </div>
  )
}
