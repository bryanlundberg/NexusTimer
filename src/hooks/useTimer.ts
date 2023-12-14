import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useRef, useState } from "react";

export default function useTimer() {
  const {
    solvingTime,
    setSolvingTime,
    isSolving,
    setIsSolving,
    setTimerStatus,
    timerStatus,
  } = useTimerStore();

  const { settings, setSettingsOpen } = useSettingsModalStore();
  const [displayValue, setDisplayValue] = useState<any>("0.00");

  // user-settings
  const holdTimeRequired = settings.timer.holdToStart.status ? 500 : 0;

  const inspectionRequired = settings.timer.inspection.status;
  const inspectionDuration = 15000;

  const startSolveTime = useRef<number | null>(null);
  const solveTimeId = useRef<any>(null);

  const startInspectionTime = useRef<number | null>(null);
  const inspectionId = useRef<any>(null);
  const [inspectionTime, setInspectionTime] = useState<number | string>(
    inspectionDuration
  );

  const startHoldingTime = useRef<number | null>(null);
  const holdingTimeId = useRef<any>(null);
  const [holdingTime, setHoldingTime] = useState<number | null>(10);

  const relasedKey = useRef<boolean>(true);

  useEffect(() => {
    const startTimer = () => {
      setIsSolving(true);
      startSolveTime.current = Date.now() - 1;
      solveTimeId.current = setInterval(() => {
        if (startSolveTime.current) {
          const now = Date.now();
          const difference = now - startSolveTime.current;
          setSolvingTime(difference);
          setDisplayValue(difference);
        }
      });
    };

    const startInspection = () => {
      startInspectionTime.current = Date.now() - 1;
      inspectionId.current = setInterval(() => {
        if (startInspectionTime.current) {
          const now = Date.now();
          const difference =
            inspectionDuration - (now - startInspectionTime.current);
          setInspectionTime(difference / 1000);
          if (difference <= 0) {
            setDisplayValue(0); // reset display value
            resetTimer();
          }
        }
      });
    };

    const resetTimer = () => {
      clearInterval(holdingTimeId.current);
      clearInterval(solveTimeId.current);
      clearInterval(inspectionId.current);
      startHoldingTime.current = null;
      setInspectionTime(inspectionDuration);
      setIsSolving(false);
      holdingTimeId.current = null;
      solveTimeId.current = null;
      inspectionId.current = null;
    };

    const startHold = () => {
      if (!holdingTimeId.current) {
        startHoldingTime.current = Date.now() - 1;
        holdingTimeId.current = setInterval(() => {
          if (startHoldingTime.current) {
            const now = Date.now();
            const difference = now - startHoldingTime.current;
            setHoldingTime(difference);
          }
        }, 10);
      }
    };
    const removeInspection = () => {
      startInspectionTime.current = null;
      clearInterval(inspectionId.current);
      inspectionId.current = null;
      setInspectionTime(inspectionDuration);
      setIsSolving(false);
    };
    const removeHolding = () => {
      clearInterval(holdingTimeId.current);
      holdingTimeId.current = null;
      startHoldingTime.current = null;
      setHoldingTime(0);
      setIsSolving(false);
    };

    const stopTimer = () => {
      clearInterval(solveTimeId.current);
      solveTimeId.current = null;
      startSolveTime.current = null;
    };

    // MAIN HOLD CONTROL
    const handleHold = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        resetTimer();
        return;
      }

      if (event.code !== "Space") {
        return;
      }

      if (!inspectionId.current && isSolving && relasedKey.current) {
        stopTimer();
        resetTimer();
        relasedKey.current = false;
      }

      if (!relasedKey.current) return;

      if (!isSolving) {
        startHold();
      }
    };

    // MAIN RELEASE CONTROL
    const handleRelease = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        resetTimer();
        return;
      }

      if (event.code !== "Space") {
        return;
      }

      relasedKey.current = true;
      if (!holdingTimeId.current) return;

      // verificar si corresponde a comenzar la inspeccion

      if (!inspectionId.current && inspectionRequired) {
        startInspection();
        removeHolding();
        return;
      }

      if (inspectionId.current && inspectionRequired) {
        removeInspection();
        removeHolding();
        startTimer();
        return;
      }

      if (!inspectionRequired) {
        removeInspection();
        removeHolding();
        startTimer();
        return;
      }
    };

    const closeModal = () => {
      setSettingsOpen(false);
    };

    window.addEventListener("popstate", closeModal);
    window.addEventListener("keydown", handleHold);
    window.addEventListener("keyup", handleRelease);

    return () => {
      window.removeEventListener("keydown", handleHold);
      window.removeEventListener("keyup", handleRelease);
      window.removeEventListener("popstate", closeModal);
    };
  }, [
    holdingTime,
    holdTimeRequired,
    isSolving,
    setIsSolving,
    setSettingsOpen,
    setSolvingTime,
    inspectionRequired,
  ]);

  return {
    timerStatus,
    displayValue,
    inspectionTime,
    holdingTime,
  };
}
