import { z } from 'zod'
import { MAX_PROFILE_LINKS, normalizeProfileLink } from './profile-links'

export enum Layers {
  YELLOW = 'yellow',
  WHITE = 'white',
  GREEN = 'green',
  BLUE = 'blue',
  RED = 'red',
  ORANGE = 'orange'
}

export const FACE_COLORS = [Layers.WHITE, Layers.YELLOW, Layers.GREEN, Layers.BLUE, Layers.RED, Layers.ORANGE] as const

export function isFaceColor(value: unknown): value is Layers {
  return typeof value === 'string' && (FACE_COLORS as readonly string[]).includes(value)
}

export function sortFaceColors(values: readonly unknown[] | null | undefined): Layers[] {
  if (!values?.length) return []
  return FACE_COLORS.filter((color) => values.includes(color))
}

export const CUBING_METHODS = ['cfop', 'roux', 'zz', 'petrus', 'mehta', 'beginner'] as const
export type CubingMethod = (typeof CUBING_METHODS)[number]

export function isCubingMethod(value: unknown): value is CubingMethod {
  return typeof value === 'string' && (CUBING_METHODS as readonly string[]).includes(value)
}

export const NAME_MIN_LENGTH = 3
export const NAME_MAX_LENGTH = 35
export const GOAL_MAX_LENGTH = 30
export const BIO_MAX_LENGTH = 170
export const PRONOUN_MAX_LENGTH = 30

export const nameSchema = z
  .string()
  .trim()
  .min(NAME_MIN_LENGTH, 'Name must be at least 3 characters long')
  .max(NAME_MAX_LENGTH, 'Name must be at most 35 characters long')
export const goalSchema = z.string().trim().max(GOAL_MAX_LENGTH)
export const bioSchema = z.string().trim().max(BIO_MAX_LENGTH)
export const methodSchema = z.enum(CUBING_METHODS)

export const mainColorsSchema = z.array(z.enum(Layers)).max(FACE_COLORS.length).transform(sortFaceColors)

export const profileLinksSchema = z
  .array(
    z.string().transform((value, ctx) => {
      const href = normalizeProfileLink(value)
      if (href) return href
      ctx.addIssue({ code: 'custom', message: 'Invalid link' })
      return z.NEVER
    })
  )
  .max(MAX_PROFILE_LINKS)
  .transform((links) => [...new Set(links)])

export const clearable = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? null : value), schema.nullable()).optional()

export const countryCodeSchema = z.string().length(2).toUpperCase()

export const updateProfileSchema = z
  .object({
    name: nameSchema.optional(),
    image: z.url().optional(),
    bio: clearable(bioSchema),
    pronoun: clearable(z.string().max(PRONOUN_MAX_LENGTH)),
    country: clearable(countryCodeSchema),
    goal: clearable(goalSchema),
    method: clearable(methodSchema),
    mainColors: mainColorsSchema.optional(),
    links: profileLinksSchema.optional()
  })
  .strict()

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
