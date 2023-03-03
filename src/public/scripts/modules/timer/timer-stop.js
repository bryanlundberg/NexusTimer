import { timerId } from "./timer-start.js";

export function stopTimer() {
  clearInterval(timerId);
}