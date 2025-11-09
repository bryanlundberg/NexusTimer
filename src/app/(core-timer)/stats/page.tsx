'use client'
import Navigation from '@/components/navigation/navigation'
import CategoryStatistics from '@/components/stats/CategoryStatistics'
import FadeIn from '@/shared/ui/fade-in/fade-in'
import { SidebarTrigger } from '@/components/ui/sidebar'
import MainCubeSelector from '@/components/MainCubeSelector'
import DateRangeSelect from '@/components/stats/DateRangeSelect'

export default function Page() {
  return (
    <div className={'max-h-dvh overflow-auto'}>
      <FadeIn>
        <div className="px-2 pt-2 flex flex-col w-full min-h-full">
          <Navigation showMenu={false}>
            <div className="flex justify-between items-center gap-2 w-full">
              <SidebarTrigger />
              <MainCubeSelector />
              <DateRangeSelect />
            </div>
          </Navigation>
          <CategoryStatistics />
        </div>
      </FadeIn>
    </div>
  )
}
