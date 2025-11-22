import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatisticsTabs } from '@/widgets/statistics-view/model/enums'
import LineGraphStatistics from '@/features/line-chart-statistics/ui/LineGraphStatistics'
import CategoriesGraphs from '@/widgets/categories-graphs/ui/CategoriesGraphs'
import StatisticsEmpty from '@/features/deep-statistics/ui/StatisticsEmpty'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { DeepStatistics } from '@/shared/types/statistics'
import StatisticsViewContainer from '@/widgets/statistics-view/ui/StatisticsViewContainer'
import { STATES } from '@/shared/const/states'

interface StatisticsViewSwitcherProps {
  statistics: DeepStatistics
}

export default function StatisticsViewSwitcher({ statistics }: StatisticsViewSwitcherProps) {
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
    <StatisticsViewContainer>
      <Tabs value={tabStats} onValueChange={setTabStats} className="mb-3 w-full">
        <TabsList className="w-full justify-between">
          <TabsTrigger value={StatisticsTabs.CATEGORY} className={'w-full'}>
            {t('StatsPage.category-tab')}
          </TabsTrigger>
          <TabsTrigger value={StatisticsTabs.CUBE} className={'w-full'}>
            {t('StatsPage.cube-tab')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={StatisticsTabs.CATEGORY}>
          <LineGraphStatistics solves={statistics.data.global} />
          <CategoriesGraphs />
        </TabsContent>
        <TabsContent value={StatisticsTabs.CUBE}>
          <LineGraphStatistics solves={statistics.data.cubeAll} />
        </TabsContent>
      </Tabs>
    </StatisticsViewContainer>
  )
}
