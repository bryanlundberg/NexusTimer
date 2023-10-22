import { useEffect, useRef, useState } from "react";
import { Solve } from "@/interfaces/Solve";
import { TimerStatus } from "@/interfaces/TimerStatus";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import addSolve from "@/lib/addSolve";
import findCube from "@/lib/findCube";
import SolveOptions from "./SolveOptions";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import formatTime from "@/lib/formatTime";
import translation from "@/translations/global.json";

const timerStatusClasses = {
  idle: "light:text-neutral-900 dark:text-white",
  holdingKey: "light:text-pink-600 dark:text-pink-600",
  solving: "light:text-neutral-700 dark:text-slate-200",
  ready: "text-emerald-400",
};

export default function Timer() {
  const {
    selectedCube,
    scramble,
    setNewScramble,
    setCubes,
    setSelectedCube,
    lastSolve,
    setLastSolve,
    solvingTime,
    setSolvingTime,
    isSolving,
    setIsSolving,
  } = useTimerStore();

  const { settings, lang } = useSettingsModalStore();

  const holdTimeRequired = settings.timer.holdToStart.status ? 500 : 0;
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");
  const endTimeRef = useRef<number>(0);
  const holdingTimeRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const runningTimeId = useRef<any>(null);
  const isHolding = useRef(false);
  const isReleased = useRef(true);
  const hideWhileSolving = settings.features.hideWhileSolving.status;

  const handleHold = (event: KeyboardEvent) => {
    if ((selectedCube && event.code === "Space") || event.code === "Escape") {
      if (event.code === "Escape") {
        clearInterval(runningTimeId.current);
        setIsSolving(false);
        isReleased.current = false;
        startTime.current = 0;
        holdingTimeRef.current = 0;
        setLastSolve(null);
        setTimerStatus("idle");
        setSolvingTime(0);
        return;
      }

      if (isSolving) {
        clearInterval(runningTimeId.current);
        setIsSolving(false);
        isReleased.current = false;

        if (selectedCube && scramble) {
          const lastSolve: Solve = {
            id: genId(),
            startTime: startTime.current,
            endTime: endTimeRef.current,
            scramble: scramble,
            bookmark: false,
            time: solvingTime,
            dnf: false,
            plus2: false,
            rating: Math.floor(Math.random() * 20) + scramble.length,
            category: selectedCube.category,
            cubeId: selectedCube.id,
          };

          setLastSolve(lastSolve);

          if (selectedCube) {
            const newCubes = addSolve({
              cubeId: selectedCube.id,
              solve: lastSolve,
            });

            setCubes(newCubes);

            const currentCube = findCube({ cubeId: selectedCube.id });

            if (currentCube) setSelectedCube(currentCube);
          }

          setNewScramble(selectedCube);
        }

        startTime.current = 0;
        holdingTimeRef.current = 0;
        setTimerStatus("idle");
        return;
      }

      const now = Date.now();
      const difference = now - holdingTimeRef.current;

      if (!isReleased.current) return;

      if (!isHolding.current) {
        holdingTimeRef.current = now;
        isHolding.current = true;

        if (settings.timer.holdToStart.status) {
          setTimerStatus("holdingKey");
        } else {
          setTimerStatus("ready");
        }
      } else {
        if (difference >= holdTimeRequired) {
          setTimerStatus("ready");
        }
      }
    }
  };

  const handleRelease = (event: KeyboardEvent) => {
    if (event.code === "Space" || event.code === "Escape") {
      isReleased.current = true;
      if (event.code === "Escape") return;

      const now = Date.now();
      const difference: number = now - holdingTimeRef.current;

      if (isHolding.current && !isSolving) {
        if (difference >= holdTimeRequired) {
          setIsSolving(true);
          isHolding.current = false;
          holdingTimeRef.current = 0;
          startTime.current = Date.now();
          runningTimeId.current = setInterval(() => {
            endTimeRef.current = Date.now();
            setSolvingTime(endTimeRef.current - (startTime.current || 0));
          });
          setTimerStatus("solving");
          return;
        }

        if (difference <= holdTimeRequired) {
          setIsSolving(false);
          isHolding.current = false;
          holdingTimeRef.current = 0;
          setTimerStatus("idle");
          return;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleHold);
    window.addEventListener("keyup", handleRelease);
    return () => {
      window.removeEventListener("keydown", handleHold);
      window.removeEventListener("keyup", handleRelease);
    };
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center grow">
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
