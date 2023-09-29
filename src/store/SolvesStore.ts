import { Solve } from "@/interfaces/Solve";
import { create } from "zustand";

type Modal = {
  status: boolean;
  setStatus: () => void;
  solve: Solve | null;
  setSolve: (solve: Solve | null) => void;
};

export const useSolvesStore = create<Modal>((set) => ({
  status: false,
  solve: null,
  setStatus: () => {
    set((state) => ({
      ...state,
      status: !state.status,
    }));
  },
  setSolve: (solve) => {
    set({ solve });
  },
}));
