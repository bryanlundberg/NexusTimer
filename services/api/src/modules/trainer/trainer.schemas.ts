import { isAlgorithmCase, isAlgorithmSet } from '@nexustimer/algorithms'
import { trainerLearnedInputSchema, trainerSolveInputSchema, trainerTargetInputSchema } from '@nexustimer/contracts'
import { z } from 'zod'

function knownCase({ methodSlug, caseId }: { methodSlug: string; caseId: string }, ctx: z.RefinementCtx) {
  if (!isAlgorithmSet(methodSlug)) {
    ctx.addIssue({ code: 'custom', path: ['methodSlug'], message: 'Unknown methodSlug' })
    return
  }
  if (!isAlgorithmCase(methodSlug, caseId)) {
    ctx.addIssue({ code: 'custom', path: ['caseId'], message: 'Unknown caseId for this method' })
  }
}

export const solveBodySchema = trainerSolveInputSchema.superRefine(knownCase)

export const learnedBodySchema = trainerLearnedInputSchema.superRefine(knownCase)

export const targetBodySchema = trainerTargetInputSchema.superRefine(({ method }, ctx) => {
  if (!isAlgorithmSet(method)) {
    ctx.addIssue({ code: 'custom', path: ['method'], message: 'Unknown method' })
  }
})
