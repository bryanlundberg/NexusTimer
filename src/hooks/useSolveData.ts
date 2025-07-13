import { useTimerStore } from "@/store/timerStore";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";
import { useNXData } from '@/hooks/useNXData';

export default function useSolveData() {
  const { getAllCubes, getCubeById, saveCube } = useNXData();
  const solvingTime = useTimerStore(store => store.solvingTime);
  const selectedCube = useTimerStore(store => store.selectedCube);
  const scramble = useTimerStore(store => store.scramble);
  const setCubes = useTimerStore(store => store.setCubes);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setLastSolve = useTimerStore(store => store.setLastSolve);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const cubes = useTimerStore(store => store.cubes);

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
