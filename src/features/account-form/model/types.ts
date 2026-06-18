import { z } from 'zod'

export const NAME_MIN_LENGTH = 3
export const NAME_MAX_LENGTH = 35
export const GOAL_MAX_LENGTH = 30
export const BIO_MAX_LENGTH = 170

export const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, 'Name must be at least 3 characters long')
  .max(NAME_MAX_LENGTH, 'Name must be at most 35 characters long')
export const goalSchema = z.string().trim().max(GOAL_MAX_LENGTH)
export const bioSchema = z.string().trim().max(BIO_MAX_LENGTH)

export const accountInfoSchema = z.object({
  pronoun: z.string().optional(),
  country: z.string().optional(),
  name: nameSchema,
  goal: goalSchema.optional(),
  bio: bioSchema.optional()
})

export type AccountInfoForm = z.infer<typeof accountInfoSchema>
