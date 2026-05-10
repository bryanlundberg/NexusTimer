import { z } from 'zod'
import { ALGORITHM_SETS } from '@/shared/const/algorithms-sets'
import { TRAINER_PENALTIES } from '@/entities/trainer-solve/model/constants'

export const trainerSolveInputSchema = z
  .object({
    methodSlug: z.string().min(1),
    caseId: z.string().min(1),
    timeMs: z.number().finite().nonnegative(),
    penalty: z.enum(TRAINER_PENALTIES).default('OK')
  })
  .superRefine((data, ctx) => {
    const set = ALGORITHM_SETS.find((s) => s.slug === data.methodSlug)
    if (!set) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['methodSlug'], message: 'Unknown methodSlug' })
      return
    }
    if (!set.algorithms.some((a) => a.id === data.caseId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['caseId'], message: 'Unknown caseId for this method' })
    }
  })

export type TrainerSolveInput = z.infer<typeof trainerSolveInputSchema>
