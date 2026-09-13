import type { UserDocument } from '@/entities/user/model/user'

export const PROFILE_SECTION_IDS = {
  identity: 'profile-identity',
  speedcubing: 'profile-speedcubing',
  links: 'profile-links'
} as const

const COMPLETENESS_FIELDS = [
  { key: 'bio', href: `/account?tab=account#${PROFILE_SECTION_IDS.identity}` },
  { key: 'pronoun', href: `/account?tab=account#${PROFILE_SECTION_IDS.identity}` },
  { key: 'country', href: `/account?tab=account#${PROFILE_SECTION_IDS.identity}` },
  { key: 'goal', href: `/account?tab=account#${PROFILE_SECTION_IDS.speedcubing}` },
  { key: 'method', href: `/account?tab=account#${PROFILE_SECTION_IDS.speedcubing}` },
  { key: 'mainColors', href: `/account?tab=account#${PROFILE_SECTION_IDS.speedcubing}` }
] as const satisfies ReadonlyArray<{ key: keyof UserDocument; href: string }>

export type CompletenessKey = (typeof COMPLETENESS_FIELDS)[number]['key']

export interface ProfileCompleteness {
  percent: number
  done: number
  total: number
  missing: Array<{ key: CompletenessKey; href: string }>
}

const isFilled = (value: unknown) => (Array.isArray(value) ? value.length > 0 : !!value)

export function getProfileCompleteness(user: Partial<UserDocument>): ProfileCompleteness {
  const missing = COMPLETENESS_FIELDS.filter(({ key }) => !isFilled(user[key])).map(({ key, href }) => ({ key, href }))
  const total = COMPLETENESS_FIELDS.length
  const done = total - missing.length
  return { percent: Math.round((done / total) * 100), done, total, missing }
}
