import {updateTimer} from "./update-timer.js";

export let timerId;

export function startTimer() {
  let startTime = Date.now();
  timerId = setInterval(() => updateTimer(startTime), 10);
}

