import z from 'zod'

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().optional(),
  image: z.string().optional(),
  pronoun: z.string().optional(),
  timezone: z.string().optional(),
  goal: z.string().optional(),
  bio: z.string().optional()
})

export type User = z.infer<typeof userSchema>
