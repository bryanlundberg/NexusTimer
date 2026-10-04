import { ALGORITHM_SET_DEFINITIONS } from '@nexustimer/algorithms'
import { describe, expect, it, vi } from 'vitest'
import type { TrainerService } from '../src/modules/trainer/trainer.service'
import { buildTestApp, testSessions } from './helpers'

const USER = 'user-1'
const pllCase = ALGORITHM_SET_DEFINITIONS.find((set) => set.slug === 'pll')!.algorithms[0]!.id
const ollCase = ALGORITHM_SET_DEFINITIONS.find((set) => set.slug === 'oll')!.algorithms[0]!.id

const solve = {
  _id: '64b7f0c2a1b2c3d4e5f60718',
  user: USER,
  methodSlug: 'pll',
  caseId: pllCase,
  timeMs: 1234,
  createdAt: '2026-10-04T10:00:00.000Z',
  updatedAt: '2026-10-04T10:00:00.000Z'
}

const json = (method: string, body: unknown) => ({
  method,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
})

function appWith(overrides: Partial<TrainerService>, userId: string | null = USER) {
  const unused = () => Promise.reject(new Error('not used'))
  const trainer: TrainerService = {
    learned: unused,
    setLearned: unused,
    solves: unused,
    recordSolve: unused,
    deleteSolve: unused,
    stats: unused,
    setTarget: unused,
    ...overrides
  }
  return buildTestApp({ trainer, sessions: testSessions(userId) })
}

const issuePaths = async (res: Response) =>
  ((await res.json()) as { issues: { path: string[]; message: string }[] }).issues.map((issue) => [
    issue.path.join('.'),
    issue.message
  ])

describe('trainer routes', () => {
  it('require a session before validating anything', async () => {
    const app = appWith({}, null)

    for (const [path, init] of [
      ['/api/v1/trainer/learned?methodSlug=pll', undefined],
      ['/api/v1/trainer/solves', json('POST', {})],
      ['/api/v1/trainer/solves/abc', { method: 'DELETE' }],
      ['/api/v1/trainer/stats', json('PATCH', {})]
    ] as const) {
      const res = await app.request(path, init)
      expect(res.status).toBe(401)
    }
  })

  it('lists learned cases', async () => {
    const learned = vi.fn(() => Promise.resolve(['a', 'b']))

    const res = await appWith({ learned }).request('/api/v1/trainer/learned?methodSlug=pll')

    expect(await res.json()).toEqual({ caseIds: ['a', 'b'] })
    expect(learned).toHaveBeenCalledWith(USER, 'pll')
  })

  it('updates a learned case of the catalog', async () => {
    const setLearned = vi.fn(() => Promise.resolve())

    const res = await appWith({ setLearned }).request(
      '/api/v1/trainer/learned',
      json('POST', { methodSlug: 'pll', caseId: pllCase, learned: false })
    )

    expect(await res.json()).toEqual({ ok: true, learned: false })
    expect(setLearned).toHaveBeenCalledWith(USER, { methodSlug: 'pll', caseId: pllCase, learned: false })
  })

  it('rejects methods and cases outside the catalog', async () => {
    const app = appWith({})

    const unknownMethod = await app.request(
      '/api/v1/trainer/solves',
      json('POST', { methodSlug: 'methods.$evil', caseId: pllCase, timeMs: 1 })
    )
    const wrongCase = await app.request(
      '/api/v1/trainer/learned',
      json('POST', { methodSlug: 'pll', caseId: ollCase, learned: true })
    )

    expect(unknownMethod.status).toBe(400)
    expect(await issuePaths(unknownMethod)).toEqual([['methodSlug', 'Unknown methodSlug']])
    expect(wrongCase.status).toBe(400)
    expect(await issuePaths(wrongCase)).toEqual([['caseId', 'Unknown caseId for this method']])
  })

  it('rejects negative or non finite times', async () => {
    const app = appWith({})

    for (const timeMs of [-1, null, '12']) {
      const res = await app.request(
        '/api/v1/trainer/solves',
        json('POST', { methodSlug: 'pll', caseId: pllCase, timeMs })
      )
      expect(res.status).toBe(400)
    }
  })

  it('records a solve with 201', async () => {
    const recordSolve = vi.fn(() => Promise.resolve(solve))

    const res = await appWith({ recordSolve }).request(
      '/api/v1/trainer/solves',
      json('POST', { methodSlug: 'pll', caseId: pllCase, timeMs: 1234 })
    )

    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ solve })
  })

  it('lists solves with the default limit and validates the cursor', async () => {
    const solves = vi.fn(() => Promise.resolve([solve]))
    const app = appWith({ solves })

    const res = await app.request('/api/v1/trainer/solves?methodSlug=pll')
    const badCursor = await app.request('/api/v1/trainer/solves?methodSlug=pll&before=nope')
    const tooMany = await app.request('/api/v1/trainer/solves?methodSlug=pll&limit=101')

    expect(await res.json()).toEqual({ solves: [solve] })
    expect(solves).toHaveBeenCalledWith(USER, { methodSlug: 'pll', limit: 12 })
    expect(badCursor.status).toBe(400)
    expect(tooMany.status).toBe(400)
  })

  it('deletes a solve or answers 404', async () => {
    const deleteSolve = vi.fn((_userId: string, id: string) => Promise.resolve(id === solve._id))
    const app = appWith({ deleteSolve })

    const deleted = await app.request(`/api/v1/trainer/solves/${solve._id}`, { method: 'DELETE' })
    const missing = await app.request('/api/v1/trainer/solves/unknown', { method: 'DELETE' })

    expect(await deleted.json()).toEqual({ ok: true })
    expect(missing.status).toBe(404)
    expect(await missing.json()).toEqual({ message: 'Not found' })
  })

  it('returns one method or every method of the stats', async () => {
    const methods = { pll: { totalSolves: 1, totalTimeMs: 900, bestSingleMs: 900, cases: {} } }
    const app = appWith({ stats: () => Promise.resolve(methods) })

    const one = await app.request('/api/v1/trainer/stats?method=pll')
    const missing = await app.request('/api/v1/trainer/stats?method=oll')
    const all = await app.request('/api/v1/trainer/stats')

    expect(await one.json()).toEqual({ method: 'pll', stats: methods.pll })
    expect(await missing.json()).toEqual({ method: 'oll', stats: null })
    expect(await all.json()).toEqual({ methods })
  })

  it('sets a target of one to five seconds for a known method', async () => {
    const setTarget = vi.fn(() => Promise.resolve())
    const app = appWith({ setTarget })

    const res = await app.request('/api/v1/trainer/stats', json('PATCH', { method: 'pll', targetSeconds: 3 }))
    const outOfRange = await app.request('/api/v1/trainer/stats', json('PATCH', { method: 'pll', targetSeconds: 6 }))
    const unknown = await app.request('/api/v1/trainer/stats', json('PATCH', { method: 'x.y', targetSeconds: 3 }))

    expect(await res.json()).toEqual({ ok: true })
    expect(setTarget).toHaveBeenCalledWith(USER, { method: 'pll', targetSeconds: 3 })
    expect(await issuePaths(outOfRange)).toEqual([['targetSeconds', 'targetSeconds must be 1–5']])
    expect(await issuePaths(unknown)).toEqual([['method', 'Unknown method']])
  })
})
