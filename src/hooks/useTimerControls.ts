import { useRef } from "react";
import { TimerStatus } from "@/enums/TimerStatus";

interface UseTimerControlsProps {
  setSolvingTime: (time: number) => void;
  setIsSolving: (isSolving: boolean) => void;
  setTimerStatus: (status: TimerStatus) => void;
}

export default function useTimerControls({
  setSolvingTime,
  setIsSolving,
  setTimerStatus,
}: UseTimerControlsProps) {

  const startSolveTime = useRef<number | null>(null);
  const solveTimeId = useRef<any>(null);

  const startTimer = () => {
    // Set state and references in a single batch to minimize renders
    setIsSolving(true);
    setTimerStatus(TimerStatus.SOLVING);

    startSolveTime.current = performance.now();

    const updateTimer = () => {
      if (!startSolveTime.current) return;

      const now = performance.now();
      const difference = now - startSolveTime.current;
      setSolvingTime(difference);

      solveTimeId.current = requestAnimationFrame(updateTimer);
    };

    solveTimeId.current = requestAnimationFrame(updateTimer);
  };

  const resetTimer = () => {
    if (solveTimeId.current) {
      cancelAnimationFrame(solveTimeId.current);
      solveTimeId.current = null;
    }
    startSolveTime.current = null;
    setIsSolving(false);
    setTimerStatus(TimerStatus.IDLE);
  };

  const stopTimer = () => {
    if (solveTimeId.current) {
      cancelAnimationFrame(solveTimeId.current);
      solveTimeId.current = null;
    }
    // Keep the final time by not resetting startSolveTime here
  };

  return {
    startTimer,
    resetTimer,
    stopTimer,
    startSolveTime,
    solveTimeId,
  };
}
