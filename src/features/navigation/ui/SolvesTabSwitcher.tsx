'use client'

import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import { Tabs } from '@/components/ui/tabs'
import { HistoryIcon, ShellIcon } from 'lucide-react'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'

export default function SolvesTabSwitcher() {
  const t = useTranslations('Index')
  const [tabMode, setTabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const tabs = [
    { value: SolveTab.SESSION, icon: ShellIcon, label: t('SolvesPage.session') },
    { value: SolveTab.ALL, icon: HistoryIcon, label: t('SolvesPage.historial') }
  ]

  return (
    <Tabs value={tabMode} onValueChange={(value) => setTabMode(value as SolveTab)} className="w-auto">
      <ScrollableUnderlineTabs items={tabs} activeValue={tabMode} layoutId="solves-tab-indicator" />
    </Tabs>
  )
}
