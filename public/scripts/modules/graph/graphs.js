import { fetchProfileStats } from "../api/fetch-profile-stats.js";

export async function fillGraphs() {
	try {
		const solveCounter = document.querySelector("#solveCounter")
		const solvingTime = document.querySelector("#solvingTime")
		const userStat = await fetchProfileStats();
		solveCounter.textContent = userStat.totalSolves;
		solvingTime.textContent = convertMStoDHMS(userStat.solvingTime);
		
	} catch (err) {
		console.log(err)
	}
}

function convertMStoDHMS(ms) {
  let time = {};
  time.days = Math.floor(ms / (1000 * 60 * 60 * 24));
  time.hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  time.minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  time.seconds = Math.floor((ms % (1000 * 60)) / 1000);

  let result = '';
  if (time.days > 0) {
    result += time.days + (time.days === 1 ? ' day ' : ' days ');
  }
  if (time.hours > 0) {
    result += time.hours + (time.hours === 1 ? ' hour ' : ' hours ');
  }
  if (time.minutes > 0) {
    result += time.minutes + (time.minutes === 1 ? ' minute ' : ' minutes ');
  }
  if (time.seconds > 0) {
    result += time.seconds + (time.seconds === 1 ? ' second ' : ' seconds ');
  }
  return result.trim();
}