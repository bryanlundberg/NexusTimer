import { useEffect } from "react";
import { useTimerStore } from "@/store/timerStore";

export default function useInitializeTimer() {
  const { setInitializing } = useTimerStore();

  useEffect(() => {
    const worker = new Worker(
      new URL("@/worker/solver333Worker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      const { success, error } = event.data;

      if (success) {
        setInitializing(false);
      }
    };

    worker.postMessage({ type: "cross" });
    worker.postMessage({ type: "xcross" });

    return () => {
      worker.terminate();
    };
  }, [setInitializing]);
}
