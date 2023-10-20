import { Solve } from "@/interfaces/Solve";
import { create } from "zustand";

type Modal = {
  status: boolean;
  setStatus: (status: boolean) => void;
  solve: Solve | null;
  setSolve: (solve: Solve | null) => void;
};

export const useSolvesStore = create<Modal>((set) => ({
  status: false,
  solve: null,
  setStatus: (status: boolean) => {
    set((state) => ({
      ...state,
      status: status,
    }));
  },
  setSolve: (solve) => {
    set({ solve });
  },
}));
