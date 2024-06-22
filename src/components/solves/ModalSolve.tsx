import updateSolve from "@/lib/updateSolve";
import { useSolvesStore } from "@/store/SolvesStore";
import { useTimerStore } from "@/store/timerStore";
import formatTime from "@/lib/formatTime";
import { ScrambleDisplay } from "@/components/scramble-display/index";
import useEscape from "@/hooks/useEscape";
import { format } from "date-fns";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useClickOutside from "@/hooks/useClickOutside";
import { Solve } from "@/interfaces/Solve";
import { SolveTab } from "@/interfaces/types/SolveTabs";
import { useTranslations } from "next-intl";
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CubeTransparentIcon,
  EllipsisHorizontalIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import {
  StarIcon as StarIconO,
  ChatBubbleBottomCenterIcon as ChatBubbleBottomCenterIconO,
} from "@heroicons/react/24/outline";
import ContextMenu from "./ContextMenu";

export default function ModalSolve({ currentTab }: { currentTab: SolveTab }) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showScramble, setShowScramble] = useState<boolean>(false);
  const { status, solve, setStatus } = useSolvesStore();
  const { selectedCube, mergeUpdateSelectedCube, cubes } = useTimerStore();
  const t = useTranslations("Index.SolvesPage");
  const submenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShowOptions(false);
    setShowScramble(false);
  }, [status, solve]);

  useClickOutside(submenuRef, () => setShowOptions(false));

  useEscape(() => setStatus(false));

  const handlePlusTwo = async (solve: Solve) => {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "+2",
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setStatus(false);
  };

  const handleComment = async (comment: string, solve: Solve) => {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "COMMENT",
      comment: comment,
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setStatus(false);
  };

  const handleBookmark = async (solve: Solve) => {
    if (!selectedCube) return;
    const updatedCube = await updateSolve({
      selectedCube: selectedCube,
      solveId: solve.id,
      type: "BOOKMARK",
    });
    mergeUpdateSelectedCube(updatedCube, cubes);
    setStatus(false);
  };

  return (
    <>
      <AnimatePresence>
        {solve && status ? (
          <div
            className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-screen px-4 py-10 overflow-x-hidden overflow-y-auto bg-black bg-opacity-10 md:inset-0 text-neutral-950"
            onClick={(e) => {
              if (e.target === e.currentTarget) setStatus(false);
            }}
          >
            <motion.div
              initial={{ y: 0, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ x: 0, scale: 0.9, opacity: 0 }}
              className="relative w-full h-auto text-xs bg-white rounded-md sm:w-96"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200">
                <div className="flex items-center ">
                  <div className="tracking-wider">
                    <span className="text-3xl font-semibold">
                      {formatTime(solve.time).split(".")[0]}
                    </span>
                    <span className="text-2xl font-semibold">
                      .{formatTime(solve.time).split(".")[1]}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-500">
                    {solve.plus2 ? "+2" : null}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500">
                  <CalendarDaysIcon className="w-6 h-6" />
                  <div className="flex flex-col text-end">
                    <div>
                      {format(solve.endTime, "dd/MMM/yyyy").replace(/\//g, " ")}
                    </div>
                    <div className="text-start">
                      {new Date(solve.endTime).getHours()}:
                      {new Date(solve.endTime).getMinutes()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between p-3 font-medium border-b border-neutral-200 text-md">
                <div
                  className="flex items-center justify-between w-full gap-5 md:gap-5"
                  onClick={() => setShowScramble(!showScramble)}
                >
                  <div>
                    <CubeTransparentIcon className="w-4 h-4" />
                  </div>
                  <div
                    className={`${
                      solve.scramble.length > 100 ? "text-sm" : "text-base"
                    } font-normal text-justify`}
                  >
                    {solve.scramble}
                  </div>
                  <div className="transition duration-200 hover:text-neutral-500 hover:cursor-pointer">
                    {showScramble ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </div>
                {showScramble && (
                  <ScrambleDisplay
                    className="w-full h-32 my-3"
                    show={status}
                    scramble={solve.scramble}
                    event={
                      solve && selectedCube ? selectedCube.category : "3x3"
                    }
                  ></ScrambleDisplay>
                )}
                <div>{solve.comment}</div>
              </div>

              <div className="flex items-center justify-between gap-3 px-3 py-2 text-black">
                <div>
                  <div
                    className="w-5 h-5 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
                    onClick={() => {
                      setShowOptions(!showOptions);
                      setShowScramble(false);
                    }}
                  >
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div
                    className="w-5 h-5 transition duration-200 hover:text-neutral-500 text-neutral-700 hover:cursor-pointer flex justify-center items-center"
                    onClick={() => handleBookmark(solve)}
                  >
                    {solve.bookmark ? (
                      <StarIcon className="w-4 h-4" />
                    ) : (
                      <StarIconO className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className="w-5 h-5 transition duration-200 hover:text-neutral-500 text-neutral-700 hover:cursor-pointer flex justify-center items-center"
                    onClick={() => {
                      const comment = window.prompt(`${t("enter-a-comment")}`);
                      if (comment) {
                        handleComment(comment, solve);
                      }
                    }}
                  >
                    <ChatBubbleBottomCenterIconO className="w-4 h-4" />
                  </div>
                  <div
                    className="text-lg font-medium transition duration-200 hover:text-neutral-500 hover:cursor-pointer text-neutral-700"
                    onClick={async () => await handlePlusTwo(solve)}
                  >
                    +2
                  </div>
                </div>
              </div>
              {/* options menu */}
              {showOptions && (
                <ContextMenu
                  submenuRef={submenuRef}
                  currentTab={currentTab}
                  solve={solve}
                  className="max-w-32"
                />
              )}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
