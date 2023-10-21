import StatisticsPanel from "./StatisticsPanel";
import OverviewPanel from "./OverviewPanel";
import ScramblePanel from "./ScrambleImagePanel";

export default function TimerWidgets() {
  return (
    <div className="flex items-center justify-between w-full h-20 text-xs sm:h-20 md:h-24 lg:h-32 md:text-sm">
      <OverviewPanel />
      <ScramblePanel />
      <StatisticsPanel />
    </div>
  );
}
