import { create } from "zustand";

type Direction = "asc" | "desc";
type SortVariant = "date" | "time";
type TabVariant = "session" | "all";
interface SolvesFiltersProps {
  tab: TabVariant;
  query: string;
  sortType: SortVariant;
  order: Direction;
  handleSearch: (query: string) => void;
  handleChangeOrder: (order: Direction) => void;
  handleChangeSortType: (sortType: SortVariant) => void;
  handleChangeTab: (newTab: TabVariant) => void;
}

export const useSolveFiltersStore = create<SolvesFiltersProps>((set) => ({
  tab: "session",
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
  handleChangeTab: (newTab: TabVariant) => {
    set((prev) => ({ ...prev, tab: newTab }));
  },
}));
