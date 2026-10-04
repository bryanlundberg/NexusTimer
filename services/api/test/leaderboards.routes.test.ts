import { describe, expect, it, vi } from 'vitest'
import type { LeaderboardsService } from '../src/modules/solves/leaderboards.service'
import { buildTestApp } from './helpers'

const result = { solves: [], nextRefreshAt: '2026-10-04T14:00:00.000Z', secondsUntilNextRefresh: 2400 }

function appWith(get: LeaderboardsService['get']) {
  return buildTestApp({ leaderboards: { get } })
}

describe('GET /api/v1/leaderboards', () => {
  it('answers the board with a shared cache lifetime until the next refresh', async () => {
    const get = vi.fn(() => Promise.resolve(result))

    const res = await appWith(get).request('/api/v1/leaderboards?puzzle=2x2x2&smart=true&unique=false')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ solves: [], nextRefreshAt: '2026-10-04T14:00:00.000Z' })
    expect(res.headers.get('cache-control')).toBe('public, max-age=0, s-maxage=2400')
    expect(get).toHaveBeenCalledWith({ puzzle: '2x2x2', smart: true, unique: false })
  })

  it('accepts no filters at all', async () => {
    const get = vi.fn(() => Promise.resolve(result))

    await appWith(get).request('/api/v1/leaderboards')

    expect(get).toHaveBeenCalledWith({})
  })

  it('rejects an unknown puzzle with the v1 query error', async () => {
    const res = await appWith(() => Promise.resolve(result)).request('/api/v1/leaderboards?puzzle=4x4x4')
    const body = (await res.json()) as { message: string; issues: { path: string[] }[] }

    expect(res.status).toBe(400)
    expect(body.message).toBe('Invalid query')
    expect(body.issues[0]?.path).toEqual(['puzzle'])
  })

  it('hides failures behind a 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await appWith(() => Promise.reject(new Error('mongo down'))).request('/api/v1/leaderboards')

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})
