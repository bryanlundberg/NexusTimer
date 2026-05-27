import DateRangeSelect from '@/features/date-range-select/ui/DateRangeSelect'
import MainCubeSelector from '@/features/select-cube/ui/MainCubeSelector'

export default function StatsPageHeader() {
  return (
    <div className="flex justify-between items-center gap-3 w-full mb-4">
      <MainCubeSelector />
      <DateRangeSelect />
    </div>
  )
}
