import { z } from 'zod'

export const apiErrorSchema = z.object({
  message: z.string(),
  issues: z.array(z.custom<z.ZodIssue>()).optional()
})

export type ApiError = z.infer<typeof apiErrorSchema>
