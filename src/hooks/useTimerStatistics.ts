import calcStatistics from "@/lib/calcStatistics";
import { defaultTimerStatistics } from "@/lib/const/defaultTimerStatistics";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useState } from "react";

export function useTimerStatistics() {
  const { scramble, selectedCube } = useTimerStore();
  const [statistics, setStatistics] = useState(defaultTimerStatistics);

  useEffect(() => {
    if (selectedCube) {
      const { count, best, ao3, ao5, ao12, ao50, ao100, deviation, mean } =
        calcStatistics({
          cubeId: selectedCube.id,
        });
      setStatistics({
        count,
        best,
        ao3,
        ao5,
        ao12,
        ao50,
        ao100,
        deviation,
        mean,
      });
    }
  }, [scramble, selectedCube]);

  return statistics;
}
