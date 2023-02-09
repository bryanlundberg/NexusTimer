import { generateScramble, setNewScramble } from "../scramble/scramble-generator.js";
import { submitTime } from "../api/submit-time.js";
import { startTimer } from "./start-timer.js";
import { stopTimer } from "./stop-timer.js";
import { updateTimer, solveTime } from "./update-timer.js";
import { setActiveColor, setPendingColor, setResetColor } from "./toggle-color.js";

let holdStartTime = 0;
let isRunning = false;
let isHolding = false;

export const handleDownKeys = (event) => {
  const keyPress = event.code;
  if (category.value === "Open this select menu") {
    return;
  }
  if (cube.value === "Open this select menu") {
    return;
  }
  if (keyPress === "Escape") {
    document.querySelector("#timer").textContent = `0.000`;
  }

  if (keyPress === "Space") {
    if (!isRunning && !isHolding) {
      holdStartTime = Date.now();
      isHolding = true;
      setPendingColor()
    } else if (isRunning && !isHolding) {
      stopTimer();
      submitTime(solveTime);
	  setResetColor();
      isRunning = false;
    } else if (!isRunning && isHolding && (Date.now() - holdStartTime) / 1000 <= 0.4) {
      setPendingColor()
    } else if (!isRunning && isHolding && (Date.now() - holdStartTime) / 1000 >= 0.4) {
      setActiveColor()
    }
  }
};

export const handleUpKeys = (event) => {
  const keyPress = event.code;
  if (keyPress === "Space") {
    let difference = (Date.now() - holdStartTime) / 1000;
    if (!isRunning && isHolding && difference >= 0.4) {
      isRunning = true;
      isHolding = false;
      startTimer();
    } else if (difference <= 0.4) {
      isRunning = false;
      isHolding = false;
      setResetColor()
    }
  }
};
