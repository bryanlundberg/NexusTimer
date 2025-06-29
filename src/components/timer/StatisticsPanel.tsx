import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import { useTimerStore } from "@/store/timerStore";

export default function StatisticsPanel() {
  const settings = useSettingsModalStore(store => store.settings);
  const timerStatistics = useTimerStore(store => store.timerStatistics);
  const bgRecord = "bg-yellow-500";

  const renderStatistic = (label: string, key: "ao5" | "ao12" | "ao50" | "ao100", testId: string) => (
    <div className="flex justify-end w-full font-medium text-right">
      <div
        className={`w-fit px-[5px] rounded-md ${
          timerStatistics.global[key] !== 0 &&
          timerStatistics.global[key] === timerStatistics.session[key] &&
          settings.alerts.bestAverage
            ? bgRecord
            : ""
        }`}
      >
        {label}:{" "}
        <span data-testid={testId}>
          {timerStatistics.session[key] === 0
            ? "--"
            : formatTime(timerStatistics.session[key])}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="flex flex-col justify-center w-full h-full gap-1"
        id="touch"
      >
        {settings.features.sessionStats && (
          <>
            {renderStatistic("Ao5", "ao5", "timer-session-ao5")}
            {renderStatistic("Ao12", "ao12", "timer-session-ao12")}
            {renderStatistic("Ao50", "ao50", "timer-session-ao50")}
            {renderStatistic("Ao100", "ao100", "timer-session-ao100")}
          </>
        )}
      </div>
    </>
  );
}
