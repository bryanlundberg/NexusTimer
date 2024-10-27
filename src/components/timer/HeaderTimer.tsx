import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { ScrambleZone } from "./ScrambleZone";
import { useTranslations } from "next-intl";
import Navigation from "../navigation/navigation";

export default function HeaderTimer() {
  const { isSolving, timerStatus } = useTimerStore();
  const { settings } = useSettingsModalStore();
  const { lastSolve, timerStatistics } = useTimerStore();
  const t = useTranslations("Index.HomePage");

  if (isSolving || timerStatus !== "IDLE") return null;

  return (
    <>
      <Navigation />

      <ScrambleZone />

      {lastSolve != null &&
      lastSolve.time <= timerStatistics.global.best &&
      settings.alerts.bestTime.status ? (
        <div id="touch" className="mt-10 text-center">
          <p>{t("congratulations")}</p>
          <p>{t("personal_best")}</p>
        </div>
      ) : null}
    </>
  );
}
