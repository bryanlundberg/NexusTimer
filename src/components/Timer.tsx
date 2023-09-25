import { useEffect, useRef, useState } from "react";
import { Solve } from "@/interfaces/Solve";
import { TimerStatus } from "@/interfaces/TimerStatus";
import genId from "@/lib/genId";
import { useTimerStore } from "@/store/timerStore";
import addSolve from "@/lib/addSolve";
import findCube from "@/lib/findCube";

export default function Timer() {
  const { selectedCube, scramble, setNewScramble, setCubes, setSelectedCube } =
    useTimerStore();

  const [solvingTime, setSolvingTime] = useState<number>(0);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");
  const endTimeRef = useRef<number>(0);
  const holdingTimeRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const runningTimeId = useRef<any>(null);
  const delayHold = useRef<number>(500);
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
      if (selectedCube !== null && scramble) {
        const lastSolve: Solve = {
          id: genId(),
          startTime: startTime.current,
          endTime: endTimeRef.current,
          scramble: scramble,
          bookmark: false,
          time: solvingTime,
          rating: Math.floor(Math.random() * 20) + scramble.length,
          category: selectedCube.category,
          cubeId: selectedCube.id,
        };

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
            endTimeRef.current = Date.now();
            setSolvingTime(endTimeRef.current - (startTime.current || 0));
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
    window.addEventListener("keydown", handleSpaceKeyDown);
    window.addEventListener("keyup", handleSpaceKeyUp);
    return () => {
      window.removeEventListener("keydown", handleSpaceKeyDown);
      window.removeEventListener("keyup", handleSpaceKeyUp);
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
      {/* Timer */}
      <section className="grow flex flex-col justify-center items-center">
        <div
          className={`text-6xl sm:text-7xl md:text-8xl font-mono select-none ${timerStatusClasses[timerStatus]}`}
        >
          {(solvingTime / 1000).toFixed(3)}
        </div>
        {/* <SolveOptions /> */}
      </section>
    </>
  );
}
