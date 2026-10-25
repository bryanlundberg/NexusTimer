'use client'

import CubesPageHeader from '@/widgets/navigation-header/ui/CubesPageHeader'
import CubesDashboard from '@/widgets/cubes-dashboard/ui/CubesDashboard'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { PageBody } from '@/shared/ui/page-body/PageBody'
import { StretchScroller } from '@/shared/ui/stretch-scroller/StretchScroller'
import { useTranslations } from 'next-intl'
import CubesAside from '@/widgets/page-aside/ui/CubesAside'
import { useMinWidth } from '@/shared/model/use-min-width'

export default function CubesPage() {
  const t = useTranslations('Index.CubesPage')
  const showAside = useMinWidth(1280)
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <CoreHeader breadcrumbs={[{ label: t('title'), href: '/cubes' }]} />
      <div className="flex flex-1 min-h-0">
        <StretchScroller className="flex-1 min-w-0 min-h-0 overflow-auto scrollbar-hide">
          <PageBody variant="data" className="px-3 pb-8 flex flex-col w-full">
            <CubesPageHeader />
            <CubesDashboard />
          </PageBody>
        </StretchScroller>
        {showAside && <CubesAside />}
      </div>
    </div>
  )
}
