import {
  RESERVED_USERNAMES,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
  usernameIssue
} from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { UserModel } from './users.model'

const FALLBACK_BASE = 'cuber'
const SUFFIX_DIGITS = 4
const MAX_ATTEMPTS = 12
const DUPLICATE_KEY = 11000

export const USERS_VALIDATOR = {
  $jsonSchema: {
    bsonType: 'object',
    properties: {
      username: {
        bsonType: 'string',
        minLength: USERNAME_MIN_LENGTH,
        maxLength: USERNAME_MAX_LENGTH,
        pattern: USERNAME_PATTERN.source
      }
    }
  }
}

export function usernameBase(name: string) {
  const slug = name
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, USERNAME_MAX_LENGTH)
    .replace(/_+$/, '')
  return /[a-z]/.test(slug) && slug.length >= USERNAME_MIN_LENGTH ? slug : null
}

function withSuffix(base: string, random: () => number) {
  const digits = String(Math.floor(random() * 10 ** SUFFIX_DIGITS)).padStart(SUFFIX_DIGITS, '0')
  const room = USERNAME_MAX_LENGTH - SUFFIX_DIGITS - 1
  return `${base.slice(0, room).replace(/_+$/, '')}_${digits}`
}

export function usernameCandidates(name: string, random: () => number = Math.random) {
  const base = usernameBase(name)
  const candidates: string[] = []
  if (base && !RESERVED_USERNAMES.has(base)) candidates.push(base)
  while (candidates.length < MAX_ATTEMPTS) candidates.push(withSuffix(base ?? FALLBACK_BASE, random))
  return candidates.filter((candidate) => usernameIssue(candidate) === null)
}

export type ClaimResult = 'claimed' | 'taken' | 'already_set'

export type UsernameStore = {
  claim(userId: string, username: string): Promise<ClaimResult>
}

export const mongoUsernameStore: UsernameStore = {
  async claim(userId, username) {
    try {
      const result = await UserModel.updateOne(
        { _id: new Types.ObjectId(userId), username: { $exists: false } },
        { $set: { username } }
      )
      return result.modifiedCount === 1 ? 'claimed' : 'already_set'
    } catch (error) {
      if ((error as { code?: number }).code === DUPLICATE_KEY) return 'taken'
      throw error
    }
  }
}

export async function assignUsername(
  userId: string,
  name: string,
  store: UsernameStore = mongoUsernameStore,
  random: () => number = Math.random
) {
  for (const candidate of usernameCandidates(name, random)) {
    const result = await store.claim(userId, candidate)
    if (result === 'claimed') return candidate
    if (result === 'already_set') return null
  }
  throw new Error(`could not assign a username to ${userId}`)
}
