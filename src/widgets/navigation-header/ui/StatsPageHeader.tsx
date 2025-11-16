import { SidebarTrigger } from '@/components/ui/sidebar'
import MainCubeSelector from '@/components/MainCubeSelector'
import DateRangeSelect from '@/features/date-range-select/ui/DateRangeSelect'
import Navigation from '@/features/navigation/ui/navigation'

export default function StatsPageHeader() {
  return (
    <Navigation showMenu={false}>
      <div className="flex justify-between items-center gap-2 w-full">
        <SidebarTrigger />
        <MainCubeSelector />
        <DateRangeSelect />
      </div>
    </Navigation>
  )
}
