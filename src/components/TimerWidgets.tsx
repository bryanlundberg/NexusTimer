import calcStatistics from "@/lib/calcStatistics";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useState } from "react";
import translation from "@/translations/global.json";

export default function TimerWidgets() {
  const { scramble, event, selectedCube } = useTimerStore();
  const { settings } = useSettingsModalStore();

  const [statistics, setStatistics] = useState({
    best: 0,
    count: 0,
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0,
    deviation: 0,
    mean: 0,
  });

  useEffect(() => {
    const display = document.querySelector("scramble-display");
    display?.remove();
    const child = document.createElement("scramble-display");
    child.setAttribute("event", event);
    child.setAttribute("scramble", scramble ? scramble : "");
    document.querySelector("#scramble-display")?.appendChild(child);

    if (selectedCube) {
      const { count, best, ao3, ao5, ao12, ao50, ao1000, deviation, mean } =
        calcStatistics({
          cubeId: selectedCube.id,
          typeSearch: "session",
        });
      setStatistics({
        ...statistics,
        count,
        best,
        ao3,
        ao5,
        ao12,
        ao50,
        ao1000,
        deviation,
        mean,
      });
    }
  }, [scramble, event, selectedCube]);

  return (
    <div className="h-20 md:h-32 lg:h-40 w-full flex justify-between text-xs md:text-sm">
      <div className="w-full h-full">
        <div className="font-medium">
          {translation.timer["deviation"][settings.locale[0].lang]}
          {": "}
          {statistics.deviation.toFixed(2)}
        </div>
        <div className="font-medium">
          {translation.timer["mean"][settings.locale[0].lang]}
          {": "}
          {statistics.mean.toFixed(2)}
        </div>
        <div className="font-medium">
          {translation.timer["best"][settings.locale[0].lang]}
          {": "}
          {(statistics.best / 1000).toFixed(2)}
        </div>
        <div className="font-medium">
          {translation.timer["counter"][settings.locale[0].lang]}
          {": "}
          {statistics.count}
        </div>
      </div>
      <div className="w-full h-full" id="scramble-display"></div>
      <div className="w-full h-full">
        <div className="text-right font-medium">
          Ao5:{" "}
          {statistics.ao5 === 0 ? "--" : (statistics.ao5 / 1000).toFixed(2)}
        </div>
        <div className="text-right font-medium">
          Ao12:{" "}
          {statistics.ao12 === 0 ? "--" : (statistics.ao12 / 1000).toFixed(2)}
        </div>
        <div className="text-right font-medium">
          Ao50:{" "}
          {statistics.ao50 === 0 ? "--" : (statistics.ao50 / 1000).toFixed(2)}
        </div>
        <div className="text-right font-medium">
          Ao100:{" "}
          {statistics.ao100 === 0 ? "--" : (statistics.ao100 / 1000).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
