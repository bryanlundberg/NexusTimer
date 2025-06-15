import { useCallback, useEffect } from "react";
import { TimerStatus } from "@/enums/TimerStatus";
import useTimerControls from "./useTimerControls";
import useInspection from "./useInspection";
import useHoldToStart from "./useHoldToStart";
import useEventHandlers from "./useEventHandlers";
import { Cube } from "@/interfaces/Cube";

interface UseTimerProps {
  isSolving: boolean;
  setTimerStatus: (status: TimerStatus) => void;
  selectedCube: Cube | null;
  setTimerStatistics: () => void;
  inspectionRequired: boolean;
  setIsSolving: (isSolving: boolean) => void;
  setSolvingTime: (time: number) => void;
  displayHint?: boolean;
  timerMode?: any;
  settings?: any;
  onFinishSolve: () => void;
}

export default function useTimer({
  isSolving,
  setTimerStatus,
  selectedCube,
  setTimerStatistics,
  inspectionRequired,
  setIsSolving,
  setSolvingTime,
  displayHint = false,
  timerMode = 'NORMAL',
  settings = { timer: { startCue: { status: false }, holdToStart: { status: false } } },
  onFinishSolve
}: UseTimerProps) {

  const { startTimer, resetTimer, stopTimer } = useTimerControls({
    setSolvingTime,
    setIsSolving,
    setTimerStatus
  });

  const { inspectionTime, startInspection, removeInspection, inspectionId } = useInspection({
    setTimerStatus,
    setSolvingTime,
    settings
  });

  const { startHold, removeHolding, holdingTime, holdTimeRequired, holdingTimeId } = useHoldToStart({
    setTimerStatus,
    settings
  });

  // MAIN HOLD CONTROL
  const handleHold = useCallback((isReleased: boolean) => {
    if (!selectedCube) return;
    if (isSolving && isReleased) {
      stopTimer();
      setTimerStatus(TimerStatus.IDLE);
      requestAnimationFrame(() => {
        onFinishSolve();
        resetTimer();
      });
    }
    if (!isReleased) return;
    if (!isSolving) {
      startHold();
    }
  }, [isSolving, onFinishSolve, resetTimer, selectedCube, startHold, stopTimer, setTimerStatus]);

  // MAIN RELEASE CONTROL
  const handleRelease = useCallback(() => {
    if (!selectedCube) return;
    if (!holdingTimeId.current) return;
    if (typeof holdingTime === "number" && holdingTime <= holdTimeRequired) {
      removeHolding();
      inspectionId.current
        ? setTimerStatus(TimerStatus.SOLVING)
        : setTimerStatus(TimerStatus.IDLE);
      return;
    }
    if (!inspectionId.current && inspectionRequired) {
      startInspection();
      removeHolding();
      setTimerStatus(TimerStatus.SOLVING);
      return;
    }
    if (inspectionId.current && inspectionRequired) {
      removeInspection();
      removeHolding();
      setTimerStatus(TimerStatus.READY);
      startTimer();
      return;
    }
    if (!inspectionRequired) {
      removeInspection();
      removeHolding();
      setTimerStatus(TimerStatus.READY);
      startTimer();
      return;
    }
  }, [
    holdTimeRequired,
    holdingTime,
    holdingTimeId,
    inspectionId,
    inspectionRequired,
    removeHolding,
    removeInspection,
    selectedCube,
    setTimerStatus,
    startInspection,
    startTimer
  ]);

  // Event handlers
  useEventHandlers({
    displayHint,
    timerMode,
    handleHold,
    handleRelease,
    resetTimer
  });

  useEffect(() => {
    if (selectedCube && !isSolving) setTimerStatistics();
  }, [selectedCube, isSolving, setTimerStatistics]);

  return {
    inspectionTime
  };
}
