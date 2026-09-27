'use client'

import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import { Tabs } from '@/components/ui/tabs'
import CubesIcon from '@/components/ui/cubes-icon'
import StackIcon from '@/components/ui/stack-icon'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'
import { cn } from '@/shared/lib/utils'

export default function SolvesTabSwitcher({
  className,
  listClassName
}: {
  className?: string
  listClassName?: string
}) {
  const t = useTranslations('Index')
  const [tabMode, setTabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const tabs = [
    { value: SolveTab.SESSION, icon: CubesIcon, label: t('SolvesPage.session') },
    { value: SolveTab.ALL, icon: StackIcon, label: t('SolvesPage.historial') }
  ]

  return (
    <Tabs value={tabMode} onValueChange={(value) => setTabMode(value as SolveTab)} className={cn('w-auto', className)}>
      <ScrollableUnderlineTabs
        items={tabs}
        activeValue={tabMode}
        layoutId="solves-tab-indicator"
        className={listClassName}
      />
    </Tabs>
  )
}
