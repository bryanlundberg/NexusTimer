import calcStatistics from "@/lib/calcStatistics";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useState } from "react";
import translation from "@/translations/global.json";
import createScrambleImage from "@/lib/createScrambleImage";
import { defaultTimerStatistics } from "@/lib/const/defaultTimerStatistics";

export default function TimerWidgets() {
  const { scramble, event, selectedCube, lastSolve } = useTimerStore();
  const { lang } = useSettingsModalStore();

  const [statistics, setStatistics] = useState(defaultTimerStatistics);

  useEffect(() => {
    createScrambleImage(event, scramble ? scramble : "");
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
  }, [scramble, event, selectedCube, lastSolve]);

  return (
    <div className="flex items-center justify-between w-full h-20 text-xs sm:h-20 md:h-24 lg:h-32 md:text-sm">
      <div className="flex flex-col justify-center w-full h-full">
        <div className="font-medium">
          {translation.timer["deviation"][lang]}
          {": "}
          {statistics.deviation.toFixed(2)}
        </div>
        <div className="font-medium">
          {translation.timer["mean"][lang]}
          {": "}
          {statistics.mean.toFixed(2)}
        </div>
        <div className="font-medium">
          {translation.timer["best"][lang]}
          {": "}
          {(statistics.best / 1000).toFixed(2)}
        </div>
        <div className="font-medium">
          {translation.timer["counter"][lang]}
          {": "}
          {statistics.count}
        </div>
      </div>
      <div className="w-full h-full" id="scramble-display"></div>
      <div className="flex flex-col justify-center w-full h-full">
        <div className="font-medium text-right">
          Ao5:{" "}
          {statistics.ao5 === 0 ? "--" : (statistics.ao5 / 1000).toFixed(2)}
        </div>
        <div className="font-medium text-right">
          Ao12:{" "}
          {statistics.ao12 === 0 ? "--" : (statistics.ao12 / 1000).toFixed(2)}
        </div>
        <div className="font-medium text-right">
          Ao50:{" "}
          {statistics.ao50 === 0 ? "--" : (statistics.ao50 / 1000).toFixed(2)}
        </div>
        <div className="font-medium text-right">
          Ao100:{" "}
          {statistics.ao100 === 0 ? "--" : (statistics.ao100 / 1000).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
