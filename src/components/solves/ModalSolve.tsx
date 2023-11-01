import Check from "@/icons/Check";
import NoSymbol from "@/icons/NoSymbol";
import deleteSolve from "@/lib/deleteSolve";
import findCube from "@/lib/findCube";
import formatDate from "@/lib/formatDate";
import updateSolve from "@/lib/updateSolve";
import { useSolvesStore } from "@/store/SolvesStore";
import { useTimerStore } from "@/store/timerStore";
import formatTime from "@/lib/formatTime";
import moveSolve from "@/lib/moveSolve";
import { ScrambleDisplay } from "../scramble-display";
import { cubeCollection } from "@/lib/cubeCollection";

export default function ModalSolve() {
  const { status, solve, setStatus } = useSolvesStore();
  const { setCubes, setSelectedCube, selectedCube } = useTimerStore();

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
        className="fixed backdrop-blur-[2px] top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen flex flex-col items-center text-neutral-950"
        onClick={(e) => {
          if (e.target === e.currentTarget) setStatus(false);
        }}
      >
        <div className="w-full h-auto text-xs border rounded-md sm:w-96 bg-neutral-200 border-neutral-800 ">
          <div className="flex items-center justify-between p-3 border-b border-zinc-800">
            <div className="flex items-center text-lg font-medium">
              {formatTime(solve.time)}
              <span className="text-xs text-red-500">
                {solve.plus2 ? "+2" : null}
              </span>
            </div>
            <div>{formatDate(solve.endTime)}</div>
          </div>
          <div className="flex flex-col items-center justify-between p-3 font-medium border-b border-zinc-800 text-md">
            <div>{solve.scramble}</div>
            <ScrambleDisplay
              className="w-full h-32 my-3"
              show={status}
              scramble={solve.scramble}
              event={cubeObj?.event || ""}
            ></ScrambleDisplay>
          </div>

          <div className="relative flex items-center justify-center gap-3 p-3 border-b light border-zinc-800">
            {!isAllSolve() && (
              <button
                type="button"
                className="absolute flex items-center justify-center w-12 h-8 p-1 transition duration-500 border rounded-md left-3 top-3 hover:text-neutral-800 bg-neutral-300 hover:border-zinc-400 border-zinc-600"
                onClick={() => handleMove()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="flex items-center justify-center w-12 h-8 p-1 transition duration-500 bg-red-500 border rounded-md hover:text-neutral-800 hover:border-zinc-400 border-zinc-600"
              onClick={() => handleDelete()}
            >
              <NoSymbol />
            </button>
            <button
              type="button"
              className="w-12 h-8 p-1 font-medium transition duration-500 bg-yellow-500 border rounded-md hover:text-neutral-800 hover:border-zinc-400 border-zinc-600"
              onClick={() => handlePlusTwo()}
            >
              +2
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-12 h-8 p-1 transition duration-500 bg-green-500 border rounded-md hover:border-zinc-400 border-zinc-600 hover:text-neutral-800"
              onClick={() => setStatus(false)}
            >
              <Check />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
