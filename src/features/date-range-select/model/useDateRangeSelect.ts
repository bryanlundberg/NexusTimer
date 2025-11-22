import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { DateRange } from '@/shared/types/enums'

export default function useDateRangeSelect() {
  const [dateRange, setDateRange] = useQueryState(STATES.STATISTICS_PAGE.DATE_RANGE.KEY, {
    defaultValue: STATES.STATISTICS_PAGE.DATE_RANGE.DEFAULT_VALUE
  })

  // TODO: Add translations from here useTranslation hook, to extract properly
  const DATE_RANGE_LABELS: Record<DateRange, string> = {
    [DateRange.ALL_TIME]: 'All Time',
    [DateRange.TODAY]: 'Today',
    [DateRange.THIS_WEEK]: 'This Week',
    [DateRange.LAST_WEEK]: 'Last 7 days',
    [DateRange.THIS_MONTH]: 'This Month',
    [DateRange.LAST_MONTH]: 'Last 30 days',
    [DateRange.THIS_YEAR]: 'This Year',
    [DateRange.LAST_YEAR]: 'Last 365 days'
  }

  return { dateRange, setDateRange, DATE_RANGE_LABELS }
}
