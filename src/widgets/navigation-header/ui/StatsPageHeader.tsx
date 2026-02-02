import DateRangeSelect from '@/features/date-range-select/ui/DateRangeSelect'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'

export default function StatsPageHeader() {
  return (
    <div className="flex justify-between items-center gap-2 w-full mb-2">
      <MainCubeSelector />
      <DateRangeSelect />
    </div>
  )
}
