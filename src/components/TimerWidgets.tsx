import { useTimerStore } from "@/store/timerStore";
import { useEffect } from "react";

export default function TimerWidgets() {
  const { scramble, event } = useTimerStore();
  useEffect(() => {
    const display = document.querySelector("scramble-display");
    display?.remove();
    const child = document.createElement("scramble-display");
    child.setAttribute("event", event);
    child.setAttribute("scramble", scramble ? scramble : "");
    document.querySelector("#scramble-display")?.appendChild(child);
  });

  return (
    <div className="h-20 md:h-32 lg:h-40 flex justify-between">
      <div className="w-10 h-10 "></div>
      <div className="w-full h-full" id="scramble-display"></div>
      <div className="w-10 h-10 "></div>
    </div>
  );
}
