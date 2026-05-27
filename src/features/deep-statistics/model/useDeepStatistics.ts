import { useTimerStore } from '@/shared/model/timer/useTimerStore'
import { useEffect, useMemo, useSyncExternalStore } from 'react'
import moment from 'moment'
import { useQueryState } from 'nuqs'
import { STATES } from '@/shared/const/states'
import { DateRange } from '@/shared/types/enums'
import {
  getServerSnapshot,
  getSnapshot,
  requestDeepStats,
  subscribe
} from '@/features/deep-statistics/model/deepStatsController'

export default function useDeepStatistics() {
  const selectedCube = useTimerStore((store) => store.selectedCube)
  const cubes = useTimerStore((store) => store.cubes)
  const [dateRange] = useQueryState(STATES.STATISTICS_PAGE.DATE_RANGE.KEY, {
    defaultValue: STATES.STATISTICS_PAGE.DATE_RANGE.DEFAULT_VALUE as DateRange
  })

  const startTimestamp = useMemo(() => {
    switch (dateRange as DateRange) {
      case DateRange.TODAY:
        return moment().startOf('day').valueOf()
      case DateRange.THIS_WEEK:
        return moment().startOf('week').valueOf()
      case DateRange.LAST_WEEK:
        return moment().subtract(7, 'days').startOf('day').valueOf()
      case DateRange.THIS_MONTH:
        return moment().startOf('month').valueOf()
      case DateRange.LAST_MONTH:
        return moment().subtract(30, 'days').startOf('day').valueOf()
      case DateRange.THIS_YEAR:
        return moment().startOf('year').valueOf()
      case DateRange.LAST_YEAR:
        return moment().subtract(365, 'days').startOf('day').valueOf()
      case DateRange.ALL_TIME:
      default:
        return 0
    }
  }, [dateRange])

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    requestDeepStats(cubes || null, selectedCube || null, startTimestamp)
  }, [cubes, selectedCube, startTimestamp])

  return state
}
