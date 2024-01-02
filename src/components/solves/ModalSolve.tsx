import deleteSolve from "@/lib/deleteSolve";
import findCube from "@/lib/findCube";
import updateSolve from "@/lib/updateSolve";
import { useSolvesStore } from "@/store/SolvesStore";
import { useTimerStore } from "@/store/timerStore";
import formatTime from "@/lib/formatTime";
import moveSolve from "@/lib/moveSolve";
import { ScrambleDisplay } from "@/components/scramble-display/index";
import { cubeCollection } from "@/lib/const/cubeCollection";
import CalendarDays from "@/icons/CalentarDays";
import useEscape from "@/hooks/useEscape";
import { format } from "date-fns";
import CubeTransparent from "@/icons/CubeTransparent";
import ChevronDown from "@/icons/ChevronDown";
import ChatBubble from "@/icons/ChatBubble";
import ElipsisHorizontal from "@/icons/ElipsisHorizontal";
import ArchiveBox from "@/icons/ArchiveBox";
import DocumentDuplicate from "@/icons/DocumentDuplicate";
import Trash from "@/icons/Trash";
import { useEffect, useState } from "react";
import ChevronUp from "@/icons/ChevronUp";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";

export default function ModalSolve() {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showScramble, setShowScramble] = useState<boolean>(false);
  const { status, solve, setStatus } = useSolvesStore();
  const { setCubes, setSelectedCube, selectedCube } = useTimerStore();
  const { lang } = useSettingsModalStore();

  useEffect(() => {
    setShowOptions(false);
    setShowScramble(false);
  }, [status, solve]);

  useEscape(() => setStatus(false));

  if (!solve || !status) return null;

  const cubeObj = cubeCollection.find((item) => item.name === solve?.category);

  // const isAllSolve = () => {
  //   return selectedCube?.solves.all.find(
  //     (allSolve) => allSolve.id === solve.id
  //   );
  // };

  const handleMove = () => {
    if (selectedCube) {
      const newCubes = moveSolve(solve, selectedCube);
      const updatedCube = findCube({ cubeId: selectedCube.id });
      if (updatedCube) {
        setSelectedCube(updatedCube);
      }
      setCubes(newCubes);
    }
    setStatus(false);
  };

  const handleDelete = () => {
    const newCubes = deleteSolve(solve.id);
    if (selectedCube) {
      const updatedSelectedCube = findCube({ cubeId: selectedCube.id });
      if (updatedSelectedCube) {
        setSelectedCube(updatedSelectedCube);
      }
    }
    setCubes(newCubes);
    setStatus(false);
  };

  const handlePlusTwo = () => {
    const newCubes = updateSolve({ solveId: solve.id, type: "+2" });
    if (selectedCube) {
      const updatedSelectedCube = findCube({ cubeId: selectedCube.id });
      if (updatedSelectedCube) {
        setSelectedCube(updatedSelectedCube);
      }
    }
    setCubes(newCubes);
    setStatus(false);
  };

  const handleComment = (comment: string) => {
    const newCubes = updateSolve({
      solveId: solve.id,
      type: "COMMENT",
      comment: comment,
    });
    if (selectedCube) {
      const updatedSelectedCube = findCube({ cubeId: selectedCube.id });
      if (updatedSelectedCube) {
        setSelectedCube(updatedSelectedCube);
      }
    }
    setCubes(newCubes);
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
      <div
        className="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-screen px-8 py-4 overflow-x-hidden overflow-y-auto bg-black bg-opacity-75 md:inset-0 text-neutral-950"
        onClick={(e) => {
          if (e.target === e.currentTarget) setStatus(false);
        }}
      >
        <div className="relative w-full h-auto text-xs bg-white rounded-md sm:w-96">
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
              <CalendarDays />
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
                <CubeTransparent />
              </div>
              <div className="text-base font-normal text-justify">
                {solve.scramble}
              </div>
              <div className="transition duration-200 hover:text-neutral-500 hover:cursor-pointer">
                {showScramble ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
            {showScramble && (
              <ScrambleDisplay
                className="w-full h-32 my-3"
                show={status}
                scramble={solve.scramble}
                event={cubeObj?.event || ""}
              ></ScrambleDisplay>
            )}
            <div>{solve.comment}</div>
          </div>

          <div className="flex items-center justify-between gap-3 px-3 py-2 text-black">
            <div>
              <div
                className="w-5 h-5 transition duration-200 hover:text-neutral-500 hover:cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              >
                <ElipsisHorizontal />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-5 h-5 transition duration-200 hover:text-neutral-500 text-neutral-700 hover:cursor-pointer"
                onClick={() => {
                  const comment = window.prompt(
                    `${translation.solves["enter-a-comment"][lang]}`
                  );
                  if (comment) {
                    handleComment(comment);
                  }
                }}
              >
                <ChatBubble />
              </div>
              <div
                className="text-lg font-medium transition duration-200 hover:text-neutral-500 hover:cursor-pointer text-neutral-700"
                onClick={handlePlusTwo}
              >
                +2
              </div>
            </div>
          </div>
          {/* options menu */}
          {showOptions && (
            <div className="absolute flex flex-col w-32 gap-3 py-2 mt-1 bg-white rounded-md">
              <div
                className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
                onClick={handleMove}
              >
                <div className="w-4 h-4">
                  <ArchiveBox />
                </div>
                <div>{translation.solves["archive"][lang]}</div>
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
                  <DocumentDuplicate />
                </div>
                <div>{translation.solves["copy"][lang]}</div>
              </div>
              <div
                className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer"
                onClick={handleDelete}
              >
                <div className="w-4 h-4">
                  <Trash />
                </div>
                <div>{translation.solves["remove"][lang]}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
