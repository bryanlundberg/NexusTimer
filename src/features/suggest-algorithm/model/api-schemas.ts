import { z } from 'zod'

const NOTATION_REGEX = /^[A-Za-z0-9'’()\[\]\/+\-, ]+$/
const HAS_MOVE_REGEX = /[RLUDFBMESrludfbxyz]/

export const suggestionBodySchema = z.object({
  methodSlug: z.string().min(1).max(50),
  caseName: z.string().trim().min(1).max(100),
  algorithm: z
    .string()
    .trim()
    .min(2)
    .max(300)
    .regex(NOTATION_REGEX, 'Invalid cube notation')
    .regex(HAS_MOVE_REGEX, 'Invalid cube notation'),
  comment: z.string().trim().max(1000).optional(),
  website: z.string().max(0).optional()
})

export type SuggestionBody = z.infer<typeof suggestionBodySchema>
