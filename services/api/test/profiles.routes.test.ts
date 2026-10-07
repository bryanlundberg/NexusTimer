import type { PublicProfile } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { ProfilesService } from '../src/modules/profiles/profiles.service'
import { buildTestApp, testSessions } from './helpers'

const USER = '64b7f0c2a1b2c3d4e5f60718'

const profile: PublicProfile = {
  _id: USER,
  name: 'Ana',
  image: 'img.png',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}

const patch = (body: unknown) => ({
  method: 'PATCH',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
})

function appWith(overrides: Partial<ProfilesService>, userId: string | null = USER) {
  const unused = () => Promise.reject(new Error('not used'))
  return buildTestApp({
    sessions: testSessions(userId),
    profiles: {
      list: unused,
      profile: unused,
      update: unused,
      learned: unused,
      stats: unused,
      sharedSolves: unused,
      ...overrides
    }
  })
}

describe('profiles routes', () => {
  it('normalizes the list query and passes the viewer', async () => {
    const list = vi.fn<ProfilesService['list']>(() => Promise.resolve({ events: [], page: 1, pages: 0, docs: 0 }))

    await appWith({ list }, null).request('/api/v1/users?page=-4&name=%20ana%20&country=mx')
    await appWith({ list }).request('/api/v1/users')

    expect(list.mock.calls).toEqual([
      [{ page: 1, name: 'ana', country: 'MX' }, null],
      [{ page: 1, name: '', country: '' }, USER]
    ])
  })

  it('answers the profile or 404 with the v1 message', async () => {
    const found = await appWith({ profile: () => Promise.resolve(profile) }, null).request(`/api/v1/users/${USER}`)
    const missing = await appWith({ profile: () => Promise.resolve(null) }).request('/api/v1/users/unknown')

    expect(await found.json()).toEqual(profile)
    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({ message: 'User not found' })
  })

  it('only lets users edit their own profile', async () => {
    const update = vi.fn<ProfilesService['update']>()

    const anonymous = await appWith({ update }, null).request(`/api/v1/users/${USER}`, patch({ name: 'Ana' }))
    const someoneElse = await appWith({ update }, 'other-user').request(`/api/v1/users/${USER}`, patch({ name: 'Ana' }))

    expect(anonymous.status).toBe(401)
    expect(someoneElse.status).toBe(401)
    expect(update).not.toHaveBeenCalled()
  })

  it('cleans the profile update before saving it', async () => {
    const update = vi.fn<ProfilesService['update']>(() => Promise.resolve(profile))

    const res = await appWith({ update }).request(
      `/api/v1/users/${USER}`,
      patch({ name: '  Ana  ', bio: '', country: 'mx', links: ['instagram.com/ana', 'instagram.com/ana'] })
    )

    expect(res.status).toBe(200)
    expect(update).toHaveBeenCalledWith(USER, {
      name: 'Ana',
      bio: null,
      country: 'MX',
      links: ['https://instagram.com/ana']
    })
  })

  it('rejects unknown countries and fields', async () => {
    const update = vi.fn<ProfilesService['update']>()
    const app = appWith({ update })

    const country = await app.request(`/api/v1/users/${USER}`, patch({ country: 'ZZ' }))
    const extra = await app.request(`/api/v1/users/${USER}`, patch({ email: 'new@mail.test' }))
    const image = await app.request(`/api/v1/users/${USER}`, patch({ image: 'https://tracker.test/pixel.png' }))
    const body = (await country.json()) as { issues: { path: string[]; message: string }[] }

    expect(country.status).toBe(400)
    expect(body.issues).toEqual([expect.objectContaining({ path: ['country'], message: 'Invalid country code' })])
    expect(extra.status).toBe(400)
    expect(image.status).toBe(400)
    expect(update).not.toHaveBeenCalled()
  })

  it('serves learned cases, stats and shared solves for any viewer', async () => {
    const learned = vi.fn<ProfilesService['learned']>(() => Promise.resolve({ total: 0, methods: [], hidden: true }))
    const stats = vi.fn<ProfilesService['stats']>(() => Promise.resolve({ stats: null }))
    const sharedSolves = vi.fn<ProfilesService['sharedSolves']>(() =>
      Promise.resolve({ items: [], total: 0, nextCursor: null })
    )
    const app = appWith({ learned, stats, sharedSolves }, null)

    expect(await (await app.request(`/api/v1/users/${USER}/learned`)).json()).toEqual({
      total: 0,
      methods: [],
      hidden: true
    })
    expect(await (await app.request(`/api/v1/users/${USER}/stats`)).json()).toEqual({ stats: null })
    await app.request(`/api/v1/users/${USER}/shared-solves?cursor=abc`)

    expect(sharedSolves).toHaveBeenCalledWith(USER, null, 'abc')
  })
})
