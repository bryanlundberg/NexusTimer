'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useDateRangeSelect from '@/features/date-range-select/model/useDateRangeSelect'
import { DateRange } from '@/shared/types/enums'

export default function DateRangeSelect() {
  const { dateRange, setDateRange, DATE_RANGE_LABELS } = useDateRangeSelect()

  return (
    <Select value={dateRange} onValueChange={setDateRange}>
      <SelectTrigger>
        <SelectValue placeholder="Filter by date" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(DateRange).map((value) => (
          <SelectItem key={value} value={value}>
            {DATE_RANGE_LABELS[value as DateRange]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
