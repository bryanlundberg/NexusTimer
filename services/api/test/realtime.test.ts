import { createHmac } from 'node:crypto'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildTestApp, testEnv, testSessions } from './helpers'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const ISSUED_AT = 1_700_000_000_000
const GATEWAY_TICKET =
  'eyJzdWIiOiI2NGI3ZjBjMmExYjJjM2Q0ZTVmNjA3MTgiLCJleHAiOjE3MDAwMDAwNjAwMDB9.M2cwXbr6JI22nKGLGKDUfbamHTE5kcoMafQKbQ8fzoo'
const GATEWAY_PROFILE_TICKET =
  'eyJzdWIiOiI2NGI3ZjBjMmExYjJjM2Q0ZTVmNjA3MTgiLCJleHAiOjE3MDAwMDAwNjAwMDAsIm5hbWUiOiJBZGEiLCJpbWFnZSI6Imh0dHBzOi8vY2RuLmV4YW1wbGUudGVzdC9hZGEucG5nIn0.2gm8U_4Vsn8s8amvj5iPZE-Cv1fG4Zw6utfWaWOmcPY'

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

  it('signs the name and image the gateway shows in room member lists', async () => {
    vi.useFakeTimers({ toFake: ['Date'], now: ISSUED_AT })
    const profile = { name: 'Ada', image: 'https://cdn.example.test/ada.png' }

    const res = await requestTicket(buildTestApp({ env: configured, sessions: testSessions(USER, [], profile) }))
    const { ticket } = (await res.json()) as { ticket: string }
    const [payload, signature] = ticket.split('.')

    expect(decodeClaims(ticket)).toEqual({ sub: USER, exp: ISSUED_AT + 60_000, ...profile })
    expect(signature).toBe(createHmac('sha256', 'test-secret').update(payload!).digest('base64url'))
    expect(ticket).toBe(GATEWAY_PROFILE_TICKET)
  })

  it('leaves out an image the user does not have', async () => {
    const res = await requestTicket(
      buildTestApp({ env: configured, sessions: testSessions(USER, [], { name: 'Ada', image: null }) })
    )
    const { ticket } = (await res.json()) as { ticket: string }

    expect(decodeClaims(ticket)).not.toHaveProperty('image')
  })
})

function decodeClaims(ticket: string) {
  return JSON.parse(Buffer.from(ticket.split('.')[0]!, 'base64url').toString())
}
