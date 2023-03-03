import { updateTimer } from "./timer-update.js";

export let timerId;
export let startDate;

export function startTimer() {
  startDate = Date.now();
  timerId = setInterval(() => updateTimer(startDate), 10);
}