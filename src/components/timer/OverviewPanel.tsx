import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";

export default function OverviewPanel() {
  const { settings } = useSettingsModalStore();
  const { timerStatistics } = useTimerStore();
  const t = useTranslations("Index");
  return (
    <div
      className="flex flex-col justify-center w-full h-full gap-1"
      id="touch"
    >
      {settings.features.sessionStats.status ? (
        <>
          <div className="font-medium">
            {t("HomePage.deviation")}
            {": "}
            <span data-testid="timer-session-deviation">
              {formatTime(timerStatistics.session.deviation)}
            </span>
          </div>
          <div className="font-medium">
            {t("HomePage.average")}
            {": "}
            <span data-testid="timer-session-mean">
              {formatTime(timerStatistics.session.mean)}
            </span>
          </div>
          <div className="font-medium">
            {t("HomePage.best")}
            {": "}
            <span data-testid="timer-session-best">
              {formatTime(timerStatistics.session.best)}
            </span>
          </div>
          <div className="font-medium">
            {t("HomePage.counter")}
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
