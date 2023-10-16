import calcStatistics from "@/lib/calcStatistics";
import { defaultTimerStatistics } from "@/lib/const/defaultTimerStatistics";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useState, useEffect } from "react";
import formatTime from "@/lib/formatTime";

export default function StatisticsPanel() {
  const { scramble, selectedCube } = useTimerStore();
  const { settings } = useSettingsModalStore();
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

  return (
    <>
      <div className="flex flex-col justify-center w-full h-full">
        {settings.features.sessionStats.status ? (
          <>
            <div className="font-medium text-right">
              Ao5:{" "}
              {statistics.ao5 === 0 ? "--" : formatTime(statistics.ao5)}
            </div>
            <div className="font-medium text-right">
              Ao12:{" "}
              {statistics.ao12 === 0
                ? "--"
                : formatTime(statistics.ao12)}
            </div>
            <div className="font-medium text-right">
              Ao50:{" "}
              {statistics.ao50 === 0
                ? "--"
                : formatTime(statistics.ao50)}
            </div>
            <div className="font-medium text-right">
              Ao100:{" "}
              {statistics.ao100 === 0
                ? "--"
                : formatTime(statistics.ao100)}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
