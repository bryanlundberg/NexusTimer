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

function runTimer() {
  
    if (!timerId) {
	  document.querySelector("#timer").classList.remove("text-success")
      startTime = Date.now();
      timerId = setInterval(() => {
        currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        document.querySelector("#timer").innerHTML = (elapsedTime / 1000).toFixed(2);
      }, 10);
    } else {
      clearInterval(timerId);
      timerId = null;
	  document.querySelector("#timer").classList.remove("text-success")
	  document.querySelector("#scramble").textContent = generateScramble(20)
    }
  
}


document.querySelector("#scramble").textContent = generateScramble(20)

let timerId;
let startTime;
let currentTime;
let elapsedTime = 0;
let running = false;

document.addEventListener("keydown", function(event) {
	if (event.code === "Space") {
		document.querySelector("#timer").classList.add("text-success")
	}
});

document.addEventListener("keyup", function(event) {
	if (event.code === "Space" && running == false) {
	  runTimer()
	}
});

document.addEventListener("click", (e) => {
	const timeBody = document.querySelector("#timer-vh")
	if (e.target == timeBody) {
		runTimer();
	}
})

document.addEventListener("keydown", function(event) {
	if (event.code === "Escape") {
		document.querySelector("#timer").textContent = `0.00`
	}
});


/*

let timerId;
let startTime;
let currentTime;
let elapsedTime = 0;

document.addEventListener("keyup", function(event) {
	if (event.code === "Space") {
		if (!timerId) {
			startTime = Date.now();
			timerId = setInterval(() => {
				currentTime = Date.now();
				elapsedTime = currentTime - startTime;
				document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(2) + "s";
			}, 10);
		} else {
			clearInterval(timerId);
			timerId = null;
			let solveTime = (elapsedTime / 1000).toFixed(2);
			let input1 = document.getElementById("input1").value;
			let input2 = document.getElementById("input2").value;
			fetch('/api/registerSolve', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					solveTime,
					input1,
					input2
				})
			})
				.then(response => response.json())
				.then(data => {
					console.log(data);
				})
				.catch(error => {
					console.error(error);
				});
		}
	}
});

*/


