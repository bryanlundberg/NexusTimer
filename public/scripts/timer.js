
/* document.querySelector("p").textContent = generateScramble(20) */

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
