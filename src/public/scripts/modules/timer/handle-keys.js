import { setScramble } from "../scramble/scramble-generator.js";
import { submitNewSolve } from "../api/fetch-post.js";
import { startTimer, startDate } from "./timer-start.js";
import { stopTimer } from "./timer-stop.js";
import { solveTime } from "./timer-update.js";
import { setActiveColor, setPendingColor, setResetColor } from "./toggle-color.js";
import { updateDisplayTimerStats } from "../page/timer-page.js";

let holdStartTime = 0;
let isRunning = false;
let isHolding = false;

export const handleDownKeys = async (event) => {
	try {
		const keyPress = event.code;

		if (keyPress === "Escape") {
			document.querySelector("#timer").textContent = `0.000`;
		}

		if (keyPress === "Space") {
			if (!isRunning && !isHolding) {
				holdStartTime = Date.now();
				isHolding = true;
				setPendingColor();
			} else if (isRunning && !isHolding) {
				stopTimer();
				isRunning = false;
				await submitNewSolve(solveTime, startDate);
				setScramble();
				await updateDisplayTimerStats();
				setResetColor();  
			} else if (!isRunning && isHolding && (Date.now() - holdStartTime) / 1000 <= 0.4) {
				setPendingColor();
			} else if (!isRunning && isHolding && (Date.now() - holdStartTime) / 1000 >= 0.4) {
				setActiveColor();
			}
		}
	} catch (err) {
		console.log(err);
	}
};


export const handleUpKeys = (event) => {
  const keyPress = event.code;
  if (keyPress === "Space") {
    let difference = (Date.now() - holdStartTime) / 1000;
    if (!isRunning && isHolding && difference >= 0.4) {
	  setResetColor();
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
