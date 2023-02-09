import { generateScramble, setNewScramble } from "../scramble/scramble-generator.js";
import { submitTime } from "../api/submit-time.js";
import { startTimer } from "./start-timer.js";
import { stopTimer } from "./stop-timer.js";
import { updateTimer, solveTime } from "./update-timer.js";

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
    if (isRunning === false && isHolding === false) {
      holdStartTime = Date.now();
      isHolding = true;
      document.querySelector("#timer").classList.add("text-danger");
    } else if (isRunning === true && isHolding === false) {
      stopTimer();
      submitTime(solveTime);
      isRunning = false;
      document.querySelector("#timer").classList.remove("text-success");
      document.querySelector("#timer").classList.remove("text-danger");
    } else if (
      isRunning === false &&
      isHolding === true &&
      (Date.now() - holdStartTime) / 1000 <= 0.4
    ) {
      document.querySelector("#timer").classList.remove("text-success");
      document.querySelector("#timer").classList.add("text-danger");
    } else if (
      isRunning === false &&
      isHolding === true &&
      (Date.now() - holdStartTime) / 1000 >= 0.4
    ) {
      document.querySelector("#timer").classList.remove("text-danger");
      document.querySelector("#timer").classList.add("text-success");
    }
  }
};

export const handleUpKeys = (event) => {
  const keyPress = event.code;
  if (keyPress === "Space") {
    let difference = (Date.now() - holdStartTime) / 1000;
    if (isRunning === false && isHolding === true && difference >= 0.4) {
      isRunning = true;
      isHolding = false;
      startTimer();
    } else if (difference <= 0.4) {
      isRunning = false;
      isHolding = false;
      document.querySelector("#timer").classList.remove("text-danger");
      document.querySelector("#timer").classList.remove("text-success");
    }
  }
};
