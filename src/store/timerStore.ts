import { Cube } from '@/interfaces/Cube';
import { Solve } from '@/interfaces/Solve';
import { Event } from '@/interfaces/cubeCollection';
import { cubeCollection } from '@/lib/const/cubeCollection';
import { defaultTimerStatistics } from '@/lib/const/defaultTimerStatistics';
import genScramble from '@/lib/timer/genScramble';
import { create } from 'zustand';
import { TimerMode } from '@/enums/TimerMode';
import { TimerStatus } from '@/enums/TimerStatus';

type TimerStore = {
  cubes: Cube[] | null;
  selectedCube: Cube | null;
  scramble: string | null;
  event: Event;
  lastSolve: Solve | null;
  solvingTime: number;
  isSolving: boolean;
  timerStatus: TimerStatus;
  zoomInScramble: boolean;
  hint: CrossSolutions | null;
  timerStatistics: DisplayTimerStatistics;
  timerMode: TimerMode.NORMAL | TimerMode.STACKMAT | TimerMode.VIRTUAL | TimerMode.SMART_CUBE;
  isOpenDrawerNewCollection: boolean;
  setNewScramble: (cube: Cube | null) => void;
  setCubes: (cubesDB: Cube[]) => void;
  setSelectedCube: (cube: Cube | null) => void;
  setLastSolve: (solve: Solve | null) => void;
  setSolvingTime: (newTime: number) => void;
  setIsSolving: (isSolving: boolean) => void;
  setTimerStatus: (timerStatus: TimerStatus) => void;
  setZoomInScramble: (status: boolean) => void;
  setHints: (solutions: CrossSolutions) => void;
  setCustomScramble: (scramble: string) => void;
  setTimerStatistics: (stats: DisplayTimerStatistics) => void;
  setTimerMode: (mode: TimerMode.NORMAL | TimerMode.STACKMAT | TimerMode.VIRTUAL | TimerMode.SMART_CUBE) => void;
  setIsOpenDrawerNewCollection: (status: boolean) => void;
  reset: () => void;
};

export const useTimerStore = create<TimerStore>((set) => ({
  selectedCube: null,
  scramble: null,
  cubes: null,
  event: '333',
  lastSolve: null,
  solvingTime: 0,
  isSolving: false,
  timerStatus: TimerStatus.IDLE,
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
    set({ cubes: cubesDB });
  },
  setSelectedCube: (cube: Cube | null) => {
    set((state) => {
      if (!cube || typeof cube !== 'object') {
        return {
          event: null,
          selectedCube: null,
        };
      }

      const selectedEvent = cubeCollection.find(
        (item) => item.name === cube.category
      );
      return {
        event: selectedEvent?.event,
        selectedCube: cube,
        cubes: state.cubes?.map((item) => item.id === cube.id ? cube : item),
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
  setZoomInScramble: (status: boolean) => {
    set({ zoomInScramble: status });
  },
  setHints: (solutions: CrossSolutions) => {
    set({ hint: solutions });
  },
  setTimerStatistics: (stats) => {
    set({ timerStatistics: stats });
  },
  setTimerMode: (mode: TimerMode.NORMAL | TimerMode.STACKMAT | TimerMode.VIRTUAL | TimerMode.SMART_CUBE) => {
    set({ timerMode: mode });
  },
  setIsOpenDrawerNewCollection: (status: boolean) => {
    set({ isOpenDrawerNewCollection: status });
  },
  reset: () => set({
    isSolving: false,
    timerStatus: TimerStatus.IDLE,
    zoomInScramble: false,
    hint: null,
    isOpenDrawerNewCollection: false,
  })
}));
