'use client'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import StatsPageHeader from '@/widgets/navigation-header/ui/StatsPageHeader'
import StatisticsViewSwitcher from '@/widgets/statistics-view/ui/StatisticsViewSwitcher'
import StatisticsChart from '@/features/deep-statistics/ui/StatisticsChart'
import useDeepStatistics from '@/features/deep-statistics/model/useDeepStatistics'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { useTranslations } from 'next-intl'

export default function StatsPage() {
  const { stats, loadingProps } = useDeepStatistics()
  const t = useTranslations('Index.StatsPage')
  return (
    <div className="max-h-dvh overflow-auto">
      <FadeIn>
        <CoreHeader breadcrumbPath={'/stats'} breadcrumb={t('title')} />
        <div className="px-3 md:px-4 pb-6 flex flex-col w-full min-h-full">
          <StatsPageHeader />
          <div className="grid grid-cols-1 gap-4 grow">
            <StatisticsViewSwitcher statistics={stats} loadingProps={loadingProps} />
            <div className="w-full">
              <StatisticsChart statistics={stats} loadingProps={loadingProps} />
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
