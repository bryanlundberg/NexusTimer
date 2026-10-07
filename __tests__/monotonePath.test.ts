import { monotonePath, type ChartPoint } from '@/features/trainer/lib/monotonePath'

const numbers = (path: string) => (path.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number)

describe('monotonePath', () => {
  it('draws nothing for no points and a straight line for two', () => {
    expect(monotonePath([])).toBe('')
    expect(
      monotonePath([
        { x: 0, y: 10 },
        { x: 100, y: 40 }
      ])
    ).toBe('M0,10L100,40')
  })

  it('emits one cubic segment per gap', () => {
    const points: ChartPoint[] = [
      { x: 0, y: 0 },
      { x: 50, y: 30 },
      { x: 100, y: 10 }
    ]
    expect(monotonePath(points).match(/C/g)).toHaveLength(2)
  })

  it('never overshoots a monotone run', () => {
    const points: ChartPoint[] = [0, 5, 6, 30, 31, 80].map((y, i) => ({ x: i * 20, y }))
    const [, startY, ...curves] = numbers(monotonePath(points))
    let previous = startY
    for (let segment = 0; segment < curves.length; segment += 6) {
      const [, c1, , c2, , end] = curves.slice(segment, segment + 6)
      const from = previous
      for (let step = 1; step <= 20; step++) {
        const t = step / 20
        const y = (1 - t) ** 3 * from + 3 * (1 - t) ** 2 * t * c1 + 3 * (1 - t) * t ** 2 * c2 + t ** 3 * end
        expect(y).toBeGreaterThanOrEqual(previous - 1e-9)
        previous = y
      }
    }
  })

  it('stays flat across a flat run', () => {
    const points: ChartPoint[] = [10, 10, 10, 10].map((y, i) => ({ x: i * 10, y }))
    expect(numbers(monotonePath(points)).filter((_, i) => i % 2 === 1)).toEqual(Array(10).fill(10))
  })
})
