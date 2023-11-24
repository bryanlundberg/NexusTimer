import StatisticsPanel from "./StatisticsPanel";
import OverviewPanel from "./OverviewPanel";
import ScramblePanel from "./ScrambleImagePanel";
import { useTimerStore } from "@/store/timerStore";
import translation from "@/translations/global.json";
import { useSettingsModalStore } from "@/store/SettingsModalStore";

export default function TimerWidgets() {
  const { isSolving } = useTimerStore();
  const { lang, settings } = useSettingsModalStore();
  if (isSolving) return null;
  return (
    <>
      <div className="flex flex-col gap-1" id="touch">
        {settings.alerts.bestAverage.status && (
          <div className="flex justify-end">
            <div className="px-1 text-xs border rounded-md">
              {translation.timer["new_best_average"][lang]}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between w-full h-20 text-xs sm:h-20 md:h-24 lg:h-32 md:text-sm">
          <OverviewPanel />
          <ScramblePanel />
          <StatisticsPanel />
        </div>
      </div>
    </>
  );
}
