import getBestTime from "@/lib/getBestTime";
import getCountSolves from "@/lib/getSessionSolves";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useState } from "react";

export default function TimerWidgets() {
  const { scramble, event, selectedCube } = useTimerStore();

  const [statistics, setStatistics] = useState({
    bestTime: 0,
    count: 0,
  });

  useEffect(() => {
    const display = document.querySelector("scramble-display");
    display?.remove();
    const child = document.createElement("scramble-display");
    child.setAttribute("event", event);
    child.setAttribute("scramble", scramble ? scramble : "");
    document.querySelector("#scramble-display")?.appendChild(child);

    if (selectedCube) {
      const totalCount = getCountSolves({ cubeId: selectedCube.id });
      const bestTime = getBestTime({
        cubeId: selectedCube.id,
        typeSearch: "session",
      });

      setStatistics({
        ...statistics,
        count: totalCount,
        bestTime: bestTime ? bestTime : 0,
      });
    }
  }, [scramble, event, selectedCube]);

  console.log(statistics);

  return (
    <div className="h-20 md:h-32 lg:h-40 w-full flex justify-between text-xs md:text-sm">
      <div className="w-full h-full">
        <div className="font-medium">Desviation: --.--</div>
        <div className="font-medium">Mean: --.--</div>
        <div className="font-medium">
          Best: {(statistics.bestTime / 1000).toFixed(2)}
        </div>
        <div className="font-medium">Count: {statistics.count}</div>
      </div>
      <div className="w-full h-full" id="scramble-display"></div>
      <div className="w-full h-full">
        <div className="text-right font-medium">Ao5: --.--</div>
        <div className="text-right font-medium">Ao12: --.--</div>
        <div className="text-right font-medium">Ao50: --.--</div>
        <div className="text-right font-medium">Ao100: --.--</div>
      </div>
    </div>
  );
}
