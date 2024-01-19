import { useTimerStore } from "@/store/timerStore";
import EmptySolves from "@/components/solves/EmptySolves";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { Solve } from "@/interfaces/Solve";
import { VirtualizedGrid } from "@mierak/react-virtualized-grid";
import { useSolvesStore } from "@/store/SolvesStore";
import FavoriteSolid from "@/icons/FavoriteSolid";
import ChatBubble from "@/icons/ChatBubble";
import formatTime from "@/lib/formatTime";
import formatDate from "@/lib/formatDate";

interface SolvesArea {
  displaySolves: Solve[] | null;
}

export function SolvesArea({ displaySolves }: SolvesArea) {
  const { selectedCube } = useTimerStore();
  const { lang } = useSettingsModalStore();
  const { setStatus, setSolve } = useSolvesStore();

  if (!selectedCube) {
    return (
      <EmptySolves
        message={translation.solves["no-cube-selection"][lang]}
        icon="no-cube-selected"
      />
    );
  }

  if (!displaySolves || displaySolves.length === 0) {
    return (
      <EmptySolves
        message={translation.solves["no-solves"][lang]}
        icon="no-solves"
      />
    );
  }

  return (
    <VirtualizedGrid
      itemCount={displaySolves.length}
      rowHeight={60}
      cellWidth={150}
      className="px-3 mt-3 mx-auto grow"
      gridGap={10}
    >
      {(index) => (
        <div
          onClick={() => {
            setSolve(displaySolves[index]);
            setStatus(true);
          }}
          className="relative grow flex items-center justify-center w-auto p-1 text-lg font-medium text-center transition duration-200 rounded-md cursor-pointer z-1 h-14 light:bg-neutral-100 light:shadow-sm light:shadow-neutral-400 light:hover:bg-neutral-200 light:text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:shadow-sm dark:text-neutral-200"
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
            <div className="absolute z-20 text-xs right-1 top-1 text-yellow-500 w-4 h-4">
              <FavoriteSolid />
            </div>
          )}

          {displaySolves[index].comment && (
            <div className="absolute z-20 text-xs bottom-1 left-1 light:text-neutral-500 dark:text-neutral-300 w-4 h-4">
              <ChatBubble />
            </div>
          )}
        </div>
      )}
    </VirtualizedGrid>
  );
}
