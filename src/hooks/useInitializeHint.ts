import { useEffect } from "react";
import cubeSolver from "cube-solver";

export default function useInitializeTimer() {
  useEffect(() => {
    cubeSolver.initialize("cross");
    cubeSolver.initialize("xcross");
  }, []);
}
