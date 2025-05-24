import { useRef } from "react";
import { useTimerStore } from "@/store/timerStore";
import { TimerStatus } from "@/enums/TimerStatus";

export default function useTimerControls() {
  const {
    setSolvingTime,
    setIsSolving,
    setTimerStatus,
  } = useTimerStore();

  const startSolveTime = useRef<number | null>(null);
  const solveTimeId = useRef<any>(null);

  const startTimer = () => {
    setIsSolving(true);
    setTimerStatus(TimerStatus.SOLVING);
    startSolveTime.current = Date.now() - 1;
    solveTimeId.current = setInterval(() => {
      if (startSolveTime.current) {
        const now = Date.now();
        const difference = now - startSolveTime.current;
        setSolvingTime(difference);
      }
    });
  };

  const resetTimer = () => {
    clearInterval(solveTimeId.current);
    solveTimeId.current = null;
    startSolveTime.current = null;
    setIsSolving(false);
    setTimerStatus(TimerStatus.IDLE);
  };

  const stopTimer = () => {
    clearInterval(solveTimeId.current);
    solveTimeId.current = null;
    startSolveTime.current = null;
  };

  return {
    startTimer,
    resetTimer,
    stopTimer,
    startSolveTime,
    solveTimeId,
  };
}
