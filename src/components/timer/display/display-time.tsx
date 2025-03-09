import { Solve } from "@/interfaces/Solve";
import { TimerStatus } from "@/interfaces/TimerStatus";
import formatTime from "@/lib/formatTime";
import { useTimerStore } from "@/store/timerStore";
import { useTranslations } from "next-intl";
import { TimerMode } from "@/enums/TimerMode";

interface DisplayTimeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  isSolving: boolean;
  lastSolve: Solve | null;
  timerStatus: TimerStatus;
  solvingTime: number;
  device: any;
  inspectionTime: number;
  hideWhileSolving: boolean;
}

const timerStatusClasses = {
  IDLE: "light:text-neutral-900 dark:text-white",
  HOLDING: "light:text-pink-600 dark:text-pink-600",
  SOLVING: "light:text-neutral-700 dark:text-slate-200",
  READY: "text-emerald-400",
  INSPECTING: "text-orange-500",
};

export default function DisplayTime({
  className,
  isSolving,
  lastSolve,
  timerStatus,
  solvingTime,
  device,
  inspectionTime,
  hideWhileSolving,
  ...rest
}: DisplayTimeProps) {
  const t = useTranslations("Index.HomePage");
  const { timerMode } = useTimerStore();
  return (
    <>
      <div className={`${timerStatusClasses[timerStatus]}`} {...rest}>
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
                  {lastSolve?.plus2 && !isSolving && (
                    <span className="text-destructive">+2</span>
                  )}
                </>
              )}
            </div>
            {!lastSolve && timerStatus === "IDLE" ? (
              <div className="text-xs text-center animate-pulse">
                {timerMode === TimerMode.NORMAL
                  ? device === "Desktop"
                    ? `${t("space-to-start")}`
                    : `${t("tap-to-start")}`
                  : null}

                {timerMode === TimerMode.STACKMAT &&
                  "Start your stackmat to begging the clock"}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
