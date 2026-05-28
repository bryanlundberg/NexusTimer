import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatisticsTabs } from '@/widgets/statistics-view/model/enums'
import LineGraphStatistics from '@/features/line-chart-statistics/ui/LineGraphStatistics'
import StatisticsEmpty from '@/features/deep-statistics/ui/StatisticsEmpty'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { DeepStatistics } from '@/shared/types/statistics'
import StatisticsViewContainer from '@/widgets/statistics-view/ui/StatisticsViewContainer'
import { STATES } from '@/shared/const/states'
import { BarChart3Icon, BoxIcon, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'

interface StatisticsViewSwitcherProps {
  statistics: DeepStatistics
  loadingProps: Record<string, boolean>
}

export default function StatisticsViewSwitcher({ statistics, loadingProps }: StatisticsViewSwitcherProps) {
  const t = useTranslations('Index')
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const [tabStats, setTabStats] = useQueryState(STATES.STATISTICS_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.STATISTICS_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  if (!selectedCube)
    return (
      <StatisticsViewContainer>
        <StatisticsEmpty />
      </StatisticsViewContainer>
    )

  const tabs = [
    { value: StatisticsTabs.CATEGORY, icon: BarChart3Icon, label: t('StatsPage.category-tab') },
    { value: StatisticsTabs.CUBE, icon: BoxIcon, label: t('StatsPage.cube-tab') }
  ]

  return (
    <StatisticsViewContainer>
      <Tabs value={tabStats} onValueChange={setTabStats} className="mb-3 w-full">
        <TabsList className="relative grid w-full grid-cols-2 mb-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent"
            >
              {tabStats === tab.value && (
                <motion.span
                  layoutId="stats-tab-indicator"
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
        <TabsContent value={StatisticsTabs.CATEGORY} className="relative min-h-50">
          {loadingProps.data ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <LineGraphStatistics solves={statistics.data.global} />
          )}
        </TabsContent>
        <TabsContent value={StatisticsTabs.CUBE} className="relative min-h-50">
          {loadingProps.data ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            <LineGraphStatistics solves={statistics.data.cubeAll} />
          )}
        </TabsContent>
      </Tabs>
    </StatisticsViewContainer>
  )
}
