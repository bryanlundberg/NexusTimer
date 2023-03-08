function findBestTime(solveTimes) {
  if (solveTimes.length === 0) {
    return 0;
  }
  let bestTime = solveTimes[0].solveTime;
  solveTimes.forEach((time) => {
    if (time.solveTime < bestTime) {
      bestTime = time.solveTime;
    }
  });
  return bestTime;
}

function getBestAverage(array, ao) {
  if (array.length === 0 || array.length < ao) {
    return 0;
  }
  let lowestAvg = Infinity;
  const maxIndex = array.length - ao;
  for (let i = maxIndex; i >= 0; i--) {
    const group = array.slice(i, i + ao);
    const groupAvg = group.reduce((sum, x) => sum + x.solveTime, 0) / ao;
    if (groupAvg < lowestAvg) {
      lowestAvg = groupAvg;
    }
  }
  return lowestAvg;
}

function calculateCubingTime(array) {
  if (array.length === 0) {
    return 0;
  }
  let cubingTime = 0;
  array.forEach((element) => {
    cubingTime += element.solveTime;
  });
  return cubingTime;
}

function calculateAverage(array) {
  if (array.length === 0) {
    return 0;
  }
  const sum = array.reduce(
    (accumulator, currentValue) => accumulator + currentValue.solveTime,
    0
  );
  const length = array.length;
  const average = sum / length;
  return average;
}

function calculateCurrentAo(arraySolves, ao) {
  let result = 0;
  if (arraySolves.length < ao) {
    return result;
  }

  const arrayAo = arraySolves.slice(0, 5);
  const sum = arrayAo.reduce(
    (accumulator, currentValue) => accumulator + currentValue.solveTime,
    0
  );
  result = sum / ao;
  return result;
}

const convertMsToTime = (milliseconds) => {
  let seconds = Math.floor((milliseconds / 1000) % 60);
  let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);

  let timeInSeconds = (milliseconds / 1000).toFixed(3);

  if (minutes === 0) {
    return timeInSeconds;
  }

  let timeInMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  let timeInSecondsFormatted = seconds < 10 ? `0${seconds}` : `${seconds}`;
  let time = `${timeInMinutes}:${timeInSecondsFormatted}`;
  return time;
};

module.exports = {
  findBestTime,
  getBestAverage,
  calculateCubingTime,
  calculateAverage,
  calculateCurrentAo,
  convertMsToTime,
};
