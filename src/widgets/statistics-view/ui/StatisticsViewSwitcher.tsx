import { Tabs } from '@/components/ui/tabs'
import { StatisticsTabs } from '@/widgets/statistics-view/model/enums'
import LineGraphStatistics from '@/features/line-chart-statistics/ui/LineGraphStatistics'
import StatisticsChart from '@/features/deep-statistics/ui/StatisticsChart'
import StatisticsMessage from '@/features/deep-statistics/ui/StatisticsMessage'
import SmartCubeView from '@/features/smart-cube-stats/ui/SmartCubeView'
import { useTranslations } from 'next-intl'
import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useQueryState } from 'nuqs'
import { DeepStatistics } from '@/shared/types/statistics'
import StatisticsViewContainer from '@/widgets/statistics-view/ui/StatisticsViewContainer'
import { STATES } from '@/shared/const/states'
import { BarChart3Icon, BluetoothIcon, BoxIcon, Loader2 } from 'lucide-react'
import ScrollableUnderlineTabs from '@/shared/ui/animated-tabs/ScrollableUnderlineTabs'

interface StatisticsViewSwitcherProps {
  statistics: DeepStatistics
  loadingProps: Record<string, boolean>
}

// Categories that support smart-cube move analytics.
const SMART_CATEGORIES = ['3x3', '3x3 OH']

export default function StatisticsViewSwitcher({ statistics, loadingProps }: StatisticsViewSwitcherProps) {
  const t = useTranslations('Index')
  const selectedCube = useTimerStore((state) => state.selectedCube)
  const [tabStats, setTabStats] = useQueryState(STATES.STATISTICS_PAGE.TAB_MODE.KEY, {
    defaultValue: STATES.STATISTICS_PAGE.TAB_MODE.DEFAULT_VALUE
  })

  const isSmartCategory = SMART_CATEGORIES.includes(selectedCube?.category ?? '')

  const tabs = [
    { value: StatisticsTabs.CATEGORY, icon: BarChart3Icon, label: t('StatsPage.category-tab') },
    { value: StatisticsTabs.CUBE, icon: BoxIcon, label: t('StatsPage.cube-tab') },
    { value: StatisticsTabs.SMART, icon: BluetoothIcon, label: t('StatsPage.smart-tab'), disabled: !isSmartCategory }
  ]

  const isCube = tabStats === StatisticsTabs.CUBE
  const isSmart = tabStats === StatisticsTabs.SMART
  const activeGroup = isCube ? 'cube' : 'personal'
  const activeSolves = isCube ? statistics.data.cubeAll : statistics.data.global
  // Cube selected but the active dataset has no solves (only once loading is done).
  const hasNoSolves = !loadingProps.data && activeSolves.length === 0

  const cubeSolves = selectedCube
    ? [...(selectedCube.solves?.all ?? []), ...(selectedCube.solves?.session ?? [])]
    : undefined

  return (
    <StatisticsViewContainer>
      <Tabs value={tabStats} onValueChange={setTabStats} className="w-full grow">
        <ScrollableUnderlineTabs items={tabs} activeValue={tabStats} layoutId="stats-tab-indicator" className="mb-3" />

        {!selectedCube && (
          <StatisticsMessage
            title={t('StatsPage.empty-statistics')}
            description={t('StatsPage.empty-statistics-select-cube')}
          />
        )}

        {selectedCube && isSmart && isSmartCategory && <SmartCubeView solves={cubeSolves} />}
        {selectedCube && isSmart && !isSmartCategory && (
          <StatisticsMessage title={t('StatsPage.smart-tab')} description={t('StatsPage.smart-only-3x3')} />
        )}

        {selectedCube && !isSmart && hasNoSolves && (
          <StatisticsMessage
            title={t('StatsPage.empty-solves')}
            description={t('StatsPage.empty-solves-description')}
          />
        )}

        {selectedCube && !isSmart && !hasNoSolves && (
          <>
            <div className="relative min-h-50">
              {loadingProps.data ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : (
                <LineGraphStatistics solves={activeSolves} />
              )}
            </div>
            <StatisticsChart statistics={statistics} loadingProps={loadingProps} activeGroup={activeGroup} />
          </>
        )}
      </Tabs>
    </StatisticsViewContainer>
  )
}
