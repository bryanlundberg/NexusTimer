export let solveTime;

export function updateTimer(startTime) {
  solveTime = Date.now() - startTime;
  document.querySelector("#timer").textContent = (solveTime / 1000).toFixed(3);
}