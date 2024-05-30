import { useTimerStore } from "@/store/timerStore";
import SolveOptions from "./SolveOptions";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import useTimer from "@/hooks/useTimer";
import Confetti from "react-dom-confetti";
import useDeviceMatch from "@/hooks/useDeviceMatch";
import { confettiConfig } from "@/lib/const/confettiConfig";
import { useTranslations } from "next-intl";

const timerStatusClasses = {
  IDLE: "light:text-neutral-900 dark:text-white",
  HOLDING: "light:text-pink-600 dark:text-pink-600",
  SOLVING: "light:text-neutral-700 dark:text-slate-200",
  READY: "text-emerald-400",
  INSPECTING: "text-orange-500",
};

export default function Timer() {
  const { settings } = useSettingsModalStore();
  const {
    selectedCube,
    isSolving,
    lastSolve,
    timerStatus,
    solvingTime,
    timerStatistics,
  } = useTimerStore();
  const { inspectionTime } = useTimer();
  const { device } = useDeviceMatch();
  const hideWhileSolving = settings.features.hideWhileSolving.status;
  const t = useTranslations("Index.HomePage");
  return (
    selectedCube && (
      <>
        <div
          id="touch"
          className="flex flex-col items-center justify-center grow"
        >
          {selectedCube && (
            <div className={`${timerStatusClasses[timerStatus]}`}>
              {hideWhileSolving && isSolving ? (
                <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                  {t("solving")}
                </span>
              ) : (
                <div className="relative flex flex-col gap-1 font-mono">
                  <div className="flex items-end justify-center">
                    {inspectionTime !== 16000 ? (
                      <>
                        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                          {Math.trunc(inspectionTime)}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-8xl md:text-9xl">
                          {formatTime(solvingTime).split(".")[0]}
                        </div>
                        <div className="text-7xl md:text-8xl">
                          .{formatTime(solvingTime).split(".")[1]}
                        </div>
                      </>
                    )}
                  </div>
                  {!lastSolve && timerStatus === "IDLE" ? (
                    <div className="text-xs text-center animate-pulse">
                      {device === "Desktop"
                        ? `${t("space-to-start")}`
                        : `${t("tap-to-start")}`}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
          <Confetti
            active={
              timerStatistics.global.best === lastSolve?.time &&
              !isSolving &&
              settings.alerts.bestTime.status
            }
            config={confettiConfig}
          />
          {lastSolve &&
            settings.features.quickActionButtons.status &&
            timerStatus === "IDLE" && <SolveOptions solve={lastSolve} />}
        </div>
      </>
    )
  );
}
