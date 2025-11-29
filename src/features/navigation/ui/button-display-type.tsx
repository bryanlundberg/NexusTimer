import { Toggle } from '@/components/ui/toggle'
import { DashboardIcon } from '@radix-ui/react-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'

export default function ButtonDisplayType() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const [tabMode, setTabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* This <div> explained: https://github.com/shadcn-ui/ui/issues/1988#issuecomment-1980597269 */}
            <div>
              <Toggle
                data-testid="button-display-type"
                defaultPressed={tabMode === SolveTab.ALL}
                disabled={selectedCube === null}
                onPressedChange={(e) => setTabMode(e ? SolveTab.ALL : SolveTab.SESSION)}
              >
                <DashboardIcon />
              </Toggle>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {t('SolvesPage.show')}:{' '}
              {tabMode === SolveTab.SESSION ? t('SolvesPage.historial') : t('SolvesPage.session')}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
