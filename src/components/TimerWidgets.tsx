import calcStatistics from "@/lib/calcStatistics";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useState } from "react";

export default function TimerWidgets() {
  const { scramble, event, selectedCube } = useTimerStore();

  const [statistics, setStatistics] = useState({
    best: 0,
    count: 0,
    ao3: 0,
    ao5: 0,
    ao12: 0,
    ao50: 0,
    ao100: 0,
    ao1000: 0,
    desviation: 0,
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
      const { count, best, ao3, ao5, ao12, ao50, ao1000, desviation, mean } =
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
        desviation,
        mean,
      });
    }
  }, [scramble, event, selectedCube]);

  return (
    <div className="h-20 md:h-32 lg:h-40 w-full flex justify-between text-xs md:text-sm">
      <div className="w-full h-full">
        <div className="font-medium">Desviation: {statistics.desviation}</div>
        <div className="font-medium">Mean: {statistics.mean}</div>
        <div className="font-medium">
          Best: {(statistics.best / 1000).toFixed(2)}
        </div>
        <div className="font-medium">Count: {statistics.count}</div>
      </div>
      <div className="w-full h-full" id="scramble-display"></div>
      <div className="w-full h-full">
        <div className="text-right font-medium">
          Ao5:{" "}
          {statistics.ao5 === 0 ? "--.--" : (statistics.ao5 / 1000).toFixed(2)}
        </div>
        <div className="text-right font-medium">
          Ao12:{" "}
          {statistics.ao12 === 0
            ? "--.--"
            : (statistics.ao12 / 1000).toFixed(2)}
        </div>
        <div className="text-right font-medium">
          Ao50:{" "}
          {statistics.ao50 === 0
            ? "--.--"
            : (statistics.ao50 / 1000).toFixed(2)}
        </div>
        <div className="text-right font-medium">
          Ao100:{" "}
          {statistics.ao100 === 0
            ? "--.--"
            : (statistics.ao100 / 1000).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
