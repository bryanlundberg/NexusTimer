import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { createPasswordResetService, PASSWORD_RESET_TTL_MS } from '../src/modules/auth/password-reset.service'
import { fakeAccounts, fakeHash, fakeMailer, fakeRepository } from './auth-fakes'

const NOW = 1_700_000_000_000
const APP_URL = 'https://beta.nexustimer.com'

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')

function setup() {
  const accounts = fakeAccounts()
  const repo = fakeRepository()
  const mail = fakeMailer()
  let now = NOW
  const service = createPasswordResetService({
    accounts: accounts.store,
    repository: repo.repository,
    mail: mail.mailer,
    hashPassword: fakeHash,
    appUrl: APP_URL,
    now: () => now
  })
  const advance = (ms: number) => {
    now += ms
  }
  const emailedCode = () => mail.sent.at(-1)?.html.match(/oobCode=([0-9a-f]{64})/)?.[1] ?? ''
  return { service, accounts, repo, mail, advance, emailedCode }
}

describe('password reset service', () => {
  it('emails a reset link to accounts with a password and stores only its hash', async () => {
    const { service, accounts, repo, mail, emailedCode } = setup()
    const user = accounts.add({ email: 'a@b.co', name: 'Ana', emailVerified: true, passwordHash: 'old' })

    await service.request('a@b.co')

    const oobCode = emailedCode()
    const [token] = [...repo.tokens.values()]
    expect(oobCode).toMatch(/^[0-9a-f]{64}$/)
    expect(mail.sent[0]).toMatchObject({ to: 'a@b.co', subject: 'Reset your NexusTimer password' })
    expect(mail.sent[0]?.html).toContain(`${APP_URL}/reset-password?oobCode=${oobCode}`)
    expect(token).toEqual({
      id: expect.any(String),
      userId: user.id,
      tokenHash: sha256(oobCode),
      expiresAt: new Date(NOW + PASSWORD_RESET_TTL_MS)
    })
  })

  it('does not accept the stored hash as a link', async () => {
    const { service, accounts, repo } = setup()
    accounts.add({ email: 'a@b.co', name: 'Ana', emailVerified: true, passwordHash: 'old' })
    await service.request('a@b.co')
    const { tokenHash } = [...repo.tokens.values()][0]!

    await expect(service.validate(tokenHash)).rejects.toMatchObject({ code: 'invalid-or-expired-token' })
  })

  it('replaces the previous link of the same user on a new request', async () => {
    const { service, accounts, repo, emailedCode } = setup()
    accounts.add({ email: 'a@b.co', name: 'Ana', emailVerified: true, passwordHash: 'old' })
    accounts.add({ email: 'other@b.co', name: 'Other', emailVerified: true, passwordHash: 'old' })
    await service.request('other@b.co')
    const otherCode = emailedCode()
    await service.request('a@b.co')
    const first = emailedCode()

    await service.request('a@b.co')

    expect(repo.tokens.size).toBe(2)
    await expect(service.validate(first)).rejects.toMatchObject({ code: 'invalid-or-expired-token' })
    await expect(service.validate(emailedCode())).resolves.toEqual({ email: 'a@b.co' })
    await expect(service.validate(otherCode)).resolves.toEqual({ email: 'other@b.co' })
  })

  it('does nothing for unknown emails or oauth only accounts', async () => {
    const { service, accounts, repo, mail } = setup()
    accounts.add({ email: 'oauth@b.co', name: 'Oauth', emailVerified: true })

    await service.request('nobody@b.co')
    await service.request('oauth@b.co')

    expect(repo.tokens.size).toBe(0)
    expect(mail.sent).toHaveLength(0)
  })

  it('validates a live token', async () => {
    const { service, accounts, emailedCode } = setup()
    accounts.add({ email: 'a@b.co', name: 'Ana', emailVerified: true, passwordHash: 'old' })
    await service.request('a@b.co')

    await expect(service.validate(emailedCode())).resolves.toEqual({ email: 'a@b.co' })
  })

  it('rejects unknown and expired tokens, forgetting the expired one', async () => {
    const { service, accounts, repo, advance, emailedCode } = setup()
    accounts.add({ email: 'a@b.co', name: 'Ana', emailVerified: true, passwordHash: 'old' })
    await service.request('a@b.co')
    const oobCode = emailedCode()

    await expect(service.validate('unknown')).rejects.toMatchObject({ code: 'invalid-or-expired-token' })

    advance(PASSWORD_RESET_TTL_MS + 1)
    await expect(service.validate(oobCode)).rejects.toMatchObject({ code: 'invalid-or-expired-token' })
    expect(repo.tokens.size).toBe(0)
  })

  it('rejects a token whose user is gone', async () => {
    const { service, accounts, repo, emailedCode } = setup()
    const user = accounts.add({ email: 'a@b.co', name: 'Ana', emailVerified: true, passwordHash: 'old' })
    await service.request('a@b.co')
    const oobCode = emailedCode()
    await accounts.store.deleteUser(user.id)

    await expect(service.validate(oobCode)).rejects.toMatchObject({ code: 'invalid-or-expired-token' })
    expect(repo.tokens.size).toBe(0)
  })

  it('sets the new password, signs out every session and burns every link of the user', async () => {
    const { service, accounts, repo, emailedCode } = setup()
    const user = accounts.add({ email: 'a@b.co', name: 'Ana', emailVerified: true, passwordHash: 'old', sessions: 3 })
    await service.request('a@b.co')
    const oobCode = emailedCode()
    await repo.repository.createResetToken({
      userId: user.id,
      tokenHash: sha256('stray'),
      expiresAt: new Date(NOW + 1)
    })

    await expect(service.reset({ oobCode, password: 'brand-new-pass' })).resolves.toEqual({ email: 'a@b.co' })

    expect(accounts.users.get(user.id)).toMatchObject({ passwordHash: 'hashed:brand-new-pass', sessions: 0 })
    expect(repo.tokens.size).toBe(0)
    await expect(service.reset({ oobCode, password: 'again-again' })).rejects.toMatchObject({
      code: 'invalid-or-expired-token'
    })
  })
})
