export const deleteChilds = (idParent) => {
  const parentTag = document.querySelector(`#${idParent}`);
  if (!parentTag) {
    console.log("Parent #id Not Found");
    return;
  }
  while (parentTag.firstChild) {
    parentTag.removeChild(parentTag.firstChild);
  }
};

export const convertMStoDHMS = (ms) => {
  let time = {};
  time.days = Math.floor(ms / (1000 * 60 * 60 * 24));
  time.hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  time.minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  time.seconds = Math.floor((ms % (1000 * 60)) / 1000);

  let result = "";
  if (time.days > 0) {
    result += time.days + (time.days === 1 ? " day " : " days ");
  }
  if (time.hours > 0) {
    result += time.hours + (time.hours === 1 ? " hour " : " hours ");
  }
  if (time.minutes > 0) {
    result += time.minutes + (time.minutes === 1 ? " minute " : " minutes ");
  }
  if (time.seconds > 0) {
    result += time.seconds + (time.seconds === 1 ? " second " : " seconds ");
  }
  return result.trim();
};

export const convertMsToTime = (milliseconds) => {
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

export const findUserId = () => {
  const userInput = document.querySelector("input[name=id]");
  if (userInput) {
    const userId = userInput.value;
    return userId;
  }
};
