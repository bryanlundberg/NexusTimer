import StatisticsPanel from "./StatisticsPanel";
import OverviewPanel from "./OverviewPanel";
import ScramblePanel from "./ScrambleImagePanel";
import { useTimerStore } from "@/store/timerStore";

export default function TimerWidgets() {
  const { isSolving } = useTimerStore();
  if (isSolving) return null;
  return (
    <div
      id="touch"
      className="flex items-center justify-between w-full h-20 text-xs sm:h-20 md:h-24 lg:h-32 md:text-sm"
    >
      <OverviewPanel />
      <ScramblePanel />
      <StatisticsPanel />
    </div>
  );
}
