import { useTimerStore } from "@/store/timerStore";
import { useRouter } from "next/navigation";
import { useNXData } from '@/hooks/useNXData';

export function useCubes() {
  const { getAllCubes, saveCube } = useNXData();
  const cubes = useTimerStore(store => store.cubes);
  const setSelectedCube = useTimerStore(store => store.setSelectedCube);
  const setNewScramble = useTimerStore(store => store.setNewScramble);
  const setCubes = useTimerStore(store => store.setCubes);
  const router = useRouter();

  const handleFavoriteClick = async (cubeId: string) => {
    try {
      const editingCube = cubes?.find(cube => cube.id === cubeId);
      if (!editingCube) return;

      const updatedCube = { ...editingCube, favorite: !editingCube.favorite };
      await saveCube(updatedCube);

      const updatedCubes = await getAllCubes();
      setCubes(updatedCubes);
    } catch (error) {
      console.error("Error updating favorite cube:", error);
    }
  };

  const handleRedirectToTimer = (cubeId: string) => {
    const clickedCube = cubes?.find(cube => cube.id === cubeId);
    if (!clickedCube) return;

    setSelectedCube({ ...clickedCube });
    setNewScramble(clickedCube);
    router.push("/app");
  };

  return {
    handleFavoriteClick,
    handleRedirectToTimer
  };
}
