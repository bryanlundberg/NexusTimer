import { createTicket, TICKET_TTL_MS, verifyTicket } from '@/shared/lib/realtime/ticket'

const SECRET = 'test-secret'
const USER = '64b7f0c2a1b2c3d4e5f60718'
const NOW = 1_700_000_000_000

describe('realtime ticket', () => {
  it('round-trips the user id', () => {
    const ticket = createTicket(USER, SECRET, NOW)
    expect(verifyTicket(ticket, SECRET, NOW + 1000)).toBe(USER)
  })

  it('rejects an expired ticket', () => {
    const ticket = createTicket(USER, SECRET, NOW)
    expect(verifyTicket(ticket, SECRET, NOW + TICKET_TTL_MS + 1)).toBeNull()
  })

  it('rejects a ticket signed with another secret', () => {
    const ticket = createTicket(USER, 'other-secret', NOW)
    expect(verifyTicket(ticket, SECRET, NOW)).toBeNull()
  })

  it('rejects a tampered payload', () => {
    const [, signature] = createTicket(USER, SECRET, NOW).split('.')
    const forged = Buffer.from(JSON.stringify({ sub: 'someone-else', exp: NOW + TICKET_TTL_MS })).toString('base64url')
    expect(verifyTicket(`${forged}.${signature}`, SECRET, NOW)).toBeNull()
  })

  it.each([null, undefined, '', 'no-dot', '.', 'abc.'])('rejects malformed input %s', (ticket) => {
    expect(verifyTicket(ticket, SECRET, NOW)).toBeNull()
  })
})
