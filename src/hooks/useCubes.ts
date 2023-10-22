import { useEffect, useState } from "react";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import loadCubes from "@/lib/loadCubes";

export function useCubes() {
  const { cubes, setCubes } = useTimerStore();
  const { modalOpen, setModalOpen } = useCubesModalStore();
  const { lang } = useSettingsModalStore();

  const [filterCubes, setFilterCubes] = useState(cubes);
  const handleSearchFilter = (searchCube: string) => {
    setFilterCubes(
      cubes!.filter((cube) =>
        cube.name.toLowerCase().startsWith(searchCube.toLowerCase())
      )
    );
  };

  useEffect(() => {
    const cubes = loadCubes();
    setCubes(cubes);
  }, [setCubes, setModalOpen]);

  useEffect(() => {
    setFilterCubes(cubes);
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
