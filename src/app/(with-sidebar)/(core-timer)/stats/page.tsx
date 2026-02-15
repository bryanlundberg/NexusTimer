'use client'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import StatsPageHeader from '@/widgets/navigation-header/ui/StatsPageHeader'
import StatisticsSummary from '@/features/deep-statistics/ui/StatisticsSummary'
import StatisticsViewSwitcher from '@/widgets/statistics-view/ui/StatisticsViewSwitcher'
import StatisticsChart from '@/features/deep-statistics/ui/StatisticsChart'
import useDeepStatistics from '@/features/deep-statistics/model/useDeepStatistics'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { useTranslations } from 'next-intl'

export default function StatsPage() {
  const { stats, loadingProps } = useDeepStatistics()
  const t = useTranslations('Index.StatsPage')
  return (
    <div className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <CoreHeader breadcrumbPath={'/stats'} breadcrumb={t('title')} />
        <div className="px-2 flex flex-col w-full min-h-full">
          <StatsPageHeader />
          <div className="flex flex-col gap-2 grow relative">
            <StatisticsSummary statistics={stats} loadingProps={loadingProps} />
            <StatisticsViewSwitcher statistics={stats} loadingProps={loadingProps} />
            <StatisticsChart statistics={stats} loadingProps={loadingProps} />
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
