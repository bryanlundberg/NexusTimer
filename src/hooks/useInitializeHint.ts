import { useEffect } from "react";
import cubeSolver from "cube-solver";
import { useTimerStore } from "@/store/timerStore";

export default function useInitializeTimer() {
  const { setInitializing } = useTimerStore();

  useEffect(() => {
    let isMounted = true;

    const initializePromises = [
      cubeSolver.initialize("cross"),
      cubeSolver.initialize("xcross"),
    ];

    const timer = setTimeout(() => {
      if (isMounted) {
        window.location.reload();
      }
    }, 5000);

    Promise.all(initializePromises)
      .then(() => {
        if (isMounted) {
          setInitializing(false);
          clearTimeout(timer);
        }
      })
      .catch((error) => {
        console.error("Error during initialization:", error);

        if (isMounted) {
          window.location.reload();
        }
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [setInitializing]);
}
