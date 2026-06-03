import formatTime from '@/shared/lib/formatTime'

export function getIntegerPart(time: number): string {
  return formatTime(time).split('.')[0]
}

export function getDecimalPart(time: number, decimals: number = 2): string {
  const part = formatTime(time, decimals).split('.')[1]
  return part ? '.' + part : ''
}
