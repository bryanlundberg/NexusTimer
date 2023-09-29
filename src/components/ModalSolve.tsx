import deleteSolve from "@/lib/deleteSolve";
import findCube from "@/lib/findCube";
import formatDate from "@/lib/formatDate";
import { useSolvesStore } from "@/store/SolvesStore";
import { useTimerStore } from "@/store/timerStore";

export default function ModalSolve() {
  const { solve, setStatus } = useSolvesStore();
  const { setCubes, setSelectedCube, selectedCube } = useTimerStore();
  if (!solve) return null;
  const handleDelete = () => {
    const newCubes = deleteSolve(solve.id);
    if (selectedCube) {
      const updatedSelectedCube = findCube({ cubeId: selectedCube.id });
      if (updatedSelectedCube) {
        setSelectedCube(updatedSelectedCube);
      }
    }
    setCubes(newCubes);
    setStatus();
  };

  return (
    <>
      <div className="fixed backdrop-blur-[2px] top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex flex-col items-center">
        <div className="w-72 h-auto bg-zinc-950 border border-zinc-800 rounded-md text-xs">
          <div className="flex justify-between items-center border-b border-zinc-800 p-3">
            <div className="text-lg font-medium">{solve.time / 1000}</div>
            <div>{formatDate(solve.endTime)}</div>
          </div>
          <div className="flex justify-between items-center border-b border-zinc-800 p-3 text-md font-medium">
            <div>{solve.scramble}</div>
          </div>
          <div className="flex justify-center gap-3 items-center border-b border-zinc-800 p-3">
            <button
              type="button"
              className="border border-zinc-800 p-1 w-16 rounded-md bg-red-500"
              onClick={() => handleDelete()}
            >
              X
            </button>
            <button
              type="button"
              className="border border-zinc-800 p-1 w-16 rounded-md bg-yellow-500"
            >
              +2
            </button>
            <button
              type="button"
              className="border border-zinc-800 p-1 w-16 rounded-md bg-green-500"
              onClick={() => setStatus()}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
