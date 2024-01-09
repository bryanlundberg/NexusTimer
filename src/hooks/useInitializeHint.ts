import { useEffect } from "react";
import cubeSolver from "cube-solver";
import { useTimerStore } from "@/store/timerStore";

export default function useInitializeTimer() {
  const { setInitializing } = useTimerStore();

  useEffect(() => {
    const initializePromises = [
      cubeSolver.initialize("cross"),
      cubeSolver.initialize("xcross"),
    ];

    Promise.all(initializePromises)
      .then(() => {
        // Both promises resolved successfully
        setInitializing(false);
      })
      .catch((error) => {
        // Handle any errors that occurred during initialization
        console.error("Error during initialization:", error);
      });
  }, [setInitializing]);
}
