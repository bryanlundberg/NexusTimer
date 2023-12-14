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
        } else {
          return clearInterval(solveTimeId.current);
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
          console.log(difference + " inspection");
          if (difference <= 0) {
            setDisplayValue(0); // reset display value
            resetTimer();
            return clearInterval(inspectionId.current);
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
    };

    const startHold = () => {
      if (!holdingTimeId.current) {
        startHoldingTime.current = Date.now() - 1;
        holdingTimeId.current = setInterval(() => {
          if (startHoldingTime.current) {
            const now = Date.now();
            const difference = now - startHoldingTime.current;
            setHoldingTime(difference);
            console.log(difference);
          }
        }, 10);
      }
    };
    const removeInspection = () => {
      startInspectionTime.current = null;
      clearInterval(inspectionId.current);
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

      // if (isSolving) {
      //   stopTimer();
      // }

      startHold();

      console.log(holdingTimeId.current);

      // if (inspectionId.current || !inspectionRequired) {
      //   startHold();
      //   return;
      // }
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

      if (holdingTimeId.current) {
        removeHolding();
      }

      // // verificar si corresponde a comenzar la inspeccion
      // if (!inspectionId.current && inspectionRequired) {
      //   startInspection();
      // }

      // // verificar si corresponde a comenzar el cotronometro
      // if (inspectionId.current && inspectionRequired) {
      //   removeInspection();
      //   startTimer();
      // }

      // if (!inspectionRequired) {
      //   startTimer();
      // }
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
  ]);

  return {
    timerStatus,
    displayValue,
    inspectionTime,
    holdingTime,
  };
}
