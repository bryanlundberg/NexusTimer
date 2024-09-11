import { Solve } from "@/interfaces/Solve";
import { create } from "zustand";

interface ConfigSolvesFiltersProps {
  sort: "ascending" | "descending";
  time: "ascending" | "descending";
}

interface SolvesFiltersProps {
  displayingSolves: Solve[] | null;
  config: ConfigSolvesFiltersProps;
  query: string;
  handleSearch: (query: string) => void;
  handleChangeConfig: (config: ConfigSolvesFiltersProps) => void;
}

export const useSolveFilters = create<SolvesFiltersProps>((set) => ({
  displayingSolves: null,
  config: {
    sort: "ascending",
    time: "ascending",
  },
  query: "",
  handleSearch: (query: string) => {
    set((prev) => ({ ...prev, query }));
  },
  handleChangeConfig: (config: ConfigSolvesFiltersProps) => {
    set((prev) => ({ ...prev, ...config }));
  },
}));
