import { useTimerStore } from "@/store/timerStore";
import AlertEmptySolves from "@/components/solves/AlertEmptySolves";
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
import { useSolveActions } from "@/hooks/useSolveActions";
import {
  BookmarkFilledIcon,
  BookmarkIcon,
  ChatBubbleIcon,
  CopyIcon,
  Cross1Icon,
  CubeIcon
} from "@radix-ui/react-icons";
import EmptySolves from "./EmptySolves";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQueryState } from "nuqs";
import { STATES } from "@/constants/states";
import { Order } from "@/enums/Order";
import { Sort } from "@/enums/Sort";
import { useRouter } from "next/navigation";
import { ArrowRightLeftIcon } from "lucide-react";
import { DisplaySolvesTabs } from "@/enums/DisplaySolvesTabs";

interface SolvesArea {
  displaySolves: Solve[] | undefined;
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const router = useRouter();
  const { handleOpenDialogSolve } = useDialogSolve();
  const { selectedCube } = useTimerStore();
  const t = useTranslations("Index.SolvesPage");
  const [tabMode,] = useQueryState(STATES.SOLVES_PAGE.TAB_MODE.KEY, { defaultValue: STATES.SOLVES_PAGE.TAB_MODE.DEFAULT_VALUE });
  const [query,] = useQueryState(STATES.SOLVES_PAGE.QUERY.KEY, { defaultValue: STATES.SOLVES_PAGE.QUERY.DEFAULT_VALUE });
  const [orderType,] = useQueryState(STATES.SOLVES_PAGE.ORDER.KEY, { defaultValue: STATES.SOLVES_PAGE.ORDER.DEFAULT_VALUE });
  const [sortType,] = useQueryState(STATES.SOLVES_PAGE.SORT.KEY, { defaultValue: STATES.SOLVES_PAGE.SORT.DEFAULT_VALUE });
  const { handleDeleteSolve, handlePenaltyPlus2, handleBookmarkSolve, handleClipboardSolve, handleMoveToHistory } = useSolveActions();
  useRemoveGridHeight();

  if (!selectedCube) return <EmptySolves title={"Start selecting a cube!"} description={t("alert.empty-cubes")}/>;
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Card
              className={
                "relative grow flex items-center justify-center w-auto font-medium text-center transition duration-200 rounded-md cursor-pointer h-14 bg-secondary text-secondary-foreground hover:opacity-70"
              }
            >
              <div className="tracking-wider pt-2">
                <span className="text-md">
                  {formatTime(sortedSolves[index].time).split(".")[0]}
                </span>
                <span className="text-sm">
                  .{formatTime(sortedSolves[index].time).split(".")[1]}
                </span>
              </div>
              {sortedSolves[index].plus2 ? (
                <span className="text-xs font-black text-red-600 ms-1 pt-2">
                  +2
                </span>
              ) : null}
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
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                handleOpenDialogSolve({ solve: sortedSolves[index] });
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            {tabMode === DisplaySolvesTabs.SESSION && (
              <DropdownMenuItem
                onClick={() => router.push(`/transfer-solves?source-collection=${selectedCube.id}`)}
              >
                <ArrowRightLeftIcon className="mr-2 h-4 w-4"/> Transfer Collection
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => handleBookmarkSolve(sortedSolves[index], "solves-area")}
            >
              {sortedSolves[index].bookmark ? (
                <><BookmarkFilledIcon className="mr-2 h-4 w-4"/> Remove Bookmark</>
              ) : (
                <><BookmarkIcon className="mr-2 h-4 w-4"/> Add Bookmark</>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePenaltyPlus2(sortedSolves[index], "solves-area")}
            >
              <span className="mr-2 font-bold">+2</span>
              {sortedSolves[index].plus2 ? "Remove Penalty" : "Add Penalty"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleClipboardSolve(sortedSolves[index])}
            >
              <CopyIcon className="mr-2 h-4 w-4"/> Copy to Clipboard
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleMoveToHistory(sortedSolves[index], "solves-area")}
            >
              <CubeIcon className="mr-2 h-4 w-4"/> Move to History
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem
              onClick={() => handleDeleteSolve(sortedSolves[index], "solves-area")}
              className="text-red-500"
            >
              <Cross1Icon className="mr-2 h-4 w-4"/> Delete Solve
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </VirtualizedGrid>
  );
}
