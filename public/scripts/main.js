//falta añadir metas semanales en el perfil tambien si se me olvida deje un buen dashboard de eejmplo en los pin de chrome
import {
  generateScramble,
  setNewScramble,
} from "./modules/scramble/scramble-generator.js";
import { submitTime } from "./modules/api/submit-time.js";
import { startTimer } from "./modules/timer/start-timer.js";
import { stopTimer } from "./modules/timer/stop-timer.js";
import { updateTimer } from "./modules/timer/update-timer.js";

let holdStartTime = 0;
let isRunning = false;
let isHolding = false;

const category = document.querySelector("#category");
const cube = document.querySelector("#cube");
category.addEventListener("input", setNewScramble);

document.addEventListener("keydown", function (event) {
  if (category.value === "Open this select menu") {
    return;
  }
  if (cube.value === "Open this select menu") {
    return;
  }
  if (event.code === "Escape") {
    document.querySelector("#timer").textContent = `0.000`;
  }

  if (event.code === "Space") {
    if (isRunning === false && isHolding === false) {
      holdStartTime = Date.now();
      isHolding = true;
      document.querySelector("#timer").classList.add("text-danger");
    } else if (isRunning === true && isHolding === false) {
      stopTimer();
      submitTime();
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
});

document.addEventListener("keyup", function (event) {
  if (event.code === "Space") {
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
});
