import { useCallback } from "react";
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
  inspectionRequired: boolean;
  setIsSolving: (isSolving: boolean) => void;
  setSolvingTime: (time: number) => void;
  timerMode?: any;
  settings?: any;
  onFinishSolve: () => void;
}

export default function useTimer({
  isSolving,
  setTimerStatus,
  selectedCube,
  inspectionRequired,
  setIsSolving,
  setSolvingTime,
  timerMode = 'NORMAL',
  settings = { timer: { startCue: false, holdToStart: false } },
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

  const resetAll = useCallback(() => {
    if (inspectionId.current) removeInspection();
    resetTimer();
  }, [inspectionId, removeInspection, resetTimer]);

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
    if (!isReleased && !inspectionId.current) return;
    if (!isSolving) {
      if (!inspectionId.current && inspectionRequired) {
        startInspection();
        setTimerStatus(TimerStatus.INSPECTING);
        return;
      }
      startHold();
    }
  }, [isSolving, onFinishSolve, resetTimer, selectedCube, startHold, stopTimer, setTimerStatus, inspectionId, inspectionRequired, startInspection]);

  // MAIN RELEASE CONTROL
  const handleRelease = useCallback(() => {
    if (!selectedCube) return;
    if (!holdingTimeId.current) return;
    if (typeof holdingTime === "number" && holdingTime <= holdTimeRequired) {
      removeHolding();
      if (inspectionId.current) {
        setTimerStatus(TimerStatus.INSPECTING);
      } else {
        setTimerStatus(TimerStatus.IDLE);
      }
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
    startTimer
  ]);

  // Event handlers
  useEventHandlers({
    timerMode,
    handleHold,
    handleRelease,
    resetTimer: resetAll
  });

  return {
    inspectionTime,
    resetAll
  };
}
