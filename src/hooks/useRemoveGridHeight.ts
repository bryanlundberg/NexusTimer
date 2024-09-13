import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";

const useRemoveGridHeight = () => {
  const { selectedCube } = useTimerStore();
  useEffect(() => {
    const container = document.querySelector(".container") as HTMLElement;

    if (container) {
      container.style.setProperty("--grid-height", "auto");
    }
  }, [selectedCube]);
};

export default useRemoveGridHeight;
