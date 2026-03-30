'use client'
import dynamic from 'next/dynamic'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import StatsPageHeader from '@/widgets/navigation-header/ui/StatsPageHeader'
import useDeepStatistics from '@/features/deep-statistics/model/useDeepStatistics'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { useTranslations } from 'next-intl'

const StatisticsViewSwitcher = dynamic(() => import('@/widgets/statistics-view/ui/StatisticsViewSwitcher'))
const StatisticsChart = dynamic(() => import('@/features/deep-statistics/ui/StatisticsChart'))

export default function StatsPage() {
  const { stats, loadingProps } = useDeepStatistics()
  const t = useTranslations('Index.StatsPage')
  return (
    <div className="max-h-dvh overflow-auto">
      <FadeIn>
        <CoreHeader breadcrumbPath={'/stats'} breadcrumb={t('title')} />
        <div className="px-3 pt-1 pb-6 flex flex-col w-full min-h-full">
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
