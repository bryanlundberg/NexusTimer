import { useEffect, useCallback } from "react";
import { useTimerStore } from "@/store/timerStore";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { TimerStatus } from "@/enums/TimerStatus";
import useTimerControls from "./useTimerControls";
import useInspection from "./useInspection";
import useHoldToStart from "./useHoldToStart";
import useSolveData from "./useSolveData";
import useEventHandlers from "./useEventHandlers";

export default function useTimer() {
  const {
    isSolving,
    setTimerStatus,
    selectedCube,
    setTimerStatistics,
  } = useTimerStore();

  const { settings } = useSettingsModalStore();
  const inspectionRequired = settings.timer.inspection.status;

  const { startTimer, resetTimer, stopTimer, startSolveTime } = useTimerControls();
  const { inspectionTime, startInspection, removeInspection, inspectionId } = useInspection();
  const { startHold, removeHolding, holdingTime, holdTimeRequired, holdingTimeId } = useHoldToStart();
  const { saveSolveData } = useSolveData();

  // MAIN HOLD CONTROL
  const handleHold = useCallback((isReleased: boolean) => {
    if (!selectedCube) return;
    if (isSolving && isReleased) {
      stopTimer();
      saveSolveData(startSolveTime.current as number);
      resetTimer();
    }
    if (!isReleased) return;
    if (!isSolving) {
      startHold();
    }
  }, [isSolving, resetTimer, saveSolveData, selectedCube, startHold, startSolveTime, stopTimer]);

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
  useEventHandlers(handleHold, handleRelease, resetTimer);

  useEffect(() => {
    if (selectedCube && !isSolving) setTimerStatistics();
  }, [selectedCube, isSolving, setTimerStatistics]);

  return {
    inspectionTime,
  };
}
