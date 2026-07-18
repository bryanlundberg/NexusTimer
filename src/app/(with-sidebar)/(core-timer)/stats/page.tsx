'use client'
import StatsPageHeader from '@/widgets/navigation-header/ui/StatsPageHeader'
import useDeepStatistics from '@/features/deep-statistics/model/useDeepStatistics'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { useTranslations } from 'next-intl'
import StatisticsViewSwitcher from '@/widgets/statistics-view/ui/StatisticsViewSwitcher'

export default function StatsPage() {
  const { stats, loadingProps } = useDeepStatistics()
  const t = useTranslations('Index.StatsPage')
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/stats' }]} />
      <PageBody variant="data" className="px-3 pb-6 flex flex-col w-full min-h-full">
        <StatsPageHeader />
        <div className="grid grid-cols-1 gap-4 grow">
          <StatisticsViewSwitcher statistics={stats} loadingProps={loadingProps} />
        </div>
      </PageBody>
    </div>
  )
}
