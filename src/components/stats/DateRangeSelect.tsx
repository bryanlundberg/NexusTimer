'use client';

import { useQueryState } from 'nuqs';
import { STATES } from '@/constants/states';
import { DateRange } from '@/enums/DateRange';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  [DateRange.ALL_TIME]: 'All Time',
  [DateRange.TODAY]: 'Today',
  [DateRange.THIS_WEEK]: 'This Week',
  [DateRange.LAST_WEEK]: 'Last 7 days',
  [DateRange.THIS_MONTH]: 'This Month',
  [DateRange.LAST_MONTH]: 'Last 30 days',
  [DateRange.THIS_YEAR]: 'This Year',
  [DateRange.LAST_YEAR]: 'Last 365 days',
};

export default function DateRangeSelect() {
  const [dateRange, setDateRange] = useQueryState(
    STATES.STATISTICS_PAGE.DATE_RANGE.KEY,
    { defaultValue: STATES.STATISTICS_PAGE.DATE_RANGE.DEFAULT_VALUE }
  );

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
  );
}
