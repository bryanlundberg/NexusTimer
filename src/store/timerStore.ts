import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import { Event } from "@/interfaces/cubeCollection";
import calcStatistics from "@/lib/calcStatistics";
import { cubeCollection } from "@/lib/const/cubeCollection";
import { defaultTimerStatistics } from "@/lib/const/defaultTimerStatistics";
import genScramble from "@/lib/timer/genScramble";
import { create } from "zustand";
import { TimerMode } from "@/enums/TimerMode";
import { TimerStatus } from "@/enums/TimerStatus";

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
  timerStatistics: DisplayTimerStatistics;
  timerMode: TimerMode.NORMAL | TimerMode.STACKMAT;
  isOpenDrawerNewCollection: boolean;
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
  setCustomScramble: (scramble: string) => void;
  setTimerStatistics: () => void;
  setTimerMode: (mode: TimerMode.NORMAL | TimerMode.STACKMAT) => void;
  setIsOpenDrawerNewCollection: (status: boolean) => void;
};

export const useTimerStore = create<TimerStore>((set) => ({
  selectedCube: null,
  scramble: null,
  cubes: null,
  event: "333",
  lastSolve: null,
  solvingTime: 0,
  isSolving: false,
  timerStatus: TimerStatus.IDLE,
  displayHint: false,
  zoomInScramble: false,
  hint: null,
  timerStatistics: {
    global: defaultTimerStatistics,
    session: defaultTimerStatistics,
    cubeSession: defaultTimerStatistics,
  },
  timerMode: TimerMode.NORMAL,
  isOpenDrawerNewCollection: false,
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
  setTimerMode: (mode: TimerMode.NORMAL | TimerMode.STACKMAT) => {
    set({ timerMode: mode });
  },
  setIsOpenDrawerNewCollection: (status: boolean) => {
    set({ isOpenDrawerNewCollection: status });
  },
}));
