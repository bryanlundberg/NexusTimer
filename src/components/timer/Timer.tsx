import { useTimerStore } from "@/store/timerStore";
import SolveOptions from "./SolveOptions";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import translation from "@/translations/global.json";
import useTimer from "@/hooks/useTimer";

const timerStatusClasses = {
  idle: "light:text-neutral-900 dark:text-white",
  holdingKey: "light:text-pink-600 dark:text-pink-600",
  solving: "light:text-neutral-700 dark:text-slate-200",
  ready: "text-emerald-400",
};

export default function Timer() {
  const { lang, settings } = useSettingsModalStore();
  const { selectedCube, isSolving, lastSolve } = useTimerStore();
  const { timerStatus, hideWhileSolving, solvingTime } = useTimer();

  if (selectedCube === null) return;

  return (
    <>
      <div
        id="touch"
        className="flex flex-col items-center justify-center grow"
      >
        {selectedCube && (
          <div
            className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-mono select-none ${timerStatusClasses[timerStatus]}`}
          >
            {hideWhileSolving && isSolving ? (
              <span className="sm:text-5xl md:text-6xl lg:text-7xl">
                {translation.timer["solving"][lang]}
              </span>
            ) : (
              formatTime(solvingTime)
            )}
          </div>
        )}
        {lastSolve &&
          settings.features.quickActionButtons.status &&
          timerStatus === "idle" && <SolveOptions solve={lastSolve} />}
      </div>
    </>
  );
}
