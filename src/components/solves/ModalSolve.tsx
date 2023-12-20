import deleteSolve from "@/lib/deleteSolve";
import findCube from "@/lib/findCube";
import updateSolve from "@/lib/updateSolve";
import { useSolvesStore } from "@/store/SolvesStore";
import { useTimerStore } from "@/store/timerStore";
import formatTime from "@/lib/formatTime";
import moveSolve from "@/lib/moveSolve";
import { ScrambleDisplay } from "@/components/scramble-display/index";
import { cubeCollection } from "@/lib/cubeCollection";
import CalendarDays from "@/icons/CalentarDays";
import useEscape from "@/hooks/useEscape";
import { format } from "date-fns";
import CubeTransparent from "@/icons/CubeTransparent";
import ChevronDown from "@/icons/ChevronDown";
import ChatBubble from "@/icons/ChatBubble";
import FlagModal from "@/icons/FlagModal";
import ElipsisHorizontal from "@/icons/ElipsisHorizontal";
import ArchiveBox from "@/icons/ArchiveBox";
import DocumentDuplicate from "@/icons/DocumentDuplicate";
import Trash from "@/icons/Trash";

export default function ModalSolve() {
  const { status, solve, setStatus } = useSolvesStore();
  const { setCubes, setSelectedCube, selectedCube } = useTimerStore();

  useEscape(() => setStatus(false));

  if (!solve || !status) return null;

  const cubeObj = cubeCollection.find((item) => item.name === solve?.category);

  const isAllSolve = () => {
    return selectedCube?.solves.all.find(
      (allSolve) => allSolve.id === solve.id
    );
  };

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
    const newCubes = updateSolve(solve.id, "+2");
    if (selectedCube) {
      const updatedSelectedCube = findCube({ cubeId: selectedCube.id });
      if (updatedSelectedCube) {
        setSelectedCube(updatedSelectedCube);
      }
    }
    setCubes(newCubes);
    setStatus(false);
  };

  return (
    <>
      <div
        className="fixed backdrop-blur-[2px] top-0 left-0 z-50 w-full px-8 py-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen flex flex-col items-center text-neutral-950 justify-center"
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
            <div className="flex items-center justify-center gap-5">
              <div className="w-4 h-4">
                <CubeTransparent />
              </div>
              <div className="font-medium text-md">{solve.scramble}</div>
              <div className="w-4 h-4 transition duration-200 hover:text-neutral-500 hover:cursor-pointer">
                <ChevronDown />
              </div>
            </div>

            {/* <ScrambleDisplay
              className="w-full h-32 my-3"
              show={status}
              scramble={solve.scramble}
              event={cubeObj?.event || ""}
            ></ScrambleDisplay> */}
          </div>

          <div className="flex items-center justify-between gap-3 px-3 py-2 text-black">
            <div>
              <div className="w-5 h-5 transition duration-200 hover:text-neutral-500 hover:cursor-pointer">
                <ElipsisHorizontal />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 transition duration-200 hover:text-neutral-500 hover:cursor-pointer">
                <ChatBubble />
              </div>
              <div className="w-5 h-5 transition duration-200 hover:text-neutral-500 hover:cursor-pointer">
                <FlagModal />
              </div>
            </div>
          </div>
          <Options />
        </div>
      </div>
    </>
  );
}

function Options() {
  return (
    <>
      <div className="absolute flex flex-col w-32 gap-3 py-2 mt-1 bg-white rounded-md">
        <div className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer">
          <div className="w-4 h-4">
            <ArchiveBox />
          </div>
          <div>Archive</div>
        </div>
        <div className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer">
          <div className="w-4 h-4">
            <DocumentDuplicate />
          </div>
          <div>Copy</div>
        </div>
        <div className="flex items-center gap-1 py-1 transition duration-200 ps-2 hover:text-neutral-500 hover:cursor-pointer">
          <div className="w-4 h-4">
            <Trash />
          </div>
          <div>Remove</div>
        </div>
      </div>
    </>
  );
}
