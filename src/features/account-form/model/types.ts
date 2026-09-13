import { z } from 'zod'
import { Layers } from '@/shared/types/enums'
import { CUBING_METHODS } from '@/shared/const/cubing-methods'
import { FACE_COLORS, sortFaceColors } from '@/shared/const/face-colors'
import { MAX_PROFILE_LINKS, PROFILE_LINK_MAX_LENGTH, normalizeProfileLink } from '@/shared/lib/profile-links'

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
export const methodSchema = z.enum(CUBING_METHODS)

export const mainColorsSchema = z.array(z.nativeEnum(Layers)).max(FACE_COLORS.length).transform(sortFaceColors)

export const profileLinksSchema = z
  .array(
    z.string().transform((value, ctx) => {
      const href = normalizeProfileLink(value)
      if (href) return href
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid link' })
      return z.NEVER
    })
  )
  .max(MAX_PROFILE_LINKS)
  .transform((links) => [...new Set(links)])

export const accountInfoSchema = z.object({
  pronoun: z.string().optional(),
  country: z.string().optional(),
  name: nameSchema,
  goal: goalSchema.optional(),
  bio: bioSchema.optional(),
  method: methodSchema.or(z.literal('')).optional(),
  mainColors: z.array(z.nativeEnum(Layers)).max(FACE_COLORS.length).optional(),
  links: z
    .array(
      z.object({
        url: z
          .string()
          .trim()
          .max(PROFILE_LINK_MAX_LENGTH)
          .refine((value) => !value || normalizeProfileLink(value) !== null, 'Invalid link')
      })
    )
    .max(MAX_PROFILE_LINKS)
    .optional()
})

export type AccountInfoForm = z.infer<typeof accountInfoSchema>

export interface ProfilePreview {
  name?: string
  bio?: string
  country?: string
  method?: string
  mainColors?: Layers[]
  links?: string[]
}

type PartialForm = {
  [K in keyof AccountInfoForm]?: K extends 'links' ? Array<{ url?: string } | undefined> : AccountInfoForm[K]
}

export function toProfilePreview(values: PartialForm): ProfilePreview {
  return {
    name: values.name?.trim() || undefined,
    bio: values.bio?.trim() || undefined,
    country: values.country || undefined,
    method: values.method || undefined,
    mainColors: sortFaceColors(values.mainColors),
    links: (values.links ?? []).map((link) => normalizeProfileLink(link?.url ?? '')).filter((href) => href !== null)
  }
}
