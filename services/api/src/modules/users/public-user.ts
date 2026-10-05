import type { PublicUser } from '@nexustimer/contracts'

type ProfileFields = {
  name: string
  image: string
  country?: string | null
  pronoun?: string | null
  goal?: string | null
}

const present = <K extends string>(key: K, value: string | null | undefined) =>
  value == null ? {} : ({ [key]: value } as Record<K, string>)

export function toPublicUser(id: string, profile: ProfileFields): PublicUser {
  return {
    _id: id,
    name: profile.name,
    image: profile.image,
    ...present('country', profile.country),
    ...present('pronoun', profile.pronoun),
    ...present('goal', profile.goal)
  }
}
