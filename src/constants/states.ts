import { DisplaySolvesTabs } from "@/enums/DisplaySolvesTabs";
import { Order } from "@/enums/Order";
import { Sort } from "@/enums/Sort";
import { StatisticsTabs } from "@/enums/StatisticsTabs";

export const STATES = {
  SOLVES_PAGE: {
    TAB_MODE: {
      KEY: "tab-mode",
      DEFAULT_VALUE: DisplaySolvesTabs.SESSION,
    },
    QUERY: {
      KEY: "query",
      DEFAULT_VALUE: "",
    },
    SORT: {
      KEY: "sort",
      DEFAULT_VALUE: Sort.DATE,
    },
    ORDER: {
      KEY: "order",
      DEFAULT_VALUE: Order.ASC,
    },
  },
  STATISTICS_PAGE: {
    TAB_MODE: {
      KEY: "tab-stats",
      DEFAULT_VALUE: StatisticsTabs.CATEGORY,
    }
  },
  TRANSFER_SOLVES_PAGE: {
    SOURCE_COLLECTION: {
      KEY: "source-collection",
      DEFAULT_VALUE: "",
    },
    DESTINATION_COLLECTION: {
      KEY: "destination-collection",
      DEFAULT_VALUE: "",
    },
  },
}
