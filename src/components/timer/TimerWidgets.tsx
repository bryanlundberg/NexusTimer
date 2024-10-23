import StatisticsPanel from "./StatisticsPanel";
import OverviewPanel from "./OverviewPanel";
import ScramblePanel from "./ScrambleImagePanel";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTranslations } from "next-intl";

export default function TimerWidgets() {
  const { isSolving, timerStatus, timerStatistics, lastSolve } =
    useTimerStore();
  const { settings } = useSettingsModalStore();
  const t = useTranslations("Index.HomePage");
  return (
    <>
      <div className="flex flex-col gap-1 pb-1">
        {settings.alerts.bestAverage.status &&
        ((timerStatistics.global.ao5 !== 0 &&
          timerStatistics.global.ao5 === timerStatistics.session.ao5) ||
          (timerStatistics.global.ao12 !== 0 &&
            timerStatistics.global.ao12 === timerStatistics.session.ao12) ||
          (timerStatistics.global.ao50 !== 0 &&
            timerStatistics.global.ao50 === timerStatistics.session.ao50) ||
          (timerStatistics.global.ao100 !== 0 &&
            timerStatistics.global.ao100 === timerStatistics.session.ao100)) ? (
          <div className="flex justify-end" id="touch">
            <div className="p-1 text-xs border rounded-md bg-background">
              {t("new_best_average")}
            </div>
          </div>
        ) : null}
        {settings.alerts.worstTime.status &&
          timerStatistics.global.count > 1 &&
          lastSolve &&
          lastSolve.time >= timerStatistics.global.worst && (
            <div className="p-1 text-xs border rounded-md bg-background w-fit ms-auto">
              {t("new_worst_time")}
            </div>
          )}
        <div
          className={`items-center justify-between w-full h-20 text-xs sm:h-20 md:h-24 lg:h-32 md:text-sm ${
            isSolving || timerStatus !== "IDLE" ? "hidden" : "flex"
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
