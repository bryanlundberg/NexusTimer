'use client'

import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { SolveTab } from '@/shared/types/enums'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HistoryIcon, ShellIcon } from 'lucide-react'
import { motion } from 'motion/react'

export default function SolvesTabSwitcher() {
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const t = useTranslations('Index')
  const [tabMode, setTabMode] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const tabs = [
    { value: SolveTab.SESSION, icon: ShellIcon, label: t('SolvesPage.session') },
    { value: SolveTab.ALL, icon: HistoryIcon, label: t('SolvesPage.historial') }
  ]

  return (
    <Tabs value={tabMode} onValueChange={(value) => setTabMode(value as SolveTab)} className="w-full sm:w-auto">
      <TabsList className="relative grid w-full grid-cols-2">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={selectedCube === null}
            className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
          >
            {tabMode === tab.value && (
              <motion.span
                layoutId="solves-tab-indicator"
                className="absolute inset-0 rounded-md bg-background shadow-sm dark:border dark:border-input dark:bg-input/30"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              <tab.icon className="size-4" />
              {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
