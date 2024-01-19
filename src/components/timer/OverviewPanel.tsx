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
            {formatTime(timerStatistics.session.deviation)}
          </div>
          <div className="font-medium">
            {translation.timer["mean"][lang]}
            {": "}
            {formatTime(timerStatistics.session.mean)}
          </div>
          <div className="font-medium">
            {translation.timer["best"][lang]}
            {": "}
            {formatTime(timerStatistics.session.best)}
          </div>
          <div className="font-medium">
            {translation.timer["counter"][lang]}
            {": "}
            {timerStatistics.session.count}
          </div>
        </>
      ) : null}
    </div>
  );
}
