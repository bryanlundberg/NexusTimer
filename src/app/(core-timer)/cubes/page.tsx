'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import CubesPageHeader from '@/widgets/navigation-header/ui/CubesPageHeader'
import CubesDashboard from '@/widgets/cubes-dashboard/ui/CubesDashboard'

export default function CubesPage() {
  return (
    <ScrollArea className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <div className=" px-2 pt-2 flex flex-col w-full min-h-full">
          <CubesPageHeader />
          <CubesDashboard />
        </div>
      </FadeIn>
    </ScrollArea>
  )
}
