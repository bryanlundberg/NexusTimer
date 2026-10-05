const padTo2Digits = (num: number) => num.toString().padStart(2, '0')

export function formatTime(timeInMs: number, decimals: number = 2): string {
  const milliseconds = timeInMs % 1000
  const seconds = Math.floor((timeInMs / 1000) % 60)
  const minutes = Math.floor((timeInMs / (60 * 1000)) % 60)

  let millisecondsFormatted = ''
  if (decimals > 0) {
    const msStr = Math.floor(milliseconds).toString().padStart(3, '0')
    millisecondsFormatted = decimals <= 3 ? msStr.substring(0, decimals) : msStr + '0'.repeat(decimals - 3)
  }

  return (
    (minutes > 0 ? minutes + ':' + padTo2Digits(seconds) : seconds) +
    (millisecondsFormatted ? '.' + millisecondsFormatted : '')
  )
}
