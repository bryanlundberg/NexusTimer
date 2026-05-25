import { normalizeOldData } from '@/features/manage-backup/lib/importDataFromFile'
import { makeSolve } from './fixtures/solve'
import { makeCube } from './fixtures/cube'

describe('normalizeOldData', () => {
  it('returns an empty array when given no cubes', () => {
    expect(normalizeOldData([])).toEqual([])
  })

  describe('cube-level normalization', () => {
    it('sets cube.isDeleted to false when undefined', () => {
      const cube = makeCube({ id: 'a', createdAt: 100 })
      delete (cube as Record<string, unknown>).isDeleted
      const [normalized] = normalizeOldData([cube])
      expect(normalized.isDeleted).toBe(false)
    })

    it('keeps cube.isDeleted when explicitly set', () => {
      const cube = makeCube({ id: 'a', createdAt: 100, isDeleted: true })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.isDeleted).toBe(true)
    })

    it('falls back cube.updatedAt to cube.createdAt when missing', () => {
      const cube = makeCube({ id: 'a', createdAt: 100 })
      delete (cube as Record<string, unknown>).updatedAt
      const [normalized] = normalizeOldData([cube])
      expect(normalized.updatedAt).toBe(100)
    })

    it('keeps cube.updatedAt when present', () => {
      const cube = makeCube({ id: 'a', createdAt: 100, updatedAt: 200 })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.updatedAt).toBe(200)
    })

    it('keeps cube.updatedAt when defined even if 0 (uses ??, not truthy check)', () => {
      const cube = makeCube({ id: 'a', createdAt: 100, updatedAt: 0 })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.updatedAt).toBe(0)
    })
  })

  describe('solve-level normalization', () => {
    it('sets solve.isDeleted to false when undefined', () => {
      const solve = makeSolve({ id: 's1' })
      delete (solve as Record<string, unknown>).isDeleted
      const cube = makeCube({ id: 'a', createdAt: 1, sessionSolves: [solve] })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.solves.session[0].isDeleted).toBe(false)
    })

    it('keeps solve.isDeleted when explicitly set', () => {
      const solve = makeSolve({ id: 's1', isDeleted: true })
      const cube = makeCube({ id: 'a', createdAt: 1, sessionSolves: [solve] })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.solves.session[0].isDeleted).toBe(true)
    })

    it('falls back solve.updatedAt to solve.startTime when undefined', () => {
      const solve = makeSolve({ id: 's1', startTime: 555 })
      delete (solve as Record<string, unknown>).updatedAt
      const cube = makeCube({ id: 'a', createdAt: 1, sessionSolves: [solve] })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.solves.session[0].updatedAt).toBe(555)
    })

    it('keeps solve.updatedAt when defined even if 0 (uses ??, not truthy check)', () => {
      const solve = makeSolve({ id: 's1', startTime: 555, updatedAt: 0 })
      const cube = makeCube({ id: 'a', createdAt: 1, sessionSolves: [solve] })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.solves.session[0].updatedAt).toBe(0)
    })

    it('normalizes both session and all buckets', () => {
      const sessSolve = makeSolve({ id: 'sess', startTime: 10 })
      delete (sessSolve as Record<string, unknown>).updatedAt
      const allSolve = makeSolve({ id: 'all', startTime: 20 })
      delete (allSolve as Record<string, unknown>).updatedAt
      const cube = makeCube({ id: 'a', createdAt: 1, sessionSolves: [sessSolve], allSolves: [allSolve] })
      const [normalized] = normalizeOldData([cube])
      expect(normalized.solves.session[0].updatedAt).toBe(10)
      expect(normalized.solves.all[0].updatedAt).toBe(20)
    })
  })

  it('does not mutate the original cube', () => {
    const cube = makeCube({ id: 'a', createdAt: 100 })
    delete (cube as Record<string, unknown>).isDeleted
    normalizeOldData([cube])
    expect((cube as Record<string, unknown>).isDeleted).toBeUndefined()
  })
})
