import { create } from "zustand";


interface SolvesFiltersProps {
  isOpenMoveSolvesDialog: boolean;
  handleChangeIsOpenMoveSolvesDialog: () => void;
}

export const useSolveFiltersStore = create<SolvesFiltersProps>((set) => ({
  isOpenMoveSolvesDialog: false,
  handleChangeIsOpenMoveSolvesDialog: () => {
    set((prev) => ({
      ...prev,
      isOpenMoveSolvesDialog: !prev.isOpenMoveSolvesDialog,
    }));
  },
}));
