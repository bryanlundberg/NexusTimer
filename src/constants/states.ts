import { DisplaySolvesTabs } from "@/enums/DisplaySolvesTabs";
import { Order } from "@/enums/Order";
import { Sort } from "@/enums/Sort";

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
  // STATISTICS_PAGE: {
  //   TAB_MODE: {
  //     key: "tab-mode"
  //     defaultValue: DisplaySolvesTabs.,
  //   }
  // }
}
