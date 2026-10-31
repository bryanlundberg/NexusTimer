import { usernameIssue, usernameSchema } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import {
  type ClaimResult,
  USERS_VALIDATOR,
  type UsernameStore,
  assignUsername,
  lastResortUsername,
  pickUsername,
  usernameBase,
  usernameCandidates
} from '../src/modules/users/username'

const fixedRandom = () => 0.4821

function fakeStore(taken: string[], alreadySet = false) {
  const claims: string[] = []
  const store: UsernameStore = {
    async claim(_userId, username): Promise<ClaimResult> {
      claims.push(username)
      if (alreadySet) return 'already_set'
      return taken.includes(username) ? 'taken' : 'claimed'
    }
  }
  return { store, claims }
}

describe('username rules', () => {
  it('accepts lowercase letters, digits, underscores and inner dots', () => {
    for (const ok of ['abc', 'cube_king', 'red.sito', 'a_b.c_d', '___', 'a'.repeat(20)]) {
      expect(usernameIssue(ok), ok).toBeNull()
    }
  })

  it('names the problem with each invalid username', () => {
    expect(usernameIssue('ab')).toBe('too_short')
    expect(usernameIssue('a'.repeat(21))).toBe('too_long')
    expect(usernameIssue('.abc')).toBe('invalid_format')
    expect(usernameIssue('abc.')).toBe('invalid_format')
    expect(usernameIssue('a..bc')).toBe('invalid_format')
    expect(usernameIssue('Abc')).toBe('invalid_format')
    expect(usernameIssue('ab-c')).toBe('invalid_format')
    expect(usernameIssue('admin')).toBe('reserved')
  })

  it('normalizes input before validating it in the schema', () => {
    expect(usernameSchema.parse('  RedSito ')).toBe('redsito')
    const result = usernameSchema.safeParse('a..b')
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('invalid_format')
  })

  it('keeps the MongoDB validator in agreement with the app rules', () => {
    const rule = USERS_VALIDATOR.$jsonSchema.properties.username
    const pattern = new RegExp(rule.pattern)
    const samples = [
      'abc',
      'cube_king',
      'red.sito',
      'ab',
      'a'.repeat(20),
      'a'.repeat(21),
      '.abc',
      'abc.',
      'a..b',
      'Abc',
      'ab-c',
      'ñandu'
    ]
    for (const sample of samples) {
      const mongoAccepts = sample.length >= rule.minLength && sample.length <= rule.maxLength && pattern.test(sample)
      expect(mongoAccepts, sample).toBe(usernameIssue(sample) === null)
    }
  })
})

describe('username generation', () => {
  it('slugs display names into a base', () => {
    expect(usernameBase('Cube king')).toBe('cube_king')
    expect(usernameBase('raptorclaw')).toBe('raptorclaw')
    expect(usernameBase('José Pérez')).toBe('jose_perez')
    expect(usernameBase('  --Mia!!  ')).toBe('mia')
    expect(usernameBase('Cuber 🧊 Pro')).toBe('cuber_pro')
    expect(usernameBase('a very long display name for a cuber')).toBe('a_very_long_display')
  })

  it('has no base when the name has no latin letters or is too short', () => {
    expect(usernameBase('魔方小王')).toBeNull()
    expect(usernameBase('12345')).toBeNull()
    expect(usernameBase('Al')).toBeNull()
    expect(usernameBase('🧊🔥✨')).toBeNull()
  })

  it('tries the bare base first and then suffixed variants that fit', () => {
    const candidates = usernameCandidates('Cube king', fixedRandom)
    expect(candidates[0]).toBe('cube_king')
    expect(candidates[1]).toBe('cube_king_4821')
    for (const candidate of candidates) expect(usernameIssue(candidate), candidate).toBeNull()
  })

  it('grows the suffix from 4 to 6 digits so common bases never run out', () => {
    const candidates = usernameCandidates('Cube king', fixedRandom)
    expect(candidates).toHaveLength(13)
    expect(candidates.slice(1, 5).every((c) => c === 'cube_king_4821')).toBe(true)
    expect(candidates[5]).toBe('cube_king_48210')
    expect(candidates[9]).toBe('cube_king_482100')

    const long = usernameCandidates('abcdefghijklmnopqrst', fixedRandom)
    expect(long[12]).toBe('abcdefghijklm_482100')
    for (const candidate of long) expect(candidate.length, candidate).toBeLessThanOrEqual(20)
  })

  it('suffixes reserved bases and falls back to cuber', () => {
    expect(usernameCandidates('Admin', fixedRandom)[0]).toBe('admin_4821')
    expect(usernameCandidates('魔方小王', fixedRandom)[0]).toBe('cuber_4821')
  })

  it('trims long bases so the suffixed username stays within the limit', () => {
    const [, suffixed] = usernameCandidates('abcdefghijklmnopqrst', fixedRandom)
    expect(suffixed).toBe('abcdefghijklmno_4821')
    expect(suffixed?.length).toBe(20)
  })
})

