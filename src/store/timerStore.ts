import { Cube } from "@/interfaces/Cube";
import { cubeCollection } from "@/lib/cubeCollection";
import genScramble from "@/lib/timer/genScramble";
import { create } from "zustand";

type TimerStore = {
  cubes: Cube[] | null;
  selectedCube: Cube | null;
  scramble: string | null;
  event: string;
  setNewScramble: (cube: Cube) => void;
  setCubes: (cubes: Cube[]) => void;
  setSelectedCube: (cube: Cube) => void;
};

export const useTimerStore = create<TimerStore>((set) => ({
  selectedCube: null,
  scramble: null,
  cubes: null,
  event: "333",
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
    set((state: any) => {
      const selectedEvent = cubeCollection.find(
        (item) => item.name === cube.category
      );
      return { ...state, event: selectedEvent?.event, selectedCube: cube };
    });
  },
}));
