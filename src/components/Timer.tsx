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
  } = useTimerStore();

  const { settings } = useSettingsModalStore();

  const holdTimeRequired = settings.timer.holdToStart.status ? 500 : 0;
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");
  const endTimeRef = useRef<number>(0);
  const holdingTimeRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const runningTimeId = useRef<any>(null);
  const isSolving = useRef<boolean>(false);
  const isHolding = useRef<boolean>(false);

  const handleHold = (event: KeyboardEvent) => {
    if (event.code === "Space" || event.code === "Escape") {
      if (isSolving.current) {
        if (event.code === "Escape") {
          clearInterval(runningTimeId.current);
          isSolving.current = false;
          setLastSolve(null);
          startTime.current = 0;
          holdingTimeRef.current = 0;
          setTimerStatus("idle");
          setSolvingTime(0);
          return;
        }
        clearInterval(runningTimeId.current);
        isSolving.current = false;
        if (selectedCube !== null && scramble) {
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
              cubeId: selectedCube?.id,
              solve: lastSolve,
            });
            setCubes(newCubes);
            const currectCube = findCube({ cubeId: selectedCube.id });
            if (currectCube) setSelectedCube(currectCube);
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
    if (event.code === "Space") {
      const now = Date.now();
      const difference: number = now - holdingTimeRef.current;

      if (isHolding.current && !isSolving.current) {
        if (difference >= holdTimeRequired) {
          isSolving.current = true;
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
          isSolving.current = false;
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

  const timerStatusClasses = {
    idle: "text-stone-50",
    holdingKey: "text-pink-600",
    solving: "text-stone-50",
    ready: "text-emerald-400",
  };

  return (
    <>
      <section className="flex flex-col items-center justify-center grow">
        <div
          className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-mono select-none ${timerStatusClasses[timerStatus]}`}
        >
          {formatTime(solvingTime)}
        </div>
        {lastSolve &&
          settings.features.quickActionButtons.status &&
          timerStatus === "idle" && <SolveOptions solve={lastSolve} />}
      </section>
    </>
  );
}
