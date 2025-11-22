'use client'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import StatsPageHeader from '@/widgets/navigation-header/ui/StatsPageHeader'
import ProcessingOverlay from '@/features/deep-statistics/ui/ProcessingOverlay'
import StatisticsSummary from '@/features/deep-statistics/ui/StatisticsSummary'
import StatisticsViewSwitcher from '@/widgets/statistics-view/ui/StatisticsViewSwitcher'
import StatisticsChart from '@/features/deep-statistics/ui/StatisticsChart'
import useDeepStatistics from '@/features/deep-statistics/model/useDeepStatistics'

export default function StatsPage() {
  const { stats, isLoading } = useDeepStatistics()
  return (
    <div className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <div className="px-2 pt-2 flex flex-col w-full min-h-full">
          <StatsPageHeader />
          <div className="flex flex-col gap-3 grow relative">
            <ProcessingOverlay isProcessing={isLoading} />
            <StatisticsSummary statistics={stats} />
            <StatisticsViewSwitcher statistics={stats} />
            <StatisticsChart statistics={stats} />
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
