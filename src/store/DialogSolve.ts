import { Solve } from "@/interfaces/Solve";
import { create } from "zustand";

interface DialogSolveProps {
  solve: Solve | null;
  isDialogSolveOpen: boolean;
  handleOpenDialogSolve: ({ solve }: { solve: Solve }) => void;
  handleCloseDialogSolve: () => void;
}

export const useDialogSolve = create<DialogSolveProps>((set) => ({
  solve: null,
  isDialogSolveOpen: false,
  handleOpenDialogSolve: ({ solve }: { solve: Solve }) => {
    set((prev) => ({ ...prev, isDialogSolveOpen: true, solve: solve }));
  },
  handleCloseDialogSolve: () => {
    set((prev) => ({ ...prev, isDialogSolveOpen: false, solve: null }));
  },
}));
