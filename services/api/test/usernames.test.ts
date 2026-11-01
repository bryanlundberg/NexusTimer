import { describe, expect, it, vi } from 'vitest'
import type { UsernamesRepository } from '../src/modules/usernames/usernames.repository'
import { createUsernamesService, type UsernamesService } from '../src/modules/usernames/usernames.service'
import { buildTestApp, testSessions } from './helpers'

const DAY = 24 * 60 * 60 * 1000
const NOW = Date.parse('2026-11-01T12:00:00.000Z')
const ANA = '64b7f0c2a1b2c3d4e5f60718'
const BEN = '64b7f0c2a1b2c3d4e5f60719'

type Doc = { id: string; username: string; changedAt?: number }

function fakeRepository(docs: Doc[]): UsernamesRepository {
  return {
    async holder(username) {
      return docs.find((d) => d.username === username)?.id ?? null
    },
    async changedAt(userId) {
      const doc = docs.find((d) => d.id === userId)
      return doc ? (doc.changedAt ?? null) : undefined
    },
    async change(userId, username, now) {
      const doc = docs.find((d) => d.id === userId)
      if (!doc) return 'not_found'
      if (doc.username === username) return 'unchanged'
      if (doc.changedAt) return 'locked'
      if (docs.some((d) => d.username === username)) return 'taken'
      doc.username = username
      doc.changedAt = now
      return 'changed'
    }
  }
}

function setup(docs: Doc[], { allowed = true }: { allowed?: boolean } = {}) {
  const forgetProfile = vi.fn(async () => {})
  const service = createUsernamesService({
    repository: fakeRepository(docs),
    limits: { consume: async () => allowed },
    users: { forgetProfile },
    now: () => NOW
  })
  return { service, forgetProfile, docs }
}

const ana = (overrides: Partial<Doc> = {}): Doc => ({ id: ANA, username: 'ana', ...overrides })
const ben = (overrides: Partial<Doc> = {}): Doc => ({ id: BEN, username: 'ben', ...overrides })

describe('username availability', () => {
  it('names the format problem before looking anything up', async () => {
    const { service } = setup([ana()])

    expect(await service.availability(ANA, 'ab')).toEqual({ available: false, issue: 'too_short' })
    expect(await service.availability(ANA, 'admin')).toEqual({ available: false, issue: 'reserved' })
    expect(await service.availability(ANA, 'bob.txt')).toEqual({ available: false, issue: 'reserved' })
    expect(await service.availability(ANA, 'a-b-c')).toEqual({ available: false, issue: 'invalid_format' })
  })

  it('normalizes the input and keeps your own username available', async () => {
    const { service } = setup([ana(), ben()])

    expect(await service.availability(ANA, '  Ana ')).toEqual({ available: true, issue: null })
    expect(await service.availability(ANA, 'Ben')).toEqual({ available: false, issue: 'taken' })
    expect(await service.availability(ANA, 'cam')).toEqual({ available: true, issue: null })
  })

  it('stops answering when rate limited', async () => {
    expect(await setup([ana()], { allowed: false }).service.availability(ANA, 'cam')).toBe('rate-limited')
  })
})

describe('username change', () => {
  it('changes the username once and forgets the cached profile', async () => {
    const { service, forgetProfile, docs } = setup([ana()])

    expect(await service.change(ANA, 'ana_cubes')).toEqual({ username: 'ana_cubes', usernameChangedAt: NOW })
    expect(docs[0]).toMatchObject({ username: 'ana_cubes', changedAt: NOW })
    expect(forgetProfile).toHaveBeenCalledWith(ANA)
  })

  it('frees the old username right away', async () => {
    const { service } = setup([ana(), ben()])

    await service.change(ANA, 'ana_cubes')
    expect(await service.availability(BEN, 'ana')).toEqual({ available: true, issue: null })
    expect(await service.change(BEN, 'ana')).toMatchObject({ username: 'ana' })
  })

  it('locks the username after the first change, however long ago it was', async () => {
    const { service, forgetProfile, docs } = setup([ana()])

    await service.change(ANA, 'ana_cubes')
    expect(await service.change(ANA, 'ana_again')).toBe('locked')
    expect(await setup([ana({ changedAt: NOW - 400 * DAY })]).service.change(ANA, 'ana_cubes')).toBe('locked')
    expect(docs[0]!.username).toBe('ana_cubes')
    expect(forgetProfile).toHaveBeenCalledTimes(1)
  })

  it('refuses a username someone else has', async () => {
    const { service, docs } = setup([ana(), ben()])

    expect(await service.change(ANA, 'ben')).toBe('taken')
    expect(docs[0]!.username).toBe('ana')
  })

  it('answers with the current state when nothing changes', async () => {
    const { service, forgetProfile } = setup([ana({ changedAt: NOW - DAY })])

    expect(await service.change(ANA, 'ana')).toEqual({ username: 'ana', usernameChangedAt: NOW - DAY })
    expect(forgetProfile).not.toHaveBeenCalled()
  })

  it('reports a missing user and rate limits', async () => {
    expect(await setup([]).service.change(ANA, 'ana')).toBe('not_found')
    expect(await setup([ana()], { allowed: false }).service.change(ANA, 'cam')).toBe('rate-limited')
  })
})

const unused = () => Promise.reject(new Error('not used'))

function appWith(usernames: Partial<UsernamesService>, userId: string | null = ANA) {
  return buildTestApp({
    sessions: testSessions(userId),
    usernames: { availability: unused, change: unused, ...usernames }
  })
}

const put = (body: unknown) => ({
  method: 'PUT',
  body: JSON.stringify(body),
  headers: { 'content-type': 'application/json' }
})

describe('username routes', () => {
  it('needs a session', async () => {
    const app = appWith({}, null)

    expect((await app.request('/api/v1/users/username', put({ username: 'cam' }))).status).toBe(401)
    expect((await app.request('/api/v1/users/username-availability?u=cam')).status).toBe(401)
  })

  it('validates and normalizes the username before changing it', async () => {
    const change = vi.fn<UsernamesService['change']>(async (_, username) => ({ username, usernameChangedAt: NOW }))
    const app = appWith({ change })

    expect((await app.request('/api/v1/users/username', put({ username: 'a' }))).status).toBe(400)
    const res = await app.request('/api/v1/users/username', put({ username: ' Cam ' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ username: 'cam', usernameChangedAt: NOW })
    expect(change).toHaveBeenCalledWith(ANA, 'cam')
  })

  it.each(['taken', 'locked'] as const)('answers 409 with %s', async (reason) => {
    const res = await appWith({ change: async () => reason }).request(
      '/api/v1/users/username',
      put({ username: 'cam' })
    )

    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({ message: reason })
  })

  it('checks availability with the query string', async () => {
    const availability = vi.fn<UsernamesService['availability']>(async () => ({ available: true, issue: null }))
    const res = await appWith({ availability }).request('/api/v1/users/username-availability?u=Cam')

    expect(await res.json()).toEqual({ available: true, issue: null })
    expect(availability).toHaveBeenCalledWith(ANA, 'Cam')
    expect(
      (await appWith({ availability: async () => 'rate-limited' }).request('/api/v1/users/username-availability?u=x'))
        .status
    ).toBe(429)
  })
})
