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
  if (!selectedCube) return null;
  return (
    <>
      <div className="flex items-center justify-center gap-3 p-3 mt-3 border-t border-zinc-800">
        <button
          type="button"
          className="flex items-center justify-center w-12 h-8 p-1 transition duration-500 border rounded-md dark:text-neutral-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-red-600 light:text-neutral-200 light:bg-zinc-800 light:border-zinc-800 light:hover:bg-red-600"
          onClick={() => {
            const updatedCubes = deleteSolve(solve.id);
            setCubes(updatedCubes);
            const currectCube = findCube({ cubeId: selectedCube.id });
            if (currectCube) setSelectedCube(currectCube);
            setSolvingTime(0);
            setLastSolve(null);
          }}
        >
          <NoSymbol />
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-12 h-8 p-1 transition duration-500 border rounded-md dark:text-neutral-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-yellow-600 light:text-neutral-200 light:bg-zinc-800 light:border-zinc-800 light:hover:bg-yellow-600"
          onClick={() => {
            const updatedCubes = updateSolve(solve.id, "+2");
            setCubes(updatedCubes);
            const currectCube = findCube({ cubeId: selectedCube.id });
            if (currectCube) setSelectedCube(currectCube);
            setSolvingTime(solvingTime + 2000);
            setLastSolve(null);
          }}
        >
          +2
        </button>
      </div>
    </>
  );
}
