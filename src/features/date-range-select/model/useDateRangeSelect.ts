import { useQueryState } from 'nuqs'
import { useTranslations } from 'next-intl'
import { STATES } from '@/shared/const/states'
import { DateRange } from '@/shared/types/enums'

export default function useDateRangeSelect() {
  const t = useTranslations('Index.StatsPage.date-range')
  const [dateRange, setDateRange] = useQueryState(STATES.STATISTICS_PAGE.DATE_RANGE.KEY, {
    defaultValue: STATES.STATISTICS_PAGE.DATE_RANGE.DEFAULT_VALUE
  })

  const DATE_RANGE_LABELS: Record<DateRange, string> = {
    [DateRange.ALL_TIME]: t('all-time'),
    [DateRange.TODAY]: t('today'),
    [DateRange.THIS_WEEK]: t('this-week'),
    [DateRange.LAST_WEEK]: t('last-week'),
    [DateRange.THIS_MONTH]: t('this-month'),
    [DateRange.LAST_MONTH]: t('last-month'),
    [DateRange.THIS_YEAR]: t('this-year'),
    [DateRange.LAST_YEAR]: t('last-year')
  }

  return { dateRange, setDateRange, DATE_RANGE_LABELS }
}
