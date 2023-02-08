import { timerId } from "./start-timer.js";

export function stopTimer() {
  clearInterval(timerId);
}