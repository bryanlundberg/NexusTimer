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
  const holdingTime = useRef<number>(0);

  const startTimer = () => {
    setIsSolving(true);
    startSolveTime.current = Date.now() - 1;
    solveTimeId.current = setInterval(() => {
      if (startSolveTime.current) {
        const now = Date.now();
        const difference = now - startSolveTime.current;
        setSolvingTime(difference);
      } else {
        clearInterval(solveTimeId.current);
      }
    });
  };

  const startInspection = () => {
    setTimerStatus("INSPECTING");
    startInspectionTime.current = Date.now() - 1;
    inspectionId.current = setInterval(() => {
      if (startInspectionTime.current) {
        const now = Date.now();
        const difference =
          inspectionDuration - (now - startInspectionTime.current);
        setInspectionTime(difference / 1000);
        if (difference <= 0) {
          setSolvingTime(0); // reset display value
          clearInterval(inspectionId.current);
          resetTimer();
        }
      }
    });
  };

  const resetTimer = () => {
    clearInterval(holdingTimeId.current);
    clearInterval(solveTimeId.current);
    clearInterval(inspectionId.current);
    setInspectionTime(inspectionDuration);
    setTimerStatus("IDLE");
    setIsSolving(false);
  };

  const startHold = () => {
    if (holdingTimeId.current) return;

    startHoldingTime.current = Date.now() - 1;
    holdingTimeId.current = setInterval(() => {
      if (startHoldingTime.current) {
        const now = Date.now();
        const difference = now - startHoldingTime.current;
        holdingTime.current = difference;

        console.log(holdingTime.current + " holding");

        if (holdingTime.current >= holdTimeRequired) {
          setTimerStatus("READY");
          clearInterval(holdingTimeId.current);
        }
        if (holdingTime.current < holdTimeRequired) {
          setTimerStatus("HOLDING");
        }
      } else {
        clearInterval(holdingTimeId.current);
      }
    }, 10);
  };

  const handleHold = (event: KeyboardEvent) => {
    if (event.code === "Escape") {
      resetTimer();
      return;
    }

    if (event.code !== "Space") {
      return;
    }

    if (isSolving) {
      //stop - save
    }

    if (!inspectionId.current && !inspectionRequired) {
      startHold();
      return;
    }
  };

  const handleRelease = (event: KeyboardEvent) => {
    if (event.code === "Escape") {
      resetTimer();
      return;
    }

    if (event.code !== "Space") {
      return;
    }

    // // verificar si corresponde a comenzar la inspeccion
    if (inspectionRequired && !inspectionId.current) {
      startInspection();
    }
    // // Verificar si corresponde a comenzar cronometro
    // if (inspectionRequired && inspectionId.current) {
    //   startTimer();
    // }
    // if (!inspectionRequired) {
    //   startTimer();
    // }
  };

  useEffect(() => {
    window.addEventListener("popstate", (event) => {
      setSettingsOpen(false);
    });

    window.addEventListener("keydown", handleHold);
    window.addEventListener("keyup", handleRelease);

    return () => {
      window.removeEventListener("keydown", handleHold);
      window.removeEventListener("keyup", handleRelease);
      window.removeEventListener("popstate", (event) => {
        setSettingsOpen(false);
      });
    };
  });

  return {
    timerStatus,
    displayValue,
    inspectionTime,
  };
}
