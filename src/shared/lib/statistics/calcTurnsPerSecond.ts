export default function calcTurnsPerSecond(solution: string, time: number): number {
  if (time === 0) return 0
  const moves = solution.trim().split(' ').length
  const tps = moves / (time / 1000)
  return parseFloat(tps.toFixed(2))
}
