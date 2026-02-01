'use client'

import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SolvesTabSwitcher() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const [tabMode, setTabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  return (
    <Tabs value={tabMode} onValueChange={(value) => setTabMode(value as SolveTab)} className="w-full sm:w-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value={SolveTab.SESSION} disabled={selectedCube === null}>
          {t('SolvesPage.session')}
        </TabsTrigger>
        <TabsTrigger value={SolveTab.ALL} disabled={selectedCube === null}>
          {t('SolvesPage.historial')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
