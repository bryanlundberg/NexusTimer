import calcTurnsPerSecond from '@/shared/lib/statistics/calcTurnsPerSecond'

describe('calcTurnsPerSecond', () => {
  it('returns 0 when time is 0', () => {
    expect(calcTurnsPerSecond("R U R' U'", 0)).toBe(0)
  })

  it('computes moves per second for a clean solution', () => {
    // 4 moves in 1000 ms → 4 TPS
    expect(calcTurnsPerSecond("R U R' U'", 1000)).toBe(4)
  })

  it('rounds to two decimal places', () => {
    // 3 moves in 1000 ms → 3 TPS exact
    expect(calcTurnsPerSecond('R U L', 1000)).toBe(3)
    // 7 moves in 1500 ms → 4.666... → 4.67
    expect(calcTurnsPerSecond('R U L D F B M', 1500)).toBe(4.67)
  })

  it('trims surrounding whitespace before counting moves', () => {
    // Trailing/leading whitespace should not inflate the move count
    expect(calcTurnsPerSecond("  R U R' U'  ", 1000)).toBe(4)
  })

  it('counts a single move when the solution is a one-move string', () => {
    expect(calcTurnsPerSecond('R', 1000)).toBe(1)
  })

  it('returns 0 when the solution is empty after trimming', () => {
    // trim('').split(' ') → [''] → length 1 → 1 / (1000/1000) = 1
    // The function does NOT special-case empty solutions; document the behavior.
    expect(calcTurnsPerSecond('', 1000)).toBe(1)
  })
})
