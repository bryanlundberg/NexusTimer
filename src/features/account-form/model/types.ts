import * as z from 'zod'
import {
  bioSchema,
  FACE_COLORS,
  goalSchema,
  Layers,
  MAX_PROFILE_LINKS,
  methodSchema,
  nameSchema,
  normalizeProfileLink,
  PROFILE_LINK_MAX_LENGTH,
  sortFaceColors
} from '@nexustimer/contracts'

export {
  BIO_MAX_LENGTH,
  bioSchema,
  GOAL_MAX_LENGTH,
  goalSchema,
  mainColorsSchema,
  methodSchema,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  nameSchema,
  profileLinksSchema
} from '@nexustimer/contracts'

export const accountInfoSchema = z.object({
  pronoun: z.string().optional(),
  country: z.string().optional(),
  name: nameSchema,
  goal: goalSchema.optional(),
  bio: bioSchema.optional(),
  method: methodSchema.or(z.literal('')).optional(),
  mainColors: z.array(z.enum(Layers)).max(FACE_COLORS.length).optional(),
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
