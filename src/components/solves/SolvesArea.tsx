import { useTimerStore } from "@/store/timerStore";
import EmptySolves from "@/components/solves/EmptySolves";
import { Solve } from "@/interfaces/Solve";
import { VirtualizedGrid } from "@mierak/react-virtualized-grid";
import { useSolvesStore } from "@/store/SolvesStore";
import formatTime from "@/lib/formatTime";
import formatDate from "@/lib/formatDate";
import { useTranslations } from "next-intl";
import updateSolve from "@/lib/updateSolve";
import moveSolve from "@/lib/moveSolve";
import {
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
  ArchiveBoxArrowDownIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import useEscape from "@/hooks/useEscape";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useClickOutside from "@/hooks/useClickOutside";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import useSolvesPage from "@/hooks/useSolvesPage";

interface SolvesAreaProps {
  displaySolves: Solve[] | null;
}

export function SolvesArea({ displaySolves }: SolvesAreaProps) {
  const t = useTranslations("Index.SolvesPage");
  const { status, setStatus, setSolve } = useSolvesStore();
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    solve: Solve | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    solve: null,
  });
  const { selectedCube, mergeUpdateSelectedCube, cubes } = useTimerStore();
  const { currentTab } = useSolvesPage();
  const submenuRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(submenuRef, () =>
    setContextMenu({ ...contextMenu, visible: false })
  );

  useEscape(() => setStatus(false));

  useEffect(() => {
    setContextMenu({ ...contextMenu, visible: false });
  }, [status]);

  if (!selectedCube) {
    return (
      <EmptySolves message={t("no-cube-selection")} icon="no-cube-selected" />
    );
  }

  if (!displaySolves || displaySolves.length === 0) {
    return <EmptySolves message={t("no-solves")} icon="no-solves" />;
  }

  const handleMove = async (solve: Solve, currentTab: SolveTab) => {
    if (!selectedCube) return;
    const updatedCube = await moveSolve({
      solve,
      selectedCube,
      type: currentTab,
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setStatus(false);
  };

  const handleDelete = async (solve: Solve) => {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "DELETE",
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setStatus(false);
  };

  const handleCopyToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    }
    setStatus(false);
  };

  const handleContextMenu = (event: React.MouseEvent, solve: Solve) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: 120,
      y: 10,
      solve: solve,
    });
  };

  return (
    <VirtualizedGrid
      itemCount={displaySolves.length}
      rowHeight={60}
      cellWidth={150}
      className="grid w-full grid-cols-3 gap-3 px-3 py-3 overflow-y-auto sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-6 mx-auto overflow-x-hidden"
      gridGap={10}
      gridHeight={"minmax(60px, 100%)"}
    >
      {(index) => (
        <div
          key={index}
          onClick={() => {
            setSolve(displaySolves[index]);
            setStatus(true);
          }}
          onContextMenu={(event) =>
            handleContextMenu(event, displaySolves[index])
          }
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
            <div className="absolute z-20 text-xs right-1 top-1 text-yellow-500">
              <StarIcon className="w-4 h-4" />
            </div>
          )}

          {displaySolves[index].comment && (
            <div className="absolute z-20 text-xs bottom-1 left-1 light:text-neutral-500 dark:text-neutral-300">
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
            </div>
          )}
      

          {contextMenu.visible &&
            contextMenu.solve === displaySolves[index] && (
              <AnimatePresence>
                <motion.div
                  initial={{ y: 0, scale: 0.9, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ x: 0, scale: 0.9, opacity: 0 }}
                  ref={submenuRef}
                  className="absolute flex flex-col w-32 gap-3 py-2 bg-white rounded-md"
                  style={{
                    top: `${contextMenu.y - window.scrollY}px`,
                    left: `${contextMenu.x - window.scrollX}px`,
                    zIndex: 50,
                  }}
                >
                  <div
                    className="flex items-start justify-start gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
                    onClick={() =>
                      currentTab === "Session"
                        ? handleMove(contextMenu.solve!, "Session")
                        : handleMove(contextMenu.solve!, "All")
                    }
                  >
                    <div className="w-4 mr-3 h-4">
                      <ArchiveBoxArrowDownIcon className="w-6 h-6" />
                    </div>
                    <div>
                      {currentTab === "Session" ? t("archive") : t("unarchive")}
                    </div>
                  </div>
                  <div
                    className="flex items-start justify-start gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
                    onClick={() =>
                      handleCopyToClipboard(
                        `[${formatTime(contextMenu.solve!.time)}s] - ${
                          contextMenu.solve!.scramble
                        }`
                      )
                    }
                  >
                    <div className="w-4 mr-3 h-4">
                      <DocumentDuplicateIcon className="w-6 h-6" />
                    </div>
                    <div>{t("copy")}</div>
                  </div>
                  <div
                    className="flex items-start justify-start gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
                    onClick={() => handleDelete(contextMenu.solve!)}
                  >
                    <div className="w-4 mr-3 h-4">
                      <TrashIcon className="w-6 h-6" />
                    </div>
                    <div>{t("remove")}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
        </div>
      )}
    </VirtualizedGrid>
  );
}
