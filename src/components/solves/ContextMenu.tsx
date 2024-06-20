import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import formatTime from "@/lib/formatTime";
import moveSolve from "@/lib/moveSolve";
import updateSolve from "@/lib/updateSolve";
import { useSolvesStore } from "@/store/SolvesStore";
import { useTimerStore } from "@/store/timerStore";
import {
  ArchiveBoxArrowDownIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React, { useRef } from "react";

interface ContextMenuProps {
  currentTab: SolveTab;
  submenuRef: React.RefObject<HTMLDivElement>;
  solve: Solve | null;
}

export default function ContextMenu({
  currentTab,
  submenuRef,
  solve,
}: ContextMenuProps) {
  const t = useTranslations("Index.SolvesPage");
  const { setStatus } = useSolvesStore();
  const { selectedCube, mergeUpdateSelectedCube, cubes } = useTimerStore();

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

  return (
    <>
      <AnimatePresence>
        {solve && (
          <motion.div
            initial={{ y: 0, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ x: 0, scale: 0.9, opacity: 0 }}
            ref={submenuRef}
            className="absolute flex flex-col w-32 gap-3 py-2 mt-1 bg-white rounded-md"
          >
            <div
              className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
              onClick={() =>
                currentTab === "Session"
                  ? handleMove(solve, "Session")
                  : handleMove(solve, "All")
              }
            >
              <div className="w-4 h-4">
                <ArchiveBoxArrowDownIcon className="w-4 h-4 fill-none stroke-black" />
              </div>
              <div>
                {currentTab === "Session" ? t("archive") : t("unarchive")}
              </div>
            </div>
            <div
              className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
              onClick={() =>
                handleCopyToClipboard(
                  `[${formatTime(solve.time)}s] - ${solve.scramble}`
                )
              }
            >
              <div className="w-4 h-4">
                <DocumentDuplicateIcon className="w-4 h-4 fill-none stroke-black" />
              </div>
              <div>{t("copy")}</div>
            </div>
            <div
              className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
              onClick={() => handleDelete(solve)}
            >
              <div className="w-4 h-4">
                <TrashIcon className="w-4 h-4 fill-none stroke-black" />
              </div>
              <div>{t("remove")}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
