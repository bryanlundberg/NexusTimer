import calcStatistics from "@/lib/calcStatistics";
import { defaultTimerStatistics } from "@/lib/const/defaultTimerStatistics";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";
import { useState, useEffect } from "react";
import formatTime from "@/lib/formatTime";

export default function OverviewPanel() {
  const { lang, settings } = useSettingsModalStore();
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

  return (
    <div className="flex flex-col justify-center w-full h-full">
      {settings.features.sessionStats.status ? (
        <>
          <div className="font-medium">
            {translation.timer["deviation"][lang]}
            {": "}
            {formatTime(statistics.deviation * 1000)}
          </div>
          <div className="font-medium">
            {translation.timer["mean"][lang]}
            {": "}
            {formatTime(statistics.mean * 1000)}
          </div>
          <div className="font-medium">
            {translation.timer["best"][lang]}
            {": "}
            {formatTime(statistics.best)}
          </div>
          <div className="font-medium">
            {translation.timer["counter"][lang]}
            {": "}
            {statistics.count}
          </div>
        </>
      ) : null}
    </div>
  );
}