describe('assignUsername', () => {
  it('claims the bare base when it is free', async () => {
    const { store, claims } = fakeStore([])
    expect(await assignUsername('u1', 'Cube king', store, fixedRandom)).toBe('cube_king')
    expect(claims).toEqual(['cube_king'])
  })

  it('moves on to a suffixed name when the base is taken', async () => {
    const { store, claims } = fakeStore(['cube_king'])
    expect(await assignUsername('u1', 'Cube king', store, fixedRandom)).toBe('cube_king_4821')
    expect(claims).toEqual(['cube_king', 'cube_king_4821'])
  })

  it('stops when the user already has a username', async () => {
    const { store, claims } = fakeStore([], true)
    expect(await assignUsername('u1', 'Cube king', store, fixedRandom)).toBeNull()
    expect(claims).toEqual(['cube_king'])
  })

  it('falls back to a random username when every candidate is taken', async () => {
    const { store } = fakeStore(usernameCandidates('Cube king', fixedRandom))
    expect(await assignUsername('u1', 'Cube king', store, fixedRandom)).toBe(lastResortUsername(fixedRandom))
  })

  it('only gives up when even the random usernames are taken', async () => {
    const { store } = fakeStore([...usernameCandidates('Cube king', fixedRandom), lastResortUsername(fixedRandom)])
    await expect(assignUsername('u1', 'Cube king', store, fixedRandom)).rejects.toThrow('could not assign')
  })
})

describe('pickUsername', () => {
  it('picks the first candidate nobody has', async () => {
    const lookup = async () => new Set(['cube_king'])
    expect(await pickUsername('Cube king', lookup, fixedRandom)).toBe('cube_king_4821')
  })

  it('uses a random username when every candidate is taken', async () => {
    const lookup = async (candidates: string[]) => new Set(candidates)
    expect(await pickUsername('Cube king', lookup, fixedRandom)).toBe(lastResortUsername(fixedRandom))
  })

  it('still returns a username when the database lookup fails', async () => {
    const lookup = async () => Promise.reject(new Error('mongo down'))
    expect(await pickUsername('Cube king', lookup, fixedRandom)).toBe(lastResortUsername(fixedRandom))
  })

  it('gives emoji-only names a cuber username', async () => {
    const lookup = async () => new Set<string>()
    expect(await pickUsername('🧊🔥', lookup, fixedRandom)).toBe('cuber_4821')
    expect(await pickUsername('Cuber 🧊 Pro', lookup, fixedRandom)).toBe('cuber_pro')
  })

  it('makes valid random usernames', () => {
    const username = lastResortUsername()
    expect(username).toMatch(/^cuber_[a-z0-9]{12}$/)
    expect(usernameIssue(username)).toBeNull()
  })
})
