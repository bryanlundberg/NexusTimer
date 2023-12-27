import ChatBubble from "@/icons/ChatBubble";
import Flag from "@/icons/Flag";
import NoSymbol from "@/icons/NoSymbol";
import { Solve } from "@/interfaces/Solve";
import deleteSolve from "@/lib/deleteSolve";
import findCube from "@/lib/findCube";
import updateSolve from "@/lib/updateSolve";
import { useTimerStore } from "@/store/timerStore";

export default function SolveOptions({ solve }: { solve: Solve }) {
  const {
    setCubes,
    setLastSolve,
    selectedCube,
    setSelectedCube,
    setSolvingTime,
    solvingTime,
  } = useTimerStore();

  function handleDeleteSolve() {
    const updatedCubes = deleteSolve(solve.id);
    setCubes(updatedCubes);
    if (!selectedCube) return;
    const currentCube = findCube({ cubeId: selectedCube.id });
    if (currentCube) setSelectedCube(currentCube);
    setSolvingTime(0);
    setLastSolve(null);
  }

  function handlePlusTwo() {
    const updatedCubes = updateSolve(solve.id, "+2");
    setCubes(updatedCubes);
    if (!selectedCube) return;
    const currentCube = findCube({ cubeId: selectedCube.id });
    if (currentCube) setSelectedCube(currentCube);
    setSolvingTime(solvingTime + 2000);
    setLastSolve(null);
  }

  const classButton =
    "flex items-center justify-center w-12 h-8 p-1 font-normal transition duration-200 bg-transparent border border-transparent rounded-md dark:text-neutral-300 light:text-neutral-500 light:hover:text-neutral-900 dark:hover:text-neutral-100";

  if (!selectedCube) return null;
  return (
    <>
      <div
        className="flex items-center justify-center gap-3 p-3 mt-3"
        id="quick-action-buttons"
      >
        <button
          type="button"
          className={classButton}
          onClick={handleDeleteSolve}
          onTouchStart={handleDeleteSolve}
        >
          <NoSymbol />
        </button>
        <button
          type="button"
          className={classButton}
          onClick={handlePlusTwo}
          onTouchStart={handlePlusTwo}
        >
          +2
        </button>

        <button
          type="button"
          className={classButton}
          onClick={handlePlusTwo}
          onTouchStart={handlePlusTwo}
        >
          <Flag />
        </button>

        <button
          type="button"
          className={classButton}
          onClick={handlePlusTwo}
          onTouchStart={handlePlusTwo}
        >
          <div className="w-4 h-4">
            <ChatBubble />
          </div>
        </button>
      </div>
    </>
  );
}
