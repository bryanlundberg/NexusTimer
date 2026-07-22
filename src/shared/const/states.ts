import { StatisticsTabs } from '@/widgets/statistics-view/model/enums'
import { Order, SolveTab, Sort } from '@/shared/types/enums'
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
    },
    FILTER: {
      KEY: 'filter',
      DEFAULT_VALUE: ''
    }
  },
  STATISTICS_PAGE: {
    TAB_MODE: {
      KEY: 'tab-stats',
      DEFAULT_VALUE: StatisticsTabs.CATEGORY
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
