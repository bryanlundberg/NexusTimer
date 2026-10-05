import { z } from 'zod'

export const publicUserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  image: z.string(),
  country: z.string().optional(),
  pronoun: z.string().optional(),
  goal: z.string().optional()
})

export type PublicUser = z.infer<typeof publicUserSchema>
