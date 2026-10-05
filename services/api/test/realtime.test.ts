import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildTestApp, testEnv, testSessions } from './helpers'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const ISSUED_AT = 1_700_000_000_000
const GATEWAY_TICKET =
  'eyJzdWIiOiI2NGI3ZjBjMmExYjJjM2Q0ZTVmNjA3MTgiLCJleHAiOjE3MDAwMDAwNjAwMDB9.M2cwXbr6JI22nKGLGKDUfbamHTE5kcoMafQKbQ8fzoo'

const configured = testEnv({ REALTIME_URL: 'wss://rt.example.test/ws', REALTIME_SECRET: 'test-secret' })

const requestTicket = (app: ReturnType<typeof buildTestApp>) =>
  app.request('/api/v1/realtime/ticket', { method: 'POST' })

describe('POST /api/v1/realtime/ticket', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('rejects anonymous requests', async () => {
    const res = await requestTicket(buildTestApp({ env: configured }))

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'Unauthorized' })
  })

  it('answers 503 when realtime is not configured', async () => {
    const res = await requestTicket(buildTestApp({ sessions: testSessions(USER) }))

    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ message: 'Realtime is not configured' })
  })

  it('issues the ticket the Go gateway verifies in its own tests', async () => {
    vi.useFakeTimers({ toFake: ['Date'], now: ISSUED_AT })

    const res = await requestTicket(buildTestApp({ env: configured, sessions: testSessions(USER) }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ url: 'wss://rt.example.test/ws', ticket: GATEWAY_TICKET })
  })
})
