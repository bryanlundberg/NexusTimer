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
import { useEffect, useState } from "react";

export default function useMetricsSwitch() {
  const selectedCube = useTimerStore(store => store.selectedCube);
  const cubes = useTimerStore(store => store.cubes);
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

  useEffect(() => {
    if (selectedCube) {
      const calculatedAverage = calcAverageStatistics({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
      });
      const calculatedTimeSpent = calcTimeSpentStatistics({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
      });
      const calculatedCounter = calcTotalSolvesStatistics({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
      });
      const calculatedStats = calcAoStatistics({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
      });
      const calculatedDeviation = calcDeviation({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
      });
      const calculatedSuccessRate = calcSuccessRate({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
      });
      const calculatedBest = calcBestTime({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
      });
      const calculatedData = getSolvesMetrics({
        cubesDB: cubes,
        category: selectedCube.category,
        cubeName: selectedCube.name,
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
    }
  }, [cubes, selectedCube]);

  return {
    stats,
  };
}
