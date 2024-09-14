import { useTimerStore } from "@/store/timerStore";
import EmptySolves from "@/components/solves/EmptySolves";
import { Solve } from "@/interfaces/Solve";
import { VirtualizedGrid } from "@mierak/react-virtualized-grid";
import formatTime from "@/lib/formatTime";
import formatDate from "@/lib/formatDate";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { useDialogSolve } from "@/store/DialogSolve";
import { sort } from "fast-sort";
import { useSolveFiltersStore } from "@/store/SolvesFilters";
import { filterData, SearchType } from "filter-data";
import useRemoveGridHeight from "@/hooks/useRemoveGridHeight";
import {
  BookmarkFilledIcon,
  ChatBubbleIcon,
  CubeIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

interface SolvesArea {
  displaySolves: Solve[] | undefined;
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const { handleOpenDialogSolve } = useDialogSolve();
  const { selectedCube } = useTimerStore();
  const t = useTranslations("Index.SolvesPage");
  const { query, order, sortType } = useSolveFiltersStore();
  useRemoveGridHeight();

  if (!selectedCube) {
    return <EmptySolves message={t("alert.empty-cubes")} icon={<CubeIcon />} />;
  }

  if (!displaySolves || displaySolves.length === 0) {
    return (
      <>
        <div className="w-full flex flex-col items-center justify-center">
          <Image
            src={"/empty.png"}
            alt="empty"
            width={200}
            height={200}
            className="object-scale-down my-20"
          />
          <div>{t("empty-solves")}</div>
          <div>{t("empty-solves-description")}</div>
        </div>
      </>
    );
  }

  const filterSolves = filterData(displaySolves, [
    {
      key: "time",
      value: query,
      type: SearchType.LTE,
    },
  ]);

  let sortedSolves: Solve[] = [];

  if (sortType === "date") {
    if (order === "asc") {
      sortedSolves = sort(filterSolves).asc((u) => u.endTime);
    }
    if (order === "desc") {
      sortedSolves = sort(filterSolves).desc((u) => u.endTime);
    }
  }

  if (sortType === "time") {
    if (order === "asc") {
      sortedSolves = sort(filterSolves).asc((u) => u.time);
    }
    if (order === "desc") {
      sortedSolves = sort(filterSolves).desc((u) => u.time);
    }
  }

  return (
    <VirtualizedGrid
      itemCount={sortedSolves.length}
      rowHeight={60}
      cellWidth={120}
      gridGap={10}
      className="pb-52"
    >
      {(index) => (
        <Card
          onClick={() => {
            handleOpenDialogSolve({ solve: sortedSolves[index] });
          }}
          className={
            "relative grow flex items-center justify-center w-auto p-1 text-lg font-medium text-center transition duration-200 rounded-md cursor-pointer h-14 bg-accent/50 hover:bg-accent/80"
          }
        >
          <div className="tracking-wider">
            <span className="text-md">
              {formatTime(sortedSolves[index].time).split(".")[0]}
            </span>
            <span className="text-sm">
              .{formatTime(sortedSolves[index].time).split(".")[1]}
            </span>
          </div>
          {sortedSolves[index].plus2 ? (
            <span className="text-xs font-black text-red-600 ms-1">+2</span>
          ) : null}
          <div className="absolute z-20 text-xs top-1 left-1">
            {formatDate(sortedSolves[index].endTime).slice(0, 5)}
          </div>
          {sortedSolves[index].bookmark && (
            <div className="absolute z-20 text-xs right-1 top-1 text-yellow-500">
              <BookmarkFilledIcon />
            </div>
          )}

          {sortedSolves[index].comment && (
            <div className="absolute z-20 text-xs bottom-1 left-1">
              <ChatBubbleIcon />
            </div>
          )}
        </Card>
      )}
    </VirtualizedGrid>
  );
}
