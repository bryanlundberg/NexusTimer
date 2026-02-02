'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import CubesPageHeader from '@/widgets/navigation-header/ui/CubesPageHeader'
import CubesDashboard from '@/widgets/cubes-dashboard/ui/CubesDashboard'
import CoreHeader from '@/shared/ui/core-header/ui/CoreHeader'
import { useTranslations } from 'next-intl'

export default function CubesPage() {
  const t = useTranslations('Index.CubesPage')
  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <CoreHeader breadcrumbPath={'/cubes'} breadcrumb={t('title')} />
        <div className="px-2 flex flex-col w-full min-h-full">
          <CubesPageHeader />
          <CubesDashboard />
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
