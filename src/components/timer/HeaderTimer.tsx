import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { ScrambleZone } from "./ScrambleZone";
import { useTranslations } from "next-intl";
import Navigation from "../navigation/navigation";
import { TimerStatus } from "@/enums/TimerStatus";
export default function HeaderTimer() {
  const isSolving = useTimerStore(store => store.isSolving);
  const timerStatus = useTimerStore(store => store.timerStatus);
  const lastSolve = useTimerStore(store => store.lastSolve);
  const timerStatistics = useTimerStore(store => store.timerStatistics);
  const settings = useSettingsModalStore(store => store.settings);
  const t = useTranslations("Index.HomePage");

  if (isSolving || timerStatus !== TimerStatus.IDLE) return null;

  const isPersonalBest = lastSolve != null && lastSolve.time <= timerStatistics.global.best && settings.alerts.bestTime;

  return (
    <>
      <Navigation showButtonNextScramble showButtonSelectMode showMainCubeSelector />
      <ScrambleZone />
      {isPersonalBest && (
        <div id="touch" className="mt-10 text-center">
          <p>{t("congratulations")}</p>
          <p>{t("personal_best")}</p>
        </div>
      )}
    </>
  );
}
