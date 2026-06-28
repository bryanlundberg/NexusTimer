import { buildLearnedMethods } from '@/entities/trainer-learned/lib/buildLearnedMethods'

// Real catalog ids (PLL method): see src/shared/data/algs/pll.ts
const PLL_AA = 'ad8a5ce2-3421-4d10-b4bb-7855f5f6fa75'
const PLL_AB = '45a604e6-e02c-4ea4-8bdb-4f80e9ff0418'

describe('buildLearnedMethods', () => {
  it('returns an empty result for undefined or empty input', () => {
    expect(buildLearnedMethods(undefined)).toEqual({ total: 0, byPuzzle: [] })
    expect(buildLearnedMethods([])).toEqual({ total: 0, byPuzzle: [] })
  })

  it('joins learned cases with the catalog and counts the total', () => {
    const result = buildLearnedMethods([{ methodSlug: 'pll', count: 2, caseIds: [PLL_AA, PLL_AB] }])

    expect(result.total).toBe(2)
    expect(result.byPuzzle).toHaveLength(1)

    const group = result.byPuzzle[0]
    expect(group.puzzle).toBe('3x3x3')
    expect(group.methods).toHaveLength(1)

    const method = group.methods[0]
    expect(method.set.slug).toBe('pll')
    expect(method.learnedCount).toBe(2)
    expect(method.total).toBeGreaterThanOrEqual(2)
    expect(method.percent).toBe(Math.round((2 / method.total) * 100))
    expect(method.cases.map((c) => c.id).sort()).toEqual([PLL_AA, PLL_AB].sort())
  })

  it('ignores unknown methods and stale case ids', () => {
    const result = buildLearnedMethods([
      { methodSlug: 'does-not-exist', count: 5, caseIds: ['x', 'y'] },
      { methodSlug: 'pll', count: 1, caseIds: ['stale-id-not-in-catalog'] }
    ])

    expect(result.total).toBe(0)
    expect(result.byPuzzle).toEqual([])
  })

  it('groups methods of different puzzles separately', () => {
    const result = buildLearnedMethods([
      { methodSlug: 'pll', count: 1, caseIds: [PLL_AA] },
      { methodSlug: 'pbl', count: 0, caseIds: [] }
    ])

    // pbl has count 0 -> excluded; only the 3x3x3 group remains
    expect(result.byPuzzle.map((g) => g.puzzle)).toEqual(['3x3x3'])
    expect(result.total).toBe(1)
  })
})
