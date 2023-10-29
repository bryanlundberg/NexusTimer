import { Cube } from "@/interfaces/Cube";
import { Solve } from "@/interfaces/Solve";
import { cubeCollection } from "@/lib/cubeCollection";
import genScramble from "@/lib/timer/genScramble";
import { create } from "zustand";

type TimerStore = {
  cubes: Cube[] | null;
  selectedCube: Cube | null;
  scramble: string | null;
  event: string;
  lastSolve: Solve | null;
  solvingTime: number;
  isSolving: boolean;
  setNewScramble: (cube: Cube) => void;
  setCubes: (cubes: Cube[]) => void;
  setSelectedCube: (cube: Cube) => void;
  setLastSolve: (solve: Solve | null) => void;
  setSolvingTime: (newTime: number) => void;
  setIsSolving: (isSolving: boolean) => void;
};

export const useTimerStore = create<TimerStore>((set) => ({
  selectedCube: null,
  scramble: null,
  cubes: null,
  event: "333",
  lastSolve: null,
  solvingTime: 0,
  isSolving: false,
  setNewScramble: (cube: Cube | null) => {
    set((state) => ({
      ...state,
      scramble: cube ? genScramble(cube.category) : null,
    }));
  },
  setCubes: (cubes: Cube[]) => {
    set((state) => ({ ...state, cubes }));
  },
  setSelectedCube: (cube: Cube | null) => {
    set((state: any) => {
      if (!cube) {
        return { ...state, event: null, selectedCube: null };
      }

      const selectedEvent = cubeCollection.find(
        (item) => item.name === cube.category
      );
      return { ...state, event: selectedEvent?.event, selectedCube: cube };
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
}));
