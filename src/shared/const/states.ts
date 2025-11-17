import { Sort } from '@/enums/Sort'
import { StatisticsTabs } from '@/enums/StatisticsTabs'
import { DateRange, Order, SolveTab } from '@/shared/types/enums'
import { PeopleTabs } from '@/widgets/people/model/types'

export const STATES = {
  SOLVES_PAGE: {
    TAB_MODE: {
      KEY: 'tab-mode',
      DEFAULT_VALUE: SolveTab.SESSION
    },
    QUERY: {
      KEY: 'query',
      DEFAULT_VALUE: ''
    },
    SORT: {
      KEY: 'sort',
      DEFAULT_VALUE: Sort.DATE
    },
    ORDER: {
      KEY: 'order',
      DEFAULT_VALUE: Order.DESC
    }
  },
  STATISTICS_PAGE: {
    TAB_MODE: {
      KEY: 'tab-stats',
      DEFAULT_VALUE: StatisticsTabs.CATEGORY
    },
    DATE_RANGE: {
      KEY: 'date-range',
      DEFAULT_VALUE: DateRange.THIS_YEAR
    }
  },
  TRANSFER_SOLVES_PAGE: {
    SOURCE_COLLECTION: {
      KEY: 'source-collection',
      DEFAULT_VALUE: ''
    },
    DESTINATION_COLLECTION: {
      KEY: 'destination-collection',
      DEFAULT_VALUE: ''
    }
  },
  PEOPLE_PAGE: {
    TAB_MODE: {
      KEY: 'tab',
      DEFAULT_VALUE: PeopleTabs.OVERVIEW
    }
  }
}
