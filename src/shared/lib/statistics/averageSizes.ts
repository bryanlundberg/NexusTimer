export const DEFAULT_AVERAGES = [3, 5, 12, 50, 100, 250, 500, 1000]
export const DEFAULT_TIMER_AVERAGES = [5, 12, 50, 100]
export const DEFAULT_RAIL_AVERAGES = [3, 5, 12]
export const DESKTOP_MIN_WIDTH = 768
export const MIN_AVERAGE_SIZE = 3
export const MAX_AVERAGE_SIZE = 10_000
export const MAX_AVERAGES = 10
export const MAX_TIMER_AVERAGES = 8

export function parseAverageSize(input: string): number | null {
  const match = /^(?:ao)?(\d+)$/i.exec(input.trim())
  if (!match) return null
  const size = Number(match[1])
  return size >= MIN_AVERAGE_SIZE && size <= MAX_AVERAGE_SIZE ? size : null
}

export function resolveAverages(custom: number[], defaults: number[] = DEFAULT_AVERAGES): number[] {
  return custom.length > 0 ? custom : defaults
}

export function timerStatSizes(
  { railAverages, timerAverages }: { railAverages: number[]; timerAverages: number[] },
  isDesktop: boolean,
  isRailOpen: boolean
): number[] {
  if (!isDesktop) return resolveAverages(timerAverages, DEFAULT_TIMER_AVERAGES)
  if (!isRailOpen) return DEFAULT_TIMER_AVERAGES
  const sizes = new Set([...DEFAULT_TIMER_AVERAGES, ...resolveAverages(railAverages, DEFAULT_RAIL_AVERAGES)])
  return [...sizes].sort((a, b) => a - b)
}

export function toCustomAverages(sizes: number[], defaults: number[] = DEFAULT_AVERAGES): number[] {
  const isDefault = sizes.length === defaults.length && sizes.every((size, i) => size === defaults[i])
  return isDefault ? [] : sizes
}
