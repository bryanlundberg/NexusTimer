import { useEffect, useRef, useState } from "react";
import SolveOptions from "./SolveOptions";
import { Solve } from "@/interfaces/Solve";
import { TimerStatus } from "@/interfaces/TimerStatus";

export default function Timer() {
  const [solvingTime, setSolvingTime] = useState<number>(0);
  const holdingTimeRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const runningTimeId = useRef<any>(null);
  const [solves, setSolves] = useState<Solve[]>([]);
  const delayHold = useRef<number>(500);

  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");

  const isSolving = useRef<boolean>(false);
  const isHoldingSpace = useRef<boolean>(false);

  const handleSpaceKeyDown = (event: KeyboardEvent) => {
    if (event.code !== "Space") return;
    const now = Date.now();
    const difference = now - (holdingTimeRef.current || 0);

    if (isHoldingSpace.current && difference >= delayHold.current) {
      setTimerStatus("ready");
    }

    if (!isHoldingSpace.current && !isSolving.current) {
      holdingTimeRef.current = now;
      isHoldingSpace.current = true;
      setTimerStatus("holdingKey");
      return;
    }

    if (!isHoldingSpace.current && isSolving.current) {
      clearInterval(runningTimeId.current);
      isSolving.current = false;
      const lastSolve: Solve = {
        startTime: startTime.current,
        endTime: Date.now(),
        scramble: "F' U' F2 U2 R2 U' R' F R'",
      };
      setSolves([...solves, lastSolve]);
      startTime.current = 0;
      holdingTimeRef.current = 0;
      setTimerStatus("idle");
      return;
    }
  };

  const handleSpaceKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      const now = Date.now();
      const difference: number = now - holdingTimeRef.current;

      if (isHoldingSpace.current && !isSolving.current) {
        if (difference >= delayHold.current) {
          isSolving.current = true;
          isHoldingSpace.current = false;
          holdingTimeRef.current = 0;
          startTime.current = Date.now();
          runningTimeId.current = setInterval(() => {
            setSolvingTime(Date.now() - (startTime.current || 0));
          });
          setTimerStatus("solving");
          return;
        }

        if (difference <= delayHold.current) {
          isSolving.current = false;
          isHoldingSpace.current = false;
          holdingTimeRef.current = 0;
          setTimerStatus("idle");
          return;
        }
      }
    }
  };

  useEffect(() => {
    console.log("Effect setup");
    window.addEventListener("keydown", handleSpaceKeyDown);
    window.addEventListener("keyup", handleSpaceKeyUp);
  }, []);

  const timerStatusClasses = {
    idle: "text-stone-50",
    holdingKey: "text-pink-600",
    solving: "text-stone-50",
    ready: "text-emerald-400",
  };

  return (
    <>
      {/* Timer */}
      <section className="flex flex-col items-center justify-center">
        <div
          className={`text-9xl font-mono ${timerStatusClasses[timerStatus]}`}
        >
          {(solvingTime / 1000).toFixed(3)}
        </div>
        <SolveOptions />
      </section>
    </>
  );
}
