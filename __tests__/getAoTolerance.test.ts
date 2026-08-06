import getAoTolerance, { calcAoFromWindow } from '@/shared/lib/statistics/getAoTolerance'
import { makeSolves } from './fixtures/solve'

/**
 * The trimming engine behind every average in the app: calcBestAo, calcCurrentAo
 * and the rolling Ao5/Ao12 on the chart all funnel through here. A change to the
 * trim size shifts every average silently, so the numbers are pinned explicitly.
 */
describe('getAoTolerance', () => {
  it('trims nothing below an ao5, where the average is a plain mean', () => {
    expect(getAoTolerance(3)).toBe(0)
    expect(getAoTolerance(4)).toBe(0)
  })

  it('trims 5% per side, rounded up', () => {
    expect(getAoTolerance(5)).toBe(1)
    expect(getAoTolerance(12)).toBe(1)
    expect(getAoTolerance(50)).toBe(3)
    expect(getAoTolerance(100)).toBe(5)
    expect(getAoTolerance(1000)).toBe(50)
  })

  it('keeps the trim below half the window, so something always survives', () => {
    for (const size of [5, 12, 25, 50, 100, 1000]) {
      expect(getAoTolerance(size) * 2).toBeLessThan(size)
    }
  })
})

describe('calcAoFromWindow', () => {
  it('drops the fastest and the slowest of an ao5', () => {
    // [1,2,3,4,5] → keep 2,3,4 → 3
    expect(calcAoFromWindow(makeSolves([1000, 2000, 3000, 4000, 5000]), 5)).toBe(3000)
  })

  it('does not care how the window is ordered', () => {
    const shuffled = makeSolves([4000, 1000, 5000, 3000, 2000])
    expect(calcAoFromWindow(shuffled, 5)).toBe(3000)
  })

  it('averages an ao3 without trimming', () => {
    expect(calcAoFromWindow(makeSolves([1000, 2000, 6000]), 3)).toBe(3000)
  })

  it('trims one per side on an ao12', () => {
    const times = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10_000, 11_000, 99_000]
    // The 1000 and the 99000 go; the remaining ten average 6500.
    expect(calcAoFromWindow(makeSolves(times), 12)).toBe(6500)
  })

  it('includes a +2 at its penalised value', () => {
    const window = makeSolves([9000, 10_000, 12_000, 11_000, 13_000])
    window[2].plus2 = true
    expect(calcAoFromWindow(window, 5)).toBe(11_000)
  })

  describe('DNFs', () => {
    it('trims a single DNF away as the slowest solve', () => {
      const window = makeSolves([9000, 10_000, 11_000, 12_000, 13_000])
      window[4].dnf = true
      // The DNF sorts last and is trimmed with the slowest; the 9000 goes as fastest.
      expect(calcAoFromWindow(window, 5)).toBe(11_000)
    })

    it('is a DNF average once the DNFs outnumber the trim', () => {
      const window = makeSolves([9000, 10_000, 11_000, 12_000, 13_000])
      window[3].dnf = true
      window[4].dnf = true
      expect(calcAoFromWindow(window, 5)).toBe(0)
    })

    it('tolerates up to three DNFs in an ao50', () => {
      const window = makeSolves(Array.from({ length: 50 }, (_, i) => 10_000 + i * 10))
      window[0].dnf = true
      window[1].dnf = true
      window[2].dnf = true
      expect(calcAoFromWindow(window, 50)).toBeGreaterThan(0)

      window[3].dnf = true
      expect(calcAoFromWindow(window, 50)).toBe(0)
    })

    it('never lets a DNF time reach the average, however fast its clock stopped', () => {
      const window = makeSolves([10_000, 10_000, 10_000, 10_000, 10_000])
      window[0].dnf = true
      window[0].time = 1
      // Without the DNF the mean would drop; the trim has to remove it, not the 10s.
      expect(calcAoFromWindow(window, 5)).toBe(10_000)
    })
  })

  describe('window guards', () => {
    it('returns 0 when the window is smaller than the average asked for', () => {
      expect(calcAoFromWindow(makeSolves([1000, 2000, 3000, 4000]), 5)).toBe(0)
    })

    it('returns 0 for an average below 3', () => {
      expect(calcAoFromWindow(makeSolves([1000, 2000]), 2)).toBe(0)
      expect(calcAoFromWindow(makeSolves([1000]), 1)).toBe(0)
    })

    it('returns 0 for an empty or missing window', () => {
      expect(calcAoFromWindow([], 5)).toBe(0)
      expect(calcAoFromWindow(null as never, 5)).toBe(0)
    })

    it('only reads the first `ao` solves when handed a longer window', () => {
      // calcBestAo slices exact windows, but the guard matters if a caller does not.
      const window = makeSolves([1000, 2000, 3000, 4000, 5000, 900_000])
      expect(calcAoFromWindow(window, 5)).toBe(3000)
    })

    it('does not mutate the window it was given', () => {
      const window = makeSolves([5000, 1000, 3000, 2000, 4000])
      const snapshot = window.map((solve) => solve.time)
      calcAoFromWindow(window, 5)
      expect(window.map((solve) => solve.time)).toEqual(snapshot)
    })
  })
})
