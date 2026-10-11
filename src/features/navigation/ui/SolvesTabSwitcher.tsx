'use client'

import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import CubesIcon from '@/components/ui/cubes-icon'
import StackIcon from '@/components/ui/stack-icon'
import Segmented from '@/shared/ui/segmented/Segmented'

export default function SolvesTabSwitcher({ className }: { className?: string }) {
  const t = useTranslations('Index')
  const [tabMode, setTabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  return (
    <Segmented
      value={tabMode as SolveTab}
      onChange={(value) => setTabMode(value)}
      layoutId="solves-tab-indicator"
      aria-label={t('SolvesPage.title')}
      className={className}
      options={[
        { value: SolveTab.SESSION, icon: <CubesIcon size={16} />, label: t('SolvesPage.session') },
        { value: SolveTab.ALL, icon: <StackIcon size={16} />, label: t('SolvesPage.historial') }
      ]}
    />
  )
}
