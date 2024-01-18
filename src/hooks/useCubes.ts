import { useEffect, useState } from "react";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { getAllCubes } from "@/db/dbOperations";

export function useCubes() {
  const { cubes } = useTimerStore();
  const { modalOpen, setModalOpen } = useCubesModalStore();
  const { lang } = useSettingsModalStore();
  const [filterCubes, setFilterCubes] = useState(cubes);

  const handleSearchFilter = async (searchCube: string) => {
    if (!cubes) return;
    setFilterCubes(
      cubes.filter((cube) =>
        cube.name.toLowerCase().startsWith(searchCube.toLowerCase())
      )
    );
  };

  useEffect(() => {
    getAllCubes().then((res) => setFilterCubes(res));
  }, [modalOpen, cubes]);

  return {
    cubes,
    filterCubes,
    modalOpen,
    setModalOpen,
    lang,
    handleSearchFilter,
  };
}
