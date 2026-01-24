import { z } from 'zod'

export const accountInfoSchema = z.object({
  timezone: z.string().optional(),
  pronoun: z.string().optional(),
  name: z.string().min(5, 'Name must be at least 5 characters long'),
  goal: z.string().optional(),
  bio: z.string().optional()
})

export type AccountInfoForm = z.infer<typeof accountInfoSchema>
