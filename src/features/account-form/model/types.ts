import { z } from 'zod'

export const accountInfoSchema = z.object({
  pronoun: z.string().optional(),
  country: z.string().optional(),
  name: z.string().min(5, 'Name must be at least 5 characters long'),
  goal: z.string().optional(),
  bio: z.string().optional()
})

export type AccountInfoForm = z.infer<typeof accountInfoSchema>
