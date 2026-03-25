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
import { motion } from 'framer-motion'

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <StatisticsViewContainer>
        <Tabs value={tabStats} onValueChange={setTabStats} className="mb-3 w-full">
          <TabsList className="w-full justify-between mb-1">
            <TabsTrigger value={StatisticsTabs.CATEGORY} className="w-full gap-2">
              <BarChart3Icon className="size-4" />
              {t('StatsPage.category-tab')}
            </TabsTrigger>
            <TabsTrigger value={StatisticsTabs.CUBE} className="w-full gap-2">
              <BoxIcon className="size-4" />
              {t('StatsPage.cube-tab')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={StatisticsTabs.CATEGORY} className="relative min-h-[200px]">
            {loadingProps.data ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : (
              <LineGraphStatistics solves={statistics.data.global} />
            )}
          </TabsContent>
          <TabsContent value={StatisticsTabs.CUBE} className="relative min-h-[200px]">
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
    </motion.div>
  )
}
