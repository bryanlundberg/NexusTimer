import { useTimerStore } from "@/store/timerStore";
import { Solve } from "@/interfaces/Solve";
import { VirtualizedGrid } from "@mierak/react-virtualized-grid";
import formatTime from "@/lib/formatTime";
import formatDate from "@/lib/formatDate";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { useDialogSolve } from "@/store/DialogSolve";
import { sort } from "fast-sort";
import { filterData, SearchType } from "filter-data";
import useRemoveGridHeight from "@/hooks/useRemoveGridHeight";
import {
  BookmarkFilledIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";
import EmptySolves from "./EmptySolves";
import { useQueryState } from "nuqs";
import { STATES } from "@/constants/states";
import { Order } from "@/enums/Order";
import { Sort } from "@/enums/Sort";


interface SolvesArea {
  displaySolves: Solve[] | undefined;
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const { handleOpenDialogSolve } = useDialogSolve();
  const selectedCube = useTimerStore((state) => state.selectedCube);
  const t = useTranslations("Index");
  const [query,] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE });
  const [orderType,] = useQueryState(STATES.SOLVES_PAGE.ORDER.KEY, { defaultValue: STATES.SOLVES_PAGE.ORDER.DEFAULT_VALUE });
  const [sortType,] = useQueryState(STATES.SOLVES_PAGE.SORT.KEY, { defaultValue: STATES.SOLVES_PAGE.SORT.DEFAULT_VALUE });
  useRemoveGridHeight();

  if (!selectedCube) return <EmptySolves title={t("SolvesPage.alert.select-cube")} description={t("SolvesPage.alert.empty-cubes")}/>;
  if (!displaySolves || displaySolves.length === 0) return <EmptySolves/>;

  const filterSolves = filterData(displaySolves, [
    {
      key: "time",
      value: query,
      type: SearchType.LTE
    }
  ]);

  let sortedSolves: Solve[] = [];

  if (sortType === Sort.DATE) {
    if (orderType === Order.ASC) sortedSolves = sort(filterSolves).asc((u) => u.endTime);
    if (orderType === Order.DESC) sortedSolves = sort(filterSolves).desc((u) => u.endTime);
  }

  if (sortType === Sort.TIME) {
    if (orderType === Order.ASC) sortedSolves = sort(filterSolves).asc((u) => u.time);
    if (orderType === Order.DESC) sortedSolves = sort(filterSolves).desc((u) => u.time);
  }

  return (
    <VirtualizedGrid
      itemCount={sortedSolves.length}
      rowHeight={60}
      cellWidth={90}
      gridGap={10}
      className="pb-52"
    >
      {(index) => (
            <Card
              onClick={() => handleOpenDialogSolve({ solve: sortedSolves[index] })}
              className={
                "relative grow flex items-center justify-center w-auto font-medium text-center transition duration-200 rounded-md cursor-pointer h-14 hover:opacity-70"
              }
            >
              <div className="pt-2 flex items-center">
                <span className="text-md">
                  {formatTime(sortedSolves[index].time).split(".")[0]}
                </span>
                <span className="text-sm">
                  .{formatTime(sortedSolves[index].time).split(".")[1]}
                </span>
                {sortedSolves[index].plus2 ? (
                  <span className="text-xs font-black text-red-600 ms-1">
                    +2
                  </span>
                ) : null}
                {sortedSolves[index].dnf ? (
                  <span className="text-xs font-black text-red-600 ms-1">
                    DNF
                  </span>
                ) : null}
              </div>
              <div className="absolute z-20 text-xs top-1 left-1">
                {formatDate(sortedSolves[index].endTime).slice(0, 5)}
              </div>
              {sortedSolves[index].bookmark && (
                <div className="absolute z-20 text-xs right-1 top-1 text-yellow-500">
                  <BookmarkFilledIcon/>
                </div>
              )}

              {sortedSolves[index].comment && (
                <div className="absolute z-20 text-xs bottom-1 left-1">
                  <ChatBubbleIcon/>
                </div>
              )}
            </Card>
      )}
    </VirtualizedGrid>
  );
}
