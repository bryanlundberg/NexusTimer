import { cubeCollection } from "@/lib/cubeCollection";
import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";

export default function TimerWidgets() {
  const { selectedCube, scramble } = useTimerStore();

  const event: any = selectedCube
    ? cubeCollection.find((item) => item.name === selectedCube?.category)
    : null;

  useEffect(() => {
    const display = document.querySelector("scramble-display");
    if (!display) {
      const display = document.createElement("scramble-display");
      document.querySelector("#scramble-display")?.appendChild(display);
    }

    display?.setAttribute("event", event?.event);
    display?.setAttribute("scramble", scramble ? scramble : "");
  }, [scramble, selectedCube, event]);

  return (
    <div className="h-20 md:h-32 lg:h-40 flex justify-between">
      <div className="w-10 h-10 "></div>
      <div className="w-full h-full" id="scramble-display"></div>
      <div className="w-10 h-10 "></div>
    </div>
  );
}
