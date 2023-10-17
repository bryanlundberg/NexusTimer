import Check from "@/icons/Check";
import NoSymbol from "@/icons/NoSymbol";
import { cubeCollection } from "@/lib/cubeCollection";
import deleteSolve from "@/lib/deleteSolve";
import findCube from "@/lib/findCube";
import formatDate from "@/lib/formatDate";
import updateSolve from "@/lib/updateSolve";
import { useSolvesStore } from "@/store/SolvesStore";
import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";

export default function ModalSolve() {
  const { solve, setStatus } = useSolvesStore();
  const { setCubes, setSelectedCube, selectedCube } = useTimerStore();

  useEffect(() => {
    if (!solve) return;

    const display = document.querySelector("scramble-display");

    if (display) {
      display.remove();
    }

    const name = cubeCollection.find((item) => item.name === solve.category);

    if (name) {
      const child = document.createElement("scramble-display");
      child.setAttribute("event", name.event || "222");
      child.setAttribute("scramble", solve.scramble || "");
      document.querySelector("#scramble-display")?.appendChild(child);
    }
  }, [solve]);

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

  const handlePlusTwo = () => {
    const newCubes = updateSolve(solve.id, "+2");
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
      <div className="fixed backdrop-blur-[2px] top-0 left-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen flex flex-col items-center text-neutral-950">
        <div className="w-full h-auto text-xs border rounded-md sm:w-96 bg-neutral-200 border-neutral-800 ">
          <div className="flex items-center justify-between p-3 border-b border-zinc-800">
            <div className="flex items-center text-lg font-medium">
              {solve.time / 1000}
              <span className="text-xs text-red-500">
                {solve.plus2 ? "+2" : null}
              </span>
            </div>
            <div>{formatDate(solve.endTime)}</div>
          </div>
          <div className="flex flex-col items-center justify-between p-3 font-medium border-b border-zinc-800 text-md">
            <div>{solve.scramble}</div>
            <div className="w-full h-32 my-3" id="scramble-display"></div>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 border-b border-zinc-800">
            <button
              type="button"
              className="flex items-center justify-center w-12 h-8 p-1 bg-red-500 border rounded-md border-zinc-800 hover:bg-red-600"
              onClick={() => handleDelete()}
            >
              <NoSymbol />
            </button>
            <button
              type="button"
              className="w-12 h-8 p-1 font-medium bg-yellow-500 border rounded-md border-zinc-800 hover:bg-yellow-600"
              onClick={() => handlePlusTwo()}
            >
              +2
            </button>
            <button
              type="button"
              className="flex items-center justify-center w-12 h-8 p-1 bg-green-500 border rounded-md border-zinc-800 hover:bg-green-600"
              onClick={() => setStatus()}
            >
              <Check />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
