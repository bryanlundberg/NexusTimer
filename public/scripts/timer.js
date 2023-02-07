//falta añadir metas semanales en el perfil tambien si se me olvida deje un buen dashboard de eejmplo en los pin de chrome
function generateScramble(scrambleLength) {
  const possibleMoves = [
    "U",
    "U2",
    "U'",
    "R",
    "R2",
    "R'",
    "F",
    "F2",
    "F'",
    "D",
    "D2",
    "D'",
    "L",
    "L2",
    "L'",
    "B",
    "B2",
    "B'",
  ];
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

function updateTimer() {
  solveTime = Date.now() - startTime;
  document.querySelector("#timer").textContent = (solveTime / 1000).toFixed(2);
}

function runTimer() {
  startTime = Date.now();
  timerId = setInterval(updateTimer, 10);
}

function stopTimer() {
  clearInterval(timerId);
}

function submitTime() {
const url = "http://localhost:3000";
let scramble = document.querySelector(`#scramble`).textContent;
let category = document.querySelector(`select[name="category"]`).value;
let cube = document.querySelector(`select[name="cube"]`).value;

	
  fetch(url+"/api/submit/solve", {
    method: "POST",
    body: JSON.stringify({
      solveTime,
      scramble,
	  category,
	  cube,
      id,
      _csrf,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}


let genScramble = document.querySelector("#scramble").textContent = generateScramble(20);
let holdStartTime = 0;
let isRunning = false;
let isHolding = false;
let solveTime = 0;
const id = document.querySelector(`input[name="id"]`).value;
const _csrf = document.querySelector(`input[name="_csrf"]`).value;




document.addEventListener("keydown", function (event) {
  if (event.code === "Escape") {
    document.querySelector("#timer").textContent = `0.00`;
  }

  if (event.code === "Space") {
    if (isRunning === false && isHolding === false) {
      holdStartTime = Date.now();
      isHolding = true;
    }

    if (isRunning === true && isHolding === false) {
      stopTimer();
	  submitTime();
      isRunning = false;
      document.querySelector("#timer").classList.remove("text-success");
      document.querySelector("#timer").classList.remove("text-danger");
      scrambleField = document.querySelector("#scramble").textContent =
        generateScramble(20);
    }

    if (
      isRunning === false &&
      isHolding === true &&
      (Date.now() - holdStartTime) / 1000 <= 1
    ) {
      document.querySelector("#timer").classList.remove("text-success");
      document.querySelector("#timer").classList.add("text-danger");
    }

    if (
      isRunning === false &&
      isHolding === true &&
      (Date.now() - holdStartTime) / 1000 >= 1
    ) {
      document.querySelector("#timer").classList.remove("text-danger");
      document.querySelector("#timer").classList.add("text-success");
    }
  }
});

document.addEventListener("keyup", function (event) {
  if (event.code === "Space") {
    let difference = (Date.now() - holdStartTime) / 1000;
    if (isRunning === false && isHolding === true && difference >= 1) {
      console.log("hold 1+s");
      isRunning = true;
      isHolding = false;
      runTimer();
    }

    if (difference <= 1) {
      isRunning = false;
      isHolding = false;
      document.querySelector("#timer").classList.remove("text-danger");
      document.querySelector("#timer").classList.remove("text-success");
    }
  }
});

/* document.addEventListener("click", (e) => {
	const timeBody = document.querySelector("#timer-vh")
	if (e.target == timeBody) {
		runTimer();
	}
}) */