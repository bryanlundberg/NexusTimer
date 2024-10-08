import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import { TimerStatus } from "@/interfaces/TimerStatus";
import { Event } from "@/interfaces/cubeCollection";
import calcStatistics from "@/lib/calcStatistics";
import { cubeCollection } from "@/lib/const/cubeCollection";
import { defaultTimerStatistics } from "@/lib/const/defaultTimerStatistics";
import genScramble from "@/lib/timer/genScramble";
import { create } from "zustand";

type TimerStore = {
  cubes: Cube[] | null;
  selectedCube: Cube | null;
  scramble: string | null;
  event: Event;
  lastSolve: Solve | null;
  solvingTime: number;
  isSolving: boolean;
  timerStatus: TimerStatus;
  displayHint: boolean;
  zoomInScramble: boolean;
  hint: CrossSolutions | null;
  initializing: boolean;
  timerStatistics: DisplayTimerStatistics;
  setNewScramble: (cube: Cube | null) => void;
  setCubes: (cubesDB: Cube[]) => void;
  setSelectedCube: (cube: Cube | null) => void;
  setLastSolve: (solve: Solve | null) => void;
  setSolvingTime: (newTime: number) => void;
  setIsSolving: (isSolving: boolean) => void;
  setTimerStatus: (timerStatus: TimerStatus) => void;
  setDisplayHint: (status: boolean) => void;
  setZoomInScramble: (status: boolean) => void;
  setHints: (solutions: CrossSolutions) => void;
  setInitializing: (status: boolean) => void;
  setCustomScramble: (scramble: string) => void;
  setTimerStatistics: () => void;
};

export const useTimerStore = create<TimerStore>((set: any) => ({
  selectedCube: null,
  scramble: null,
  cubes: null,
  event: "333",
  lastSolve: null,
  solvingTime: 0,
  isSolving: false,
  timerStatus: "IDLE",
  displayHint: false,
  zoomInScramble: false,
  hint: null,
  initializing: true,
  timerStatistics: {
    global: defaultTimerStatistics,
    session: defaultTimerStatistics,
    cubeSession: defaultTimerStatistics,
  },
  setNewScramble: (cube: Cube | null) => {
    set({ scramble: cube ? genScramble(cube.category) : null });
  },
  setCustomScramble: (scramble: string) => {
    set({ scramble: scramble });
  },
  setCubes: (cubesDB: Cube[]) => {
    set({ cubes: [...cubesDB] });
  },
  setSelectedCube: (cube: Cube | null) => {
    set((state: any) => {
      if (!cube || typeof cube !== "object") {
        return {
          ...state,
          event: null,
          selectedCube: null,
        };
      }

      const selectedEvent = cubeCollection.find(
        (item) => item.name === cube.category
      );
      return {
        ...state,
        event: selectedEvent?.event,
        selectedCube: cube,
      };
    });
  },
  setLastSolve: (solve: Solve | null) => {
    set({ lastSolve: solve });
  },
  setSolvingTime: (newTime: number) => {
    set({ solvingTime: newTime });
  },
  setIsSolving: (isSolving: boolean) => {
    set({ isSolving: isSolving });
  },
  setTimerStatus: (timerStatus: TimerStatus) => {
    set({ timerStatus });
  },
  setDisplayHint: (status: boolean) => {
    set({ displayHint: status });
  },
  setZoomInScramble: (status: boolean) => {
    set({ zoomInScramble: status });
  },
  setHints: (solutions: CrossSolutions) => {
    set({ hint: solutions });
  },
  setInitializing: (status: boolean) => {
    set({ initializing: status });
  },
  setTimerStatistics: () => {
    const { global, session, cubeSession } = calcStatistics({
      cubesDB: useTimerStore.getState().cubes,
      selectedCube: useTimerStore.getState().selectedCube,
    });
    set({
      timerStatistics: {
        global,
        session,
        cubeSession,
      },
    });
  },
}));
