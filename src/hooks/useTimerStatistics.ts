import calcStatistics from "@/lib/calcStatistics";
import { defaultTimerStatistics } from "@/lib/const/defaultTimerStatistics";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useState } from "react";

export function useTimerStatistics() {
  const { selectedCube, cubes } = useTimerStore();
  const [statistics, setStatistics] = useState({
    global: defaultTimerStatistics,
    session: defaultTimerStatistics,
    cubeSession: defaultTimerStatistics,
  });

  useEffect(() => {
    if (selectedCube) {
      const { global, session, cubeSession } = calcStatistics({
        cubesDB: cubes,
        selectedCube,
      });
      setStatistics({ global, session, cubeSession });
    }
  }, [selectedCube, cubes]);

  return {
    global: statistics.global,
    session: statistics.session,
    cubeSession: statistics.cubeSession,
  };
}
