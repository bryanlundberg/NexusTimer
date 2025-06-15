import { useTimerStore } from "@/store/timerStore";
import { getAllCubes, getCubeById, saveCube } from "@/db/dbOperations";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";

export default function useSolveData() {
  const {
    solvingTime,
    selectedCube,
    scramble,
    setCubes,
    setSelectedCube,
    setLastSolve,
    setNewScramble,
    cubes,
  } = useTimerStore();

  const saveSolveMainTimer = async () => {
    if (selectedCube && scramble) {
      const lastSolve: Solve = {
        id: genId(),
        startTime: Date.now() - solvingTime,
        endTime: Date.now(),
        scramble: scramble,
        bookmark: false,
        time: solvingTime,
        dnf: false,
        plus2: false,
        rating: Math.floor(Math.random() * 20) + scramble.length,
        cubeId: selectedCube.id,
        comment: "",
      };

      setLastSolve({ ...lastSolve });

      const cube = cubes?.find((u) => u.id === selectedCube.id);

      if (cube) {
        await saveCube({
          ...cube,
          solves: {
            ...cube.solves,
            session: [...cube.solves.session, lastSolve],
          },
        });
      }

      const updatedCubes = await getAllCubes();
      setCubes(updatedCubes);

      const updatedCube = await getCubeById(selectedCube.id);
      setSelectedCube(updatedCube);
    }

    setNewScramble(selectedCube);
  };

  return {
    saveSolveMainTimer,
  };
}
