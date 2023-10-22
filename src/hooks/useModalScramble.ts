import { cubeCollection } from "@/lib/cubeCollection";
import { useSolvesStore } from "@/store/SolvesStore";
import { useEffect } from "react";

export default function useModalScramble() {
  const { solve } = useSolvesStore();

  useEffect(() => {
    if (!solve) return;

    const display = document.querySelector("scramble-display");

    if (display) {
      display.remove();
    }

    const name = cubeCollection.find((item) => item.name === solve.category);

    if (name) {
      const child = document.createElement("scramble-display");
      child.setAttribute("event", name.event || "222");
      child.setAttribute("scramble", solve.scramble || "");
      document.querySelector("#scramble-display")?.appendChild(child);
    }
  }, [solve]);
}
