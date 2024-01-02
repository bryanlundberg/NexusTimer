/**
 * Converts a time duration in milliseconds to a formatted string in "mm:ss.SS" format.
 *
 * @param {number} timeInMs - The time duration in milliseconds.
 * @returns {string} The formatted time string.
 */
export default function formatTime(timeInMs: number): string {
  /**
   * Pads a number to have at least 2 digits by adding leading zeros.
   *
   * @param {number} num - The number to pad.
   * @returns {string} The padded number as a string.
   */
  function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0");
  }

  const milliseconds = timeInMs % 1000;
  const seconds = Math.floor((timeInMs / 1000) % 60);
  const minutes = Math.floor((timeInMs / (60 * 1000)) % 60);

  const formattedTime =
    (minutes > 0 ? minutes + ":" + padTo2Digits(seconds) : seconds) +
    "." +
    (milliseconds / 1000).toFixed(2).slice(2);

  return formattedTime;
}
