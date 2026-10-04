import type { SharedSolveDetail } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { SharedSolvesService } from '../src/modules/shared-solves/shared-solves.service'
import { buildTestApp, testSessions } from './helpers'

const USER = 'user-1'
const SLUG = 'k3Fq9xP2aL'

const payload = {
  localSolveId: 'local-1',
  puzzle: '3x3',
  time: 9043,
  plus2: false,
  dnf: false,
  scramble: "R U R' U'",
  solvedAt: 1_700_000_000_000
}

const detail: SharedSolveDetail = {
  slug: SLUG,
  puzzle: '3x3',
  time: 9043,
  plus2: false,
  dnf: false,
  scramble: "R U R' U'",
  solvedAt: 1_700_000_000_000,
  hasReplay: false,
  sharedAt: '2026-10-04T10:00:00.000Z',
  author: { _id: 'owner-1', name: 'Ana', image: 'https://img/ana' },
  isOwner: false
}

const post = (body: unknown) => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
})

function appWith(overrides: Partial<SharedSolvesService>, userId: string | null = USER) {
  const unused = () => Promise.reject(new Error('not used'))
  return buildTestApp({
    sessions: testSessions(userId),
    sharedSolves: {
      myIds: unused,
      share: unused,
      detail: unused,
      remove: unused,
      userPage: unused,
      forgetUser: unused,
      ...overrides
    }
  })
}

describe('shared solves routes', () => {
  it('require a session to list, share or delete', async () => {
    const app = appWith({}, null)

    expect((await app.request('/api/v1/shared-solves')).status).toBe(401)
    expect((await app.request('/api/v1/shared-solves', post(payload))).status).toBe(401)
    expect((await app.request(`/api/v1/shared-solves/${SLUG}`, { method: 'DELETE' })).status).toBe(401)
  })

  it('lists the ids of my shared solves', async () => {
    const res = await appWith({ myIds: () => Promise.resolve({ 'local-1': SLUG }) }).request('/api/v1/shared-solves')

    expect(await res.json()).toEqual({ ids: { 'local-1': SLUG } })
  })

  it('answers 201 for a new share, 200 for an existing one and 429 over the quota', async () => {
    const share = vi
      .fn<SharedSolvesService['share']>()
      .mockResolvedValueOnce({ status: 'created', slug: SLUG })
      .mockResolvedValueOnce({ status: 'existing', slug: SLUG })
      .mockResolvedValueOnce({ status: 'rate-limited' })
    const app = appWith({ share })

    const created = await app.request('/api/v1/shared-solves', post(payload))
    const existing = await app.request('/api/v1/shared-solves', post(payload))
    const limited = await app.request('/api/v1/shared-solves', post(payload))

    expect([created.status, await created.json()]).toEqual([201, { slug: SLUG }])
    expect([existing.status, await existing.json()]).toEqual([200, { slug: SLUG }])
    expect([limited.status, await limited.json()]).toEqual([429, { message: 'Too many requests' }])
    expect(share).toHaveBeenCalledWith(USER, payload)
  })

  it('rejects unknown fields and puzzles', async () => {
    const share = vi.fn<SharedSolvesService['share']>()
    const app = appWith({ share })

    const extra = await app.request('/api/v1/shared-solves', post({ ...payload, user: 'someone-else' }))
    const puzzle = await app.request('/api/v1/shared-solves', post({ ...payload, puzzle: '9x9' }))

    expect(extra.status).toBe(400)
    expect(puzzle.status).toBe(400)
    expect(share).not.toHaveBeenCalled()
  })

  it('shows a shared solve to anonymous viewers and passes signed in viewers along', async () => {
    const detailFor = vi.fn<SharedSolvesService['detail']>(() => Promise.resolve(detail))

    const anonymous = await appWith({ detail: detailFor }, null).request(`/api/v1/shared-solves/${SLUG}`)
    await appWith({ detail: detailFor }).request(`/api/v1/shared-solves/${SLUG}`)

    expect(anonymous.status).toBe(200)
    expect(await anonymous.json()).toEqual(detail)
    expect(detailFor.mock.calls).toEqual([
      [SLUG, null],
      [SLUG, USER]
    ])
  })

  it('answers 404 for malformed slugs without a lookup, and for hidden or missing solves', async () => {
    const detailFor = vi.fn<SharedSolvesService['detail']>(() => Promise.resolve(null))
    const app = appWith({ detail: detailFor })

    const malformed = await app.request('/api/v1/shared-solves/not-a-slug')
    const missing = await app.request(`/api/v1/shared-solves/${SLUG}`)

    expect(malformed.status).toBe(404)
    expect(missing.status).toBe(404)
    expect(detailFor).toHaveBeenCalledTimes(1)
  })

  it('deletes with 204, or 404 when it is not mine', async () => {
    const remove = vi.fn<SharedSolvesService['remove']>().mockResolvedValueOnce(true).mockResolvedValueOnce(false)
    const app = appWith({ remove })

    const deleted = await app.request(`/api/v1/shared-solves/${SLUG}`, { method: 'DELETE' })
    const notMine = await app.request(`/api/v1/shared-solves/${SLUG}`, { method: 'DELETE' })

    expect(deleted.status).toBe(204)
    expect(await deleted.text()).toBe('')
    expect(notMine.status).toBe(404)
  })
})
