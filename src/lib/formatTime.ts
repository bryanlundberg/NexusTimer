export default function formatTime(timeInMs: number): string {
  const milliseconds = timeInMs % 1000;
  const seconds = Math.floor((timeInMs / 1000) % 60);
  const minutes = Math.floor((timeInMs / (60 * 1000)) % 60);

  const formattedTime =
    (minutes > 0 ? minutes + ":" + padTo2Digits(seconds) : seconds) +
    "." +
    (milliseconds / 1000).toFixed(2).slice(2);

  return formattedTime;
}

function padTo2Digits(num: number): string {
  return num.toString().padStart(2, "0");
}
