import NoSymbol from "@/icons/NoSymbol";
import { Solve } from "@/interfaces/Solve";
import deleteSolve from "@/lib/deleteSolve";
import findCube from "@/lib/findCube";
import updateSolve from "@/lib/updateSolve";
import { useTimerStore } from "@/store/timerStore";

export default function SolveOptions({ solve }: { solve: Solve }) {
  const { setCubes, setLastSolve, selectedCube, setSelectedCube } =
    useTimerStore();
  if (!selectedCube) return null;
  return (
    <>
      <div className="flex justify-center gap-3 items-center border-t mt-3 border-zinc-800 p-3">
        <button
          type="button"
          className="border border-zinc-800 p-1 w-12 h-8 rounded-md bg-red-500 hover:bg-red-600 flex justify-center items-center"
          onClick={() => {
            const updatedCubes = deleteSolve(solve.id);
            setCubes(updatedCubes);
            const currectCube = findCube({ cubeId: selectedCube.id });
            if (currectCube) setSelectedCube(currectCube);
            setLastSolve(null);
          }}
        >
          <NoSymbol />
        </button>
        <button
          type="button"
          className="border border-zinc-800 p-1 w-12 h-8 rounded-md bg-yellow-500 hover:bg-yellow-600 font-medium"
          onClick={() => {
            const updatedCubes = updateSolve(solve.id, "+2");
            setCubes(updatedCubes);
            const currectCube = findCube({ cubeId: selectedCube.id });
            if (currectCube) setSelectedCube(currectCube);
            setLastSolve(null);
          }}
        >
          +2
        </button>
      </div>
    </>
  );
}
