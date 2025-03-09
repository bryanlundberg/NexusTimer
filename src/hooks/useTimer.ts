import { getAllCubes, getCubeById, saveCube } from "@/db/dbOperations";
import { Solve } from "@/interfaces/Solve";
import genId from "@/lib/genId";
import { useSettingsModalStore } from "@/store/SettingsModalStore";
import { useTimerStore } from "@/store/timerStore";
import { useEffect, useRef, useState } from "react";
import { TimerMode } from "@/enums/TimerMode";

export default function useTimer() {
  const {
    solvingTime,
    setSolvingTime,
    isSolving,
    setIsSolving,
    setTimerStatus,
    setNewScramble,
    selectedCube,
    scramble,
    setCubes,
    setSelectedCube,
    setLastSolve,
    displayHint,
    cubes,
    timerMode,
    setTimerStatistics,
  } = useTimerStore();

  const { settings } = useSettingsModalStore();
  const holdTimeRequired = settings.timer.holdToStart.status ? 500 : 0;
  const inspectionRequired = settings.timer.inspection.status;
  const inspectionDuration = 16000;
  const startSolveTime = useRef<number | null>(null);
  const solveTimeId = useRef<any>(null);
  const startInspectionTime = useRef<number | null>(null);
  const inspectionId = useRef<any>(null);
  const [inspectionTime, setInspectionTime] =
    useState<number>(inspectionDuration);
  const startHoldingTime = useRef<number | null>(null);
  const holdingTimeId = useRef<any>(null);
  const [holdingTime, setHoldingTime] = useState<number | null>(10);
  const relasedKey = useRef<boolean>(true);

  useEffect(() => {
    if (timerMode === TimerMode.STACKMAT) return;
    const startTimer = () => {
      setIsSolving(true);
      setTimerStatus("SOLVING");
      startSolveTime.current = Date.now() - 1;
      solveTimeId.current = setInterval(() => {
        if (startSolveTime.current) {
          const now = Date.now();
          const difference = now - startSolveTime.current;
          setSolvingTime(difference);
        }
      });
    };

    const startInspection = () => {
      startInspectionTime.current = Date.now() - 1;
      setTimerStatus("INSPECTING");
      let reproduced8 = false;
      let reproduced12 = false;
      inspectionId.current = setInterval(() => {
        if (startInspectionTime.current) {
          const now = Date.now();
          const difference =
            inspectionDuration - (now - startInspectionTime.current);

          const timeRemaining = difference / 1000;

          if (settings.timer.startCue.status) {
            if (timeRemaining <= 9 && !reproduced8) {
              reproduced8 = true;
              const audio12 = new Audio("./sounds/en/8.wav");
              audio12.play();
            }

            if (timeRemaining <= 4 && !reproduced12) {
              reproduced12 = true;
              const audio12 = new Audio("./sounds/en/12.wav");
              audio12.play();
            }
          }

          setInspectionTime(timeRemaining);
          if (difference <= 0) {
            setTimerStatus("INSPECTING");
            setSolvingTime(0);
            resetTimer();
            const audio = new Audio("./sounds/en/reset.wav");
            audio.play();
          }
        }
      }, 10);
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
      setTimerStatus("IDLE");
    };

    const startHold = () => {
      if (!holdingTimeId.current) {
        startHoldingTime.current = Date.now() - 1;
        holdingTimeId.current = setInterval(() => {
          if (startHoldingTime.current) {
            const now = Date.now();
            const difference = now - startHoldingTime.current;
            setHoldingTime(difference);
            if (difference >= holdTimeRequired) {
              setTimerStatus("READY");
            } else {
              setTimerStatus("HOLDING");
            }
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

    const stopTimer = async () => {
      clearInterval(solveTimeId.current);
      // save solve
      if (
        selectedCube &&
        scramble &&
        typeof startSolveTime.current === "number"
      ) {
        const lastSolve: Solve = {
          id: genId(),
          startTime: startSolveTime.current,
          endTime: Date.now(),
          scramble: scramble,
          bookmark: false,
          time: solvingTime,
          dnf: false,
          plus2: false,
          rating: Math.floor(Math.random() * 20) + scramble.length,
          cubeId: selectedCube.id,
          comment: "",
        };

        setLastSolve({ ...lastSolve });

        const cube = cubes?.find((u) => u.id === selectedCube.id);

        if (cube) {
          await saveCube({
            ...cube,
            solves: {
              ...cube.solves,
              session: [...cube.solves.session, lastSolve],
            },
          });
        }

        const updatedCubes = await getAllCubes();
        setCubes(updatedCubes);

        const updatedCube = await getCubeById(selectedCube.id);
        setSelectedCube(updatedCube);
      }
      setNewScramble(selectedCube);
      solveTimeId.current = null;
      startSolveTime.current = null;
    };

    // MAIN HOLD CONTROL
    const handleHold = () => {
      if (!selectedCube) return;
      if (isSolving && relasedKey.current) {
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
    const handleRelease = () => {
      if (!selectedCube) return;
      relasedKey.current = true;
      if (!holdingTimeId.current) return;
      if (typeof holdingTime === "number" && holdingTime <= holdTimeRequired) {
        removeHolding();
        inspectionId.current
          ? setTimerStatus("SOLVING")
          : setTimerStatus("IDLE");
        return;
      }
      if (!inspectionId.current && inspectionRequired) {
        startInspection();
        removeHolding();
        setTimerStatus("SOLVING");
        return;
      }
      if (inspectionId.current && inspectionRequired) {
        removeInspection();
        removeHolding();
        setTimerStatus("READY");
        startTimer();
        return;
      }
      if (!inspectionRequired) {
        removeInspection();
        removeHolding();
        setTimerStatus("READY");
        startTimer();
        return;
      }
    };

    const handleTouchStart = (event: TouchEvent): void => {
      event.preventDefault();
      const quickActionButtons = document.querySelector(
        "#quick-action-buttons"
      ) as HTMLElement | null;
      if (
        quickActionButtons &&
        quickActionButtons.contains(event.target as Node)
      ) {
        // nothing
      } else {
        handleHold();
      }
    };

    const handleTouchEnd = (event: TouchEvent): void => {
      event.preventDefault();
      handleRelease();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        resetTimer();
        return;
      }
      if (event.code !== "Space") {
        return;
      }
      handleHold();
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        resetTimer();
        return;
      }
      if (event.code !== "Space") {
        return;
      }
      handleRelease();
    };

    if (displayHint) return;

    const touchElements = document.querySelectorAll("#touch");

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    touchElements.forEach((element: any) => {
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchend", handleTouchEnd);
    });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      touchElements.forEach((element: any) => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
      });
    };
  }, [
    holdingTime,
    holdTimeRequired,
    isSolving,
    setIsSolving,
    setSolvingTime,
    inspectionRequired,
    selectedCube,
    setCubes,
    scramble,
    setLastSolve,
    setNewScramble,
    setSelectedCube,
    solvingTime,
    setTimerStatus,
    displayHint,
    cubes,
    settings.timer.startCue.status,
    timerMode,
  ]);

  useEffect(() => {
    if (selectedCube && !isSolving) {
      setTimerStatistics();
    }
  }, [selectedCube, isSolving, setTimerStatistics]);

  return {
    inspectionTime,
  };
}
