import StatisticsPanel from "./StatisticsPanel";
import OverviewPanel from "./OverviewPanel";
import ScramblePanel from "./ScrambleImagePanel";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStatistics } from "@/hooks/useTimerStatistics";

export default function TimerWidgets() {
  const { isSolving, timerStatus } = useTimerStore();
  const { lang, settings } = useSettingsModalStore();
  const { global, session } = useTimerStatistics();

  return (
    <>
      <div className="flex flex-col gap-1" id="touch">
        {settings.alerts.bestAverage.status &&
        ((global.ao5 !== 0 && global.ao5 === session.ao5) ||
          (global.ao12 !== 0 && global.ao12 === session.ao12) ||
          (global.ao50 !== 0 && global.ao50 === session.ao50) ||
          (global.ao100 !== 0 && global.ao100 === session.ao100)) ? (
          <div className="flex justify-end">
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
