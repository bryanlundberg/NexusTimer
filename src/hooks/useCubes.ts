import { useEffect, useState } from "react";
import { useTimerStore } from "@/store/timerStore";
import { useCubesModalStore } from "@/store/CubesModalStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { getAllCubes } from "@/db/dbOperations";

export function useCubes() {
  const { cubes, setCubes } = useTimerStore();
  const { modalOpen, setModalOpen } = useCubesModalStore();
  const { lang } = useSettingsModalStore();
  const [filterCubes, setFilterCubes] = useState(cubes);

  const handleSearchFilter = async (searchCube: string) => {
    //Replace this function and use index search -> Its a lot more faster and efficient
    const cubesDB = await getAllCubes();
    setFilterCubes(
      cubesDB.filter((cube) =>
        cube.name.toLowerCase().startsWith(searchCube.toLowerCase())
      )
    );
  };

  useEffect(() => {
    getAllCubes().then((res) => setCubes(res));
  }, [setCubes, setModalOpen]);

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
