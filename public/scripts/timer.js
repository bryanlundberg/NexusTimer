function generateScramble(scrambleLength) {
  const possibleMoves = ["U", "U2", "U'", "R", "R2", "R'", "F", "F2", "F'", "D", "D2", "D'", "L", "L2", "L'", "B", "B2", "B'"];
  const scramble = [];
  let lastMove = "";

  for (let i = 0; i < scrambleLength; i++) {
    let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    while (move.charAt(0) === lastMove.charAt(0)) {
      move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
    scramble.push(move);
    lastMove = move;
  }
  
  return scramble.join(" ");
}


document.querySelector("#scramble").textContent = generateScramble(20)

let timerId;
let startTime;
let currentTime;
let elapsedTime = 0;

document.addEventListener("keydown", function(event) {
	if (event.code === "Space") {
		document.querySelector("#timer").classList.add("text-success")
	}
});
document.addEventListener("keyup", function(event) {
  runTimer()
});


function runTimer() {
  if (event.code === "Space") {
    if (!timerId) {
	  document.querySelector("#timer").classList.remove("text-success")
      startTime = Date.now();
      timerId = setInterval(() => {
        currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(2) + "s";
      }, 10);
    } else {
      clearInterval(timerId);
      timerId = null;
	  document.querySelector("#timer").classList.remove("text-success")
	  document.querySelector("#scramble").textContent = generateScramble(20)
    }
  }
}


