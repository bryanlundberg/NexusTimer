/**
 * The `convertToMs` function takes a string representing a time in various formats and converts it to
 * milliseconds. This function is only used for manual mode in the timer and is not utilized elsewhere.
 *
 * @param {string} number - A string representing a time value.
 * @returns {number} The total number of milliseconds represented by the input string.
 */
export default function convertToMs(number: string): number {
  const time = {
    hh: 0,
    mm: 0,
    ss: 0,
    ms: 0
  }
  if (number.length <= 2) {
    const ms = parseInt(number)
    time.ms = ms
  }

  if (number.length === 3) {
    const ss = parseInt(number.slice(0, 1))
    const ms = parseInt(number.slice(1, 3))
    time.ss = ss
    time.ms = ms
  }

  if (number.length === 4) {
    const ss = parseInt(number.slice(0, 2))
    const ms = parseInt(number.slice(2, 4))
    if (ss >= 60) {
      const mm = Math.floor(ss / 60)
      const sss = ss % 60
      time.mm += mm
      time.ss += sss
    } else {
      time.ss += ss
    }
    time.ms += ms
  }

  if (number.length === 5) {
    const mm = parseInt(number.slice(0, 1))
    const ss = parseInt(number.slice(1, 3))
    const ms = parseInt(number.slice(3, 5))
    if (ss >= 60) {
      const mm = Math.floor(ss / 60)
      const sss = ss % 60
      time.mm += mm
      time.ss += sss
    } else {
      time.ss += ss
    }
    time.mm += mm
    time.ms += ms
  }

  if (number.length === 6) {
    const mm = parseInt(number.slice(0, 2))
    const ss = parseInt(number.slice(2, 4))
    const ms = parseInt(number.slice(4, 6))
    if (ss >= 60) {
      const mm = Math.floor(ss / 60)
      const sss = ss % 60
      time.mm += mm
      time.ss += sss
    } else {
      time.ss += ss
    }
    time.mm += mm
    time.ms += ms
  }
  return time.mm * 60000 + time.ss * 1000 + time.ms * 10
}
