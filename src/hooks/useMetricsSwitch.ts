import { Categories } from "@/interfaces/Categories";
import calcAoStatistics from "@/lib/calcAoStatistics";
import calcAverageStatistics from "@/lib/calcAverageStatistics";
import calcBestTime from "@/lib/calcBestTime";
import calcDeviation from "@/lib/calcDeviation";
import calcSuccessRate from "@/lib/calcSuccessRate";
import calcTimeSpentStatistics from "@/lib/calcTimeSpentStatistics";
import calcTotalSolvesStatistics from "@/lib/calcTotalSolvesStatistics";
import {
  defaultChartValuesA,
  defaultChartValuesS,
  defaultChartValuesN,
  defaultChartAoValues,
} from "@/lib/const/defaultChartValues";
import getSolvesMetrics from "@/lib/getSolvesMetrics";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function useMetricsSwitch() {
  const t = useTranslations("Index.SolvesPage");
  const { cubes } = useTimerStore();
  const [filterCategory, setFilterCategory] = useState<Categories>("3x3");
  const [filterCube, setFilterCube] = useState<string>("all");

  const [stats, setStats] = useState({
    average: defaultChartValuesN,
    timeSpent: defaultChartValuesS,
    counter: defaultChartValuesN,
    stats: defaultChartAoValues,
    deviation: defaultChartValuesN,
    successRate: defaultChartValuesS,
    best: defaultChartValuesN,
    data: defaultChartValuesA,
  });

  const handleChangeCategory = (value: any) => {
    setFilterCube("all");
    setFilterCategory(value);
  };

  const handleChangeCube = (value: any) => {
    setFilterCube(value);
  };

  useEffect(() => {
    const calculatedAverage = calcAverageStatistics({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });
    const calculatedTimeSpent = calcTimeSpentStatistics({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });
    const calculatedCounter = calcTotalSolvesStatistics({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });
    const calculatedStats = calcAoStatistics({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });
    const calculatedDeviation = calcDeviation({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });
    const calculatedSuccessRate = calcSuccessRate({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });
    const calculatedBest = calcBestTime({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });
    const calculatedData = getSolvesMetrics({
      cubesDB: cubes,
      category: filterCategory,
      cubeName: filterCube,
    });

    setStats((prev) => ({
      ...prev,
      average: calculatedAverage,
      timeSpent: calculatedTimeSpent,
      counter: calculatedCounter,
      stats: calculatedStats,
      deviation: calculatedDeviation,
      successRate: calculatedSuccessRate,
      best: calculatedBest,
      data: calculatedData,
    }));
  }, [filterCategory, filterCube, cubes]);

  return {
    filterCategory,
    filterCube,
    handleChangeCategory,
    handleChangeCube,
    stats,
  };
}
