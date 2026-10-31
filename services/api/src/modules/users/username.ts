import {
  RESERVED_USERNAMES,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
  usernameIssue
} from '@nexustimer/contracts'
import { Types } from 'mongoose'
import { logger, serializeError } from '../../lib/logger'
import { UserModel } from './users.model'

const FALLBACK_BASE = 'cuber'
const SUFFIX_DIGIT_STEPS = [4, 5, 6]
const ATTEMPTS_PER_STEP = 4
const LAST_RESORT_LENGTH = 12
const LAST_RESORT_ATTEMPTS = 3
const LAST_RESORT_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
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

function withSuffix(base: string, length: number, random: () => number) {
  const digits = String(Math.floor(random() * 10 ** length)).padStart(length, '0')
  const room = USERNAME_MAX_LENGTH - length - 1
  return `${base.slice(0, room).replace(/_+$/, '')}_${digits}`
}

export function usernameCandidates(name: string, random: () => number = Math.random) {
  const base = usernameBase(name)
  const candidates: string[] = []
  if (base && !RESERVED_USERNAMES.has(base)) candidates.push(base)
  for (const length of SUFFIX_DIGIT_STEPS) {
    for (let i = 0; i < ATTEMPTS_PER_STEP; i++) candidates.push(withSuffix(base ?? FALLBACK_BASE, length, random))
  }
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

export function lastResortUsername(random: () => number = Math.random) {
  let tail = ''
  for (let i = 0; i < LAST_RESORT_LENGTH; i++)
    tail += LAST_RESORT_ALPHABET[Math.floor(random() * LAST_RESORT_ALPHABET.length)]
  return `${FALLBACK_BASE}_${tail}`
}

export type TakenLookup = (candidates: string[]) => Promise<Set<string>>

export const mongoTakenUsernames: TakenLookup = async (candidates) => {
  const docs = await UserModel.find({ username: { $in: candidates } }, { username: 1 }).lean()
  return new Set(docs.map((doc) => doc.username as string))
}

export async function pickUsername(
  name: string,
  lookup: TakenLookup = mongoTakenUsernames,
  random: () => number = Math.random
) {
  const candidates = usernameCandidates(name, random)
  try {
    const taken = await lookup(candidates)
    const free = candidates.find((candidate) => !taken.has(candidate))
    if (free) return free
  } catch (error) {
    logger.error('username lookup failed', { error: serializeError(error) })
  }
  return lastResortUsername(random)
}

export async function assignUsername(
  userId: string,
  name: string,
  store: UsernameStore = mongoUsernameStore,
  random: () => number = Math.random
) {
  const candidates = usernameCandidates(name, random)
  for (let i = 0; i < LAST_RESORT_ATTEMPTS; i++) candidates.push(lastResortUsername(random))

  for (const candidate of candidates) {
    const result = await store.claim(userId, candidate)
    if (result === 'claimed') return candidate
    if (result === 'already_set') return null
  }
  throw new Error(`could not assign a username to ${userId}`)
}
