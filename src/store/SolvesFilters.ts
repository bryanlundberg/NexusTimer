import { create } from "zustand";

type Direction = "asc" | "desc";
type SortVariant = "date" | "time";
type TabVariant = "session" | "all";
interface SolvesFiltersProps {
  tab: TabVariant;
  query: string;
  sortType: SortVariant;
  order: Direction;
  isOpenMoveSolvesDialog: boolean;
  handleSearch: (query: string) => void;
  handleChangeOrder: (order: Direction) => void;
  handleChangeSortType: (sortType: SortVariant) => void;
  handleChangeTab: (newTab: TabVariant) => void;
  handleChangeIsOpenMoveSolvesDialog: () => void;
}

export const useSolveFiltersStore = create<SolvesFiltersProps>((set) => ({
  tab: "session",
  sortType: "date",
  order: "desc",
  query: "",
  isOpenMoveSolvesDialog: false,
  handleSearch: (query: string) => {
    set((prev) => ({ ...prev, query }));
  },
  handleChangeOrder: (order: Direction) => {
    set((prev) => ({ ...prev, order }));
  },
  handleChangeSortType: (sortType: SortVariant) => {
    set((prev) => ({ ...prev, sortType }));
  },
  handleChangeTab: (newTab: TabVariant) => {
    set((prev) => ({ ...prev, tab: newTab }));
  },
  handleChangeIsOpenMoveSolvesDialog: () => {
    set((prev) => ({
      ...prev,
      isOpenMoveSolvesDialog: !prev.isOpenMoveSolvesDialog,
    }));
  },
}));
