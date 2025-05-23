import StatisticsPanel from "./StatisticsPanel";
import OverviewPanel from "./OverviewPanel";
import ScramblePanel from "./ScrambleImagePanel";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTranslations } from "next-intl";
import { TimerStatus } from "@/enums/TimerStatus";

export default function TimerWidgets() {
  const { isSolving, timerStatus, timerStatistics, lastSolve } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index.HomePage");

  const renderBestAverageAlert = () => {
    const { ao5, ao12, ao50, ao100 } = timerStatistics.global;
    const { ao5: sessionAo5, ao12: sessionAo12, ao50: sessionAo50, ao100: sessionAo100 } = timerStatistics.session;

    const newBestAverages = [];
    if (ao5 !== 0 && ao5 === sessionAo5) newBestAverages.push("Ao5");
    if (ao12 !== 0 && ao12 === sessionAo12) newBestAverages.push("Ao12");
    if (ao50 !== 0 && ao50 === sessionAo50) newBestAverages.push("Ao50");
    if (ao100 !== 0 && ao100 === sessionAo100) newBestAverages.push("Ao100");

    if (settings.alerts.bestAverage.status && newBestAverages.length > 0) {
      return (
        <div className="flex justify-end" id="touch">
          <div className="p-1 text-xs border rounded-md bg-background">
            {t("new_best_average")}: {newBestAverages.join(", ")}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderWorstTimeAlert = () => {
    if (
      settings.alerts.worstTime.status &&
      timerStatistics.global.count > 1 &&
      lastSolve &&
      lastSolve.time > timerStatistics.global.worst
    ) {
      return (
        <div className="p-1 text-xs border rounded-md bg-background w-fit ms-auto">
          {t("new_worst_time")}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex flex-col gap-1 pb-1">
        {renderBestAverageAlert()}
        {renderWorstTimeAlert()}
        <div
          className={`items-center justify-between w-full h-20 text-xs sm:h-20 md:h-24 lg:h-32 md:text-sm ${
            isSolving || timerStatus !== TimerStatus.IDLE ? "hidden" : "flex"
          }`}
        >
          <OverviewPanel />
          <ScramblePanel />
          <StatisticsPanel />
        </div>
      </div>
    </>
  );
}
