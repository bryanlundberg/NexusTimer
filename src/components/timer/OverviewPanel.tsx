import { useSettingsModalStore } from "@/store/SettingsModalStore";
import translation from "@/translations/global.json";
import formatTime from "@/lib/formatTime";
import { useTimerStore } from "@/store/timerStore";

export default function OverviewPanel() {
  const { lang, settings } = useSettingsModalStore();
  const { timerStatistics } = useTimerStore();

  return (
    <div
      className="flex flex-col justify-center w-full h-full gap-1"
      id="touch"
    >
      {settings.features.sessionStats.status ? (
        <>
          <div className="font-medium">
            {translation.timer["deviation"][lang]}
            {": "}
            <span data-testid="timer-session-deviation">
              {formatTime(timerStatistics.session.deviation)}
            </span>
          </div>
          <div className="font-medium">
            {translation.timer["mean"][lang]}
            {": "}
            <span data-testid="timer-session-mean">
              {formatTime(timerStatistics.session.mean)}
            </span>
          </div>
          <div className="font-medium">
            {translation.timer["best"][lang]}
            {": "}
            <span data-testid="timer-session-best">
              {formatTime(timerStatistics.session.best)}
            </span>
          </div>
          <div className="font-medium">
            {translation.timer["counter"][lang]}
            {": "}
            <span data-testid="timer-session-count">
              {timerStatistics.session.count}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}
