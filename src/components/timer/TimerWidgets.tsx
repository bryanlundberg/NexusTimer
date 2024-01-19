import StatisticsPanel from "./StatisticsPanel";
import OverviewPanel from "./OverviewPanel";
import ScramblePanel from "./ScrambleImagePanel";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function TimerWidgets() {
  const { isSolving, timerStatus, timerStatistics } = useTimerStore();
  const { lang, settings } = useSettingsModalStore();

  return (
    <>
      <div className="flex flex-col gap-1">
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
            <div className="p-1 text-xs border rounded-md light:bg-neutral-100 light:border-neutral-900 dark:bg-zinc-900 dark:border-neutral-400">
              {translation.timer["new_best_average"][lang]}
            </div>
          </div>
        ) : null}
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
