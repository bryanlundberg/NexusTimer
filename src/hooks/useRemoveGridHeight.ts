import { useSolveFiltersStore } from "@/store/SolvesFilters";
import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";

const useRemoveGridHeight = () => {
  const { selectedCube } = useTimerStore();
  const { tab } = useSolveFiltersStore();
  useEffect(() => {
    const container = document.querySelector(".container") as HTMLElement;

    if (container) {
      container.style.setProperty("--grid-height", "auto");
    }
  }, [selectedCube, tab]);
};

export default useRemoveGridHeight;
