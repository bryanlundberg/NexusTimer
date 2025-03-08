import { useEffect, useState } from "react";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes, saveCube } from "@/db/dbOperations";
import { useRouter } from "next/navigation";

export function useCubes() {
  const { cubes, setSelectedCube, setNewScramble, setCubes } = useTimerStore();
  const [filterCubes, setFilterCubes] = useState(cubes);
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
    router.push("/");
  };

  useEffect(() => {
    const fetchCubes = async () => {
      const allCubes = await getAllCubes();
      setFilterCubes(allCubes);
    };
    fetchCubes();
  }, [cubes]);

  return {
    filterCubes,
    handleFavoriteClick,
    handleRedirectToTimer
  };
}
