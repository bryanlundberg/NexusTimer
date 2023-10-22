import { Categories } from "@/interfaces/Categories";
import { cubeCollection } from "@/lib/cubeCollection";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";
import { useState } from "react";

export default function useMetricsSwitch() {
  const { lang } = useSettingsModalStore();
  const { cubes } = useTimerStore();
  const [filterCategory, setFilterCategory] = useState<Categories>("3x3");
  const [filterCube, setFilterCube] = useState(
    translation.solves.filter["all"][lang]
  );

  const handleChangeCategory = (value: any) => {
    setFilterCube(translation.solves.filter["all"][lang]);
    setFilterCategory(value);
  };

  const handleChangeCube = (value: any) => {
    setFilterCube(value);
  };

  const categoyOptions = loadCategoryOptions();
  const cubeOptions = loadCubeOptions();

  function loadCategoryOptions() {
    const categoryOptions: any[] = [];
    cubeCollection.map((cat) => {
      categoryOptions.push({ name: cat.name, id: cat.name });
    });
    return categoryOptions;
  }

  function loadCubeOptions() {
    const CubeOptions: any[] = [
      {
        name: translation.solves.filter["all"][lang],
        id: translation.solves.filter["all"][lang],
      },
    ];
    cubes?.map((cube) => {
      if (cube.category === filterCategory) {
        CubeOptions.push({ name: cube.name, id: cube.name });
      }
    });
    return CubeOptions;
  }

  return {
    filterCategory,
    filterCube,
    handleChangeCategory,
    handleChangeCube,
    categoyOptions,
    cubeOptions,
  };
}
