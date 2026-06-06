'use client'

import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import { Tabs } from '@/components/ui/tabs'
import { HistoryIcon, ShellIcon } from 'lucide-react'
import AnimatedTabsList from '@/shared/ui/animated-tabs/AnimatedTabsList'

export default function SolvesTabSwitcher() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const [tabMode, setTabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const disabled = selectedCube === null
  const tabs = [
    { value: SolveTab.SESSION, icon: ShellIcon, label: t('SolvesPage.session'), disabled },
    { value: SolveTab.ALL, icon: HistoryIcon, label: t('SolvesPage.historial'), disabled }
  ]

  return (
    <Tabs value={tabMode} onValueChange={(value) => setTabMode(value as SolveTab)} className="w-full sm:w-auto">
      <AnimatedTabsList items={tabs} activeValue={tabMode} layoutId="solves-tab-indicator" />
    </Tabs>
  )
}
