import { describe, expect, it, vi } from 'vitest'
import { requireUser, type SessionReader } from '../src/http/require-user'
import { buildTestApp, testSessions } from './helpers'

function appWithProbe(sessions: SessionReader) {
  const app = buildTestApp({ sessions })
  app.get('/probe', requireUser(sessions), (c) => Response.json({ userId: c.var.userId }))
  return app
}

describe('requireUser', () => {
  it('reads the session from the request cookies', async () => {
    const sessions = vi.fn(testSessions('user-1'))

    await appWithProbe(sessions).request('/api/probe', { headers: { cookie: 'better-auth.session_token=abc' } })

    expect(sessions.mock.calls[0]?.[0].get('cookie')).toBe('better-auth.session_token=abc')
  })

  it('exposes the user id to the handler', async () => {
    const res = await appWithProbe(testSessions('user-1')).request('/api/probe')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ userId: 'user-1' })
  })

  it('answers 401 without a session', async () => {
    const res = await appWithProbe(testSessions()).request('/api/probe')

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'Unauthorized' })
  })

  it('forwards cookies refreshed while reading the session', async () => {
    const cookies = ['better-auth.session_data=new; Path=/', 'better-auth.session_token=same; Path=/']

    const res = await appWithProbe(testSessions('user-1', cookies)).request('/api/probe')

    expect(res.headers.getSetCookie()).toEqual(cookies)
  })

  it('forwards cookie removals when the session is gone', async () => {
    const cookies = ['better-auth.session_data=; Max-Age=0; Path=/']

    const res = await appWithProbe(testSessions(null, cookies)).request('/api/probe')

    expect(res.status).toBe(401)
    expect(res.headers.getSetCookie()).toEqual(cookies)
  })
})
