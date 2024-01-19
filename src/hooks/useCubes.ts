import { useEffect, useState } from "react";
import { useTimerStore } from "@/store/timerStore";
import { getAllCubes } from "@/db/dbOperations";
import { Cube } from "@/interfaces/Cube";

export function useCubes() {
  const { cubes } = useTimerStore();
  const [filterCubes, setFilterCubes] = useState(cubes);

  const handleSearchFilter = (searchCube: string) => {
    if (!cubes) return;
    if (searchCube.trim() === "") return setFilterCubes(cubes);
    setFilterCubes(
      cubes.filter((cube: Cube) =>
        cube.name.toLowerCase().startsWith(searchCube.toLowerCase())
      )
    );
  };

  useEffect(() => {
    getAllCubes().then((res) => setFilterCubes(res));
  }, [cubes]);

  return {
    filterCubes,
    handleSearchFilter,
  };
}
