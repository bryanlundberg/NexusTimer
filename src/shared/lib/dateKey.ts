import dayjs from '@/shared/lib/dayjs'

export function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

export function createDateKey(timezone?: string): (timestamp: number) => string {
  if (!timezone) return (timestamp) => dayjs(timestamp).format('YYYY-MM-DD')

  const format = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return (timestamp) => {
    let year = ''
    let month = ''
    let day = ''
    for (const part of format.formatToParts(timestamp)) {
      if (part.type === 'year') year = part.value
      else if (part.type === 'month') month = part.value
      else if (part.type === 'day') day = part.value
    }
    return `${year}-${month}-${day}`
  }
}
