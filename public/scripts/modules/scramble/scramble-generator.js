import {possibleMoves2x2} from "./moves/possible-moves-2x2.js";
import {possibleMoves3x3} from "./moves/possible-moves-3x3.js";
import {possibleMoves4x4} from "./moves/possible-moves-4x4.js";


export function generateScramble(category) {
  let possibleMoves;
  let scrambleSize;
  if (category === "2x2") {
    possibleMoves = possibleMoves2x2;
    scrambleSize = 10;
  } else if (category === "3x3") {
    possibleMoves = possibleMoves3x3;
    scrambleSize = 25;
  } else if (category === "4x4") {
    possibleMoves = possibleMoves4x4;
    scrambleSize = 35;
  } else {
    return "Invalid category";
  }

  const scramble = [];
  let lastMove = "";

  for (let i = 0; i < scrambleSize; i++) {
    let move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    while (move.charAt(0) === lastMove.charAt(0)) {
      move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
    scramble.push(move);
    lastMove = move;
  }
  return scramble.join(" ");
}

export function setNewScramble() {
	const scrambleCategory = document.querySelector("#category").value
	const scrambleArea = document.querySelector("#scramble")
	if (scrambleCategory == "Open this select menu") {
		scrambleArea.textContent = "Pick a scramble type to START cubing!";
	} else {
		scrambleArea.textContent = generateScramble(scrambleCategory);
	}
}