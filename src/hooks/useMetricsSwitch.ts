import { Categories } from "@/interfaces/Categories";
import { Solve } from "@/interfaces/Solve";
import calcAoStatistics from "@/lib/calcAoStatistics";
import calcAverageStatistics from "@/lib/calcAverageStatistics";
import calcBestTime from "@/lib/calcBestTime";
import calcDeviation from "@/lib/calcDeviation";
import calcSuccessRate from "@/lib/calcSuccessRate";
import calcTimeSpentStatistics from "@/lib/calcTimeSpentStatistics";
import calcTotalSolvesStatistics from "@/lib/calcTotalSolvesStatistics";
import { cubeCollection } from "@/lib/cubeCollection";
import getSolvesMetrics from "@/lib/getSolvesMetrics";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";
import { useEffect, useState } from "react";

export default function useMetricsSwitch() {
  const { lang } = useSettingsModalStore();
  const { cubes } = useTimerStore();
  const [filterCategory, setFilterCategory] = useState<Categories>("3x3");
  const [filterCube, setFilterCube] = useState(
    translation.solves.filter["all"][lang]
  );

  const [optInChart, setOptInChart] = useState({
    mean: true,
    best: false,
  });

  const defaultValues: any = {
    global: 0,
    session: 0,
    cubeSession: 0,
    cubeAll: 0,
  };

  interface ChartData {
    global: Solve[];
    session: Solve[];
    cubeSession: Solve[];
    cubeAll: Solve[];
  }

  const defaultChartValues: ChartData = {
    global: [],
    session: [],
    cubeSession: [],
    cubeAll: [],
  };

  const [average, setAverage] = useState(defaultValues);
  const [timeSpent, setTimeSpent] = useState(defaultValues);
  const [counter, setCounter] = useState(defaultValues);
  const [stats, setStats] = useState(defaultValues);
  const [deviation, setDeviation] = useState(defaultValues);
  const [successRate, setSuccessRate] = useState(defaultValues);
  const [best, setBest] = useState(defaultValues);
  const [data, setData] = useState(defaultChartValues);

  const categoryOptions = loadCategoryOptions();
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

  const handleChangeCategory = (value: any) => {
    setFilterCube(translation.solves.filter["all"][lang]);
    setFilterCategory(value);
  };

  const handleChangeCube = (value: any) => {
    setFilterCube(value);
  };

  useEffect(() => {
    setFilterCube(translation.solves.filter["all"][lang]);
  }, [lang]);

  useEffect(() => {
    const calculatedAverage = calcAverageStatistics(filterCategory, filterCube);
    const calculatedTimeSpent = calcTimeSpentStatistics(
      filterCategory,
      filterCube
    );
    const calculatedCounter = calcTotalSolvesStatistics(
      filterCategory,
      filterCube
    );
    const calculatedStats = calcAoStatistics(filterCategory, filterCube);
    const calculatedDeviation = calcDeviation(filterCategory, filterCube);
    const calculatedSuccessRate = calcSuccessRate(filterCategory, filterCube);
    const calculatedBest = calcBestTime(filterCategory, filterCube);
    const calculatedData = getSolvesMetrics(filterCategory, filterCube);

    setAverage(calculatedAverage);
    setTimeSpent(calculatedTimeSpent);
    setCounter(calculatedCounter);
    setStats(calculatedStats);
    setDeviation(calculatedDeviation);
    setSuccessRate(calculatedSuccessRate);
    setBest(calculatedBest);
    setData(calculatedData);
  }, [filterCategory, filterCube]);

  return {
    filterCategory,
    filterCube,
    handleChangeCategory,
    handleChangeCube,
    categoryOptions,
    cubeOptions,
    optInChart,
    setOptInChart,
    average,
    timeSpent,
    counter,
    stats,
    deviation,
    successRate,
    best,
    data,
  };
}
