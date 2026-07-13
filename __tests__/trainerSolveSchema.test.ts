vi.mock('../src/shared/const/algorithms-sets', () => ({
  ALGORITHM_SETS: [
    {
      slug: 'oll',
      algorithms: [{ id: 'oll-1' }, { id: 'oll-2' }]
    },
    {
      slug: 'pll',
      algorithms: [{ id: 'pll-aa' }, { id: 'pll-ab' }]
    }
  ]
}))

import { trainerSolveInputSchema } from '@/entities/trainer-solve/model/schema'

const validInput = {
  methodSlug: 'oll',
  caseId: 'oll-1',
  timeMs: 1234
}

describe('trainerSolveInputSchema', () => {
  describe('happy paths', () => {
    it('accepts a valid payload', () => {
      expect(trainerSolveInputSchema.safeParse(validInput).success).toBe(true)
    })

    it('accepts a timeMs of 0', () => {
      expect(trainerSolveInputSchema.safeParse({ ...validInput, timeMs: 0 }).success).toBe(true)
    })
  })

  describe('methodSlug / caseId refinement', () => {
    it('rejects an unknown methodSlug', () => {
      const result = trainerSolveInputSchema.safeParse({ ...validInput, methodSlug: 'unknown' })
      expect(result.success).toBe(false)
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === 'methodSlug')
        expect(issue?.message).toBe('Unknown methodSlug')
      }
    })

    it('rejects a caseId that does not belong to the given methodSlug', () => {
      const result = trainerSolveInputSchema.safeParse({ ...validInput, methodSlug: 'pll', caseId: 'oll-1' })
      expect(result.success).toBe(false)
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === 'caseId')
        expect(issue?.message).toBe('Unknown caseId for this method')
      }
    })

    it('rejects an empty methodSlug', () => {
      expect(trainerSolveInputSchema.safeParse({ ...validInput, methodSlug: '' }).success).toBe(false)
    })

    it('rejects an empty caseId', () => {
      expect(trainerSolveInputSchema.safeParse({ ...validInput, caseId: '' }).success).toBe(false)
    })
  })

  describe('timeMs validation', () => {
    it('rejects a negative timeMs', () => {
      expect(trainerSolveInputSchema.safeParse({ ...validInput, timeMs: -1 }).success).toBe(false)
    })

    it('rejects Infinity', () => {
      expect(trainerSolveInputSchema.safeParse({ ...validInput, timeMs: Infinity }).success).toBe(false)
    })

    it('rejects NaN', () => {
      expect(trainerSolveInputSchema.safeParse({ ...validInput, timeMs: NaN }).success).toBe(false)
    })
  })
})
