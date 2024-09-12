import { Solve } from "@/interfaces/Solve";
import { create } from "zustand";

type Direction = "asc" | "desc";
type SortVariant = "date" | "time";

interface SolvesFiltersProps {
  displayingSolves: Solve[] | null;
  query: string;
  sortType: SortVariant;
  order: Direction;
  handleSearch: (query: string) => void;
  handleChangeOrder: (order: Direction) => void;
  handleChangeSortType: (sortType: SortVariant) => void;
}

export const useSolveFiltersStore = create<SolvesFiltersProps>((set) => ({
  displayingSolves: null,
  sortType: "date",
  order: "desc",
  query: "",
  handleSearch: (query: string) => {
    set((prev) => ({ ...prev, query }));
  },
  handleChangeOrder: (order: Direction) => {
    set((prev) => ({ ...prev, order }));
  },
  handleChangeSortType: (sortType: SortVariant) => {
    set((prev) => ({ ...prev, sortType }));
  },
}));
