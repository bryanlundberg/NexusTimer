import { Cube } from "@/interfaces/Cube";
import genScramble from "@/lib/timer/genScramble";
import { create } from "zustand";

type TimerStore = {
  cubes?: Cube[] | null;
  selectedCube?: Cube | null;
  scramble?: string;
  setNewScramble?: (cube: Cube) => void;
  setCubes?: (cubes: Cube[]) => void;
  setSelectedCube?: (cube: Cube) => void;
};

export const useTimerStore = create<TimerStore>((set) => ({
  selectedCube: null,
  scramble: "Pick a Cube to load a scramble.",
  cubes: null,
  setNewScramble: (cube: Cube) => {
    set((state) => ({
      ...state,
      scramble: genScramble(cube.category),
    }));
  },
  setCubes: (cubes: Cube[]) => {
    set((state) => ({ ...state, cubes }));
  },
  setSelectedCube: (cube: Cube) => {
    set((state) => ({ ...state, selectedCube: cube }));
  },
}));
