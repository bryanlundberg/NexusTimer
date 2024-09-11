import { useTimerStore } from "@/store/timerStore";
import EmptySolves from "@/components/solves/EmptySolves";
import { Solve } from "@/interfaces/Solve";
import { VirtualizedGrid } from "@mierak/react-virtualized-grid";
import formatTime from "@/lib/formatTime";
import formatDate from "@/lib/formatDate";
import { useTranslations } from "next-intl";
import { CubeIcon, CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { Card } from "../ui/card";
import { useDialogSolve } from "@/store/DialogSolve";

interface SolvesArea {
  displaySolves: Solve[] | null;
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const { handleOpenDialogSolve } = useDialogSolve();
  const { selectedCube } = useTimerStore();
  const t = useTranslations("Index.SolvesPage");

  if (!selectedCube) {
    return (
      <EmptySolves
        message={t("no-cube-selection")}
        icon={<CubeIcon className="w-6 h-6" />}
      />
    );
  }

  if (!displaySolves || displaySolves.length === 0) {
    return (
      <EmptySolves
        message={t("no-solves")}
        icon={<CursorArrowRaysIcon className="w-6 h-6" />}
      />
    );
  }

  return (
    <VirtualizedGrid
      itemCount={displaySolves.length}
      rowHeight={60}
      cellWidth={150}
      className="p-3 pb-[70dvh] overflow-x-hidden z-0"
      gridGap={10}
    >
      {(index) => (
        <Card
          onClick={() => {
            handleOpenDialogSolve({ solve: displaySolves[index] });
          }}
          className={
            "relative grow flex items-center justify-center w-auto p-1 text-lg font-medium text-center transition duration-200 rounded-md cursor-pointer h-14 bg-accent/50 hover:bg-accent/80"
          }
        >
          <div className="tracking-wider">
            <span className="text-md">
              {formatTime(displaySolves[index].time).split(".")[0]}
            </span>
            <span className="text-sm">
              .{formatTime(displaySolves[index].time).split(".")[1]}
            </span>
          </div>
          {displaySolves[index].plus2 ? (
            <span className="text-sm text-red-600">+2</span>
          ) : null}
          <div className="absolute z-20 text-xs top-1 left-1">
            {formatDate(displaySolves[index].endTime).slice(0, 5)}
          </div>
          {displaySolves[index].bookmark && (
            <div className="absolute z-20 text-xs right-1 top-1 text-yellow-500">
              <StarIcon className="w-4 h-4" />
            </div>
          )}

          {displaySolves[index].comment && (
            <div className="absolute z-20 text-xs bottom-1 left-1">
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
            </div>
          )}
        </Card>
      )}
    </VirtualizedGrid>
  );
}
