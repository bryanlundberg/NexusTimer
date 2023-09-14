import { possibleMoves2x2 } from "./moves/possible-moves-2x2.js";
import { possibleMoves3x3 } from "./moves/possible-moves-3x3.js";
import { possibleMoves4x4 } from "./moves/possible-moves-4x4.js";
import { possibleMoves5x5 } from "./moves/possible-moves-5x5.js";
import { possibleMoves6x6 } from "./moves/possible-moves-6x6.js";
import { possibleMoves7x7 } from "./moves/possible-moves-7x7.js";
import { possibleMovesPyraminx } from "./moves/possible-moves-pyraminx.js";
import { possibleMovesSkewb } from "./moves/possible-moves-skewb.js";

const scrambleGenerator = (category) => {
  let possibleMoves;
  let scrambleSize;
  if (category === "2x2") {
    possibleMoves = possibleMoves2x2;
    scrambleSize = 9;
  } else if (category === "3x3" || category === "3x3 OH") {
    possibleMoves = possibleMoves3x3;
    scrambleSize = 20;
  } else if (category === "4x4") {
    possibleMoves = possibleMoves4x4;
    scrambleSize = 40;
  } else if (category === "5x5") {
    possibleMoves = possibleMoves5x5;
    scrambleSize = 60;
  } else if (category === "6x6") {
    possibleMoves = possibleMoves6x6;
    scrambleSize = 80;
  } else if (category === "7x7") {
    possibleMoves = possibleMoves7x7;
    scrambleSize = 100;
  } else if (category === "Skewb") {
    possibleMoves = possibleMovesSkewb;
    scrambleSize = 8;
  } else if (category === "Pyraminx") {
    possibleMoves = possibleMovesPyraminx;
    scrambleSize = 11;
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
};

export const setScramble = () => {
  const scrambleArea = document.querySelector("#scramble");
  const scrambleCategory = document.querySelector("#category").value;
  scrambleArea.textContent = scrambleGenerator(scrambleCategory);
};
