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
          className="flex items-center justify-center w-12 h-8 p-1 bg-red-500 border rounded-md border-zinc-800 hover:bg-red-600"
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
          className="w-12 h-8 p-1 font-medium bg-yellow-500 border rounded-md border-zinc-800 hover:bg-yellow-600"
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
