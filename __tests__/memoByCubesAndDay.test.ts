import { afterEach, describe, expect, it, vi } from 'vitest'
import { memoByCubesAndDay } from '@/widgets/sidebar/lib/memoByCubesAndDay'
import { Cube } from '@/entities/cube/model/types'

describe('memoByCubesAndDay', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('reuses the result while the cubes array and the day stay the same', () => {
    const compute = vi.fn((cubes: Cube[] | null) => cubes?.length ?? 0)
    const memo = memoByCubesAndDay(compute)
    const cubes: Cube[] = []

    expect(memo(cubes)).toBe(0)
    expect(memo(cubes)).toBe(0)
    expect(compute).toHaveBeenCalledTimes(1)
  })

  it('recomputes when the cubes array changes', () => {
    const compute = vi.fn((cubes: Cube[] | null) => cubes?.length ?? 0)
    const memo = memoByCubesAndDay(compute)

    memo([])
    memo(null)
    memo([])
    expect(compute).toHaveBeenCalledTimes(3)
  })

  it('recomputes when the day changes', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 14, 23, 59))
    const compute = vi.fn(() => new Date().getDate())
    const memo = memoByCubesAndDay(compute)
    const cubes: Cube[] = []

    expect(memo(cubes)).toBe(14)
    vi.setSystemTime(new Date(2026, 10, 15, 0, 1))
    expect(memo(cubes)).toBe(15)
    expect(compute).toHaveBeenCalledTimes(2)
  })
})
