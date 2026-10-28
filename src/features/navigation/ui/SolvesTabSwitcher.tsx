'use client'

import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import SessionIcon from '@/components/ui/session-icon'
import HistoryIcon from '@/components/ui/history-icon'
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
        { value: SolveTab.SESSION, icon: <SessionIcon size={16} />, label: t('SolvesPage.session') },
        { value: SolveTab.ALL, icon: <HistoryIcon size={16} />, label: t('SolvesPage.historial') }
      ]}
    />
  )
}
