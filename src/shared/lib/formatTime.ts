/**
 * Converts a time duration in milliseconds to a formatted string in "mm:ss.SS" format.
 *
 * @param {number} timeInMs - The time duration in milliseconds.
 * @param {number} decimals - The number of decimal places to display (default: 2).
 * @returns {string} The formatted time string.
 */
export default function formatTime(timeInMs: number, decimals: number = 2): string {
  /**
   * Pads a number to have at least 2 digits by adding leading zeros.
   *
   * @param {number} num - The number to pad.
   * @returns {string} The padded number as a string.
   */
  function padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0')
  }

  const milliseconds = timeInMs % 1000
  const seconds = Math.floor((timeInMs / 1000) % 60)
  const minutes = Math.floor((timeInMs / (60 * 1000)) % 60)

  let millisecondsFormatted = ''
  if (decimals > 0) {
    const msStr = Math.floor(milliseconds).toString().padStart(3, '0')
    if (decimals <= 3) {
      millisecondsFormatted = msStr.substring(0, decimals)
    } else {
      millisecondsFormatted = msStr + '0'.repeat(decimals - 3)
    }
  }

  return (
    (minutes > 0 ? minutes + ':' + padTo2Digits(seconds) : seconds) +
    (millisecondsFormatted ? '.' + millisecondsFormatted : '')
  )
}
