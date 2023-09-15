import Script from "next/script";
import { createElement, useEffect, useState } from "react";

export default function TimerWidgets({
  scramble,
  event,
}: {
  scramble: any;
  event: any;
}) {
  useEffect(() => {
    if (event === null) {
      const display = document.createElement("scramble-display");
      document.querySelector("#scramble-display")?.appendChild(display);
      return;
    }

    const display = document.querySelector("scramble-display");
    display?.setAttribute("event", event.event);
    display?.setAttribute("scramble", scramble);
  }, [scramble, event]);

  return (
    <div className="h-10 flex justify-between">
      <div className="w-10 h-10 "></div>
      <div className="w-40 h-40 " id="scramble-display"></div>
      <div className="w-10 h-10 "></div>
    </div>
  );
}
