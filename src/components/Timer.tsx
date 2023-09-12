import { useEffect, useRef, useState } from "react";
import SolveOptions from "./SolveOptions";
import { stringify } from "querystring";

interface Solve {
  scramble: string;
  startTime: number;
  endTime: number;
}

export default function Timer() {
  const [solvingTime, setSolvingTime] = useState(0);
  const holdingTimeRef = useRef<number>(0);
  const startTime = useRef<number>(0);
  const runningTimeId = useRef<any>(null);
  const [solves, setSolves] = useState<Solve[]>([]);
  const delayHold = useRef<number>(1000);

  const isSolving = useRef<boolean>(false);
  const isHoldingSpace = useRef<boolean>(false);

  const handleSpaceKeyDown = (event: KeyboardEvent) => {
    if (event.code !== "Space") return;
    console.log("Space key down");
    const now = Date.now();
    if (!isHoldingSpace.current && !isSolving.current) {
      holdingTimeRef.current = now;
      isHoldingSpace.current = true;
      return;
    }

    if (!isHoldingSpace.current && isSolving.current) {
      clearInterval(runningTimeId.current);
      isSolving.current = false;
      return;
    }

    // if (startTime.current > 0) {
    //   console.log("stop");

    //   const lastSolve: Solve = {
    //     startTime: startTime.current,
    //     endTime: Date.now(),
    //     scramble: "jgfslkhgsd",
    //   };
    //   startTime.current = 0;
    //   holdingTimeRef.current = 0;
    //   clearInterval(runningTimeId.current);
    //   setSolves([...solves, lastSolve]);
    // }
  };

  const handleSpaceKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      const now = Date.now();
      const difference = now - holdingTimeRef.current;
      console.log(difference);
      if (isHoldingSpace.current && !isSolving.current) {
        if (difference >= delayHold.current) {
          isSolving.current = true;
          isHoldingSpace.current = false;
          startTime.current = Date.now();
          runningTimeId.current = setInterval(() => {
            setSolvingTime(Date.now() - (startTime.current || 0));
            console.log(solvingTime);
          });
          return;
        }
      }

      if (difference <= delayHold.current) {
        isSolving.current = false;
        isHoldingSpace.current = false;
        holdingTimeRef.current = 0;
      }

      // if (now - holdingTimeRef.current <= delayHold.current) {
      //   console.log("early", now - (holdingTimeRef.current || 0));
      //   holdingTimeRef.current = 0;
      // } else if (now - (holdingTimeRef.current || 0) >= delayHold.current) {
      //   console.log("readyyy", now - (holdingTimeRef.current || 0));
      //   startTime.current = now;
      //   runningTimeId.current = setInterval(() => {
      //     setSolvingTime(now - (startTime.current || 0));
      //   });
      // }
    }
  };

  console.log(solvingTime);

  useEffect(() => {
    console.log("Effect setup");
    window.addEventListener("keydown", handleSpaceKeyDown);
    window.addEventListener("keyup", handleSpaceKeyUp);
  }, []);

  return (
    <>
      {/* Timer */}
      <section className="flex flex-col items-center justify-center">
        <div className="text-9xl font-mono">
          {(solvingTime / 1000).toFixed(3)}
        </div>
        <SolveOptions />
      </section>
    </>
  );
}
