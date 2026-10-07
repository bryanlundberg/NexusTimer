import { describe, expect, it } from 'vitest'
import { AuthError } from '../src/modules/auth/auth.errors'
import {
  createRegistrationService,
  MAX_CODE_ATTEMPTS,
  VERIFICATION_CODE_TTL_MS
} from '../src/modules/auth/registration.service'
import { fakeAccounts, fakeHash, fakeMailer, fakeRepository } from './auth-fakes'

const NOW = 1_700_000_000_000
const request = { name: 'Mateo', email: 'mateo@example.com', password: 'longenough' }

function setup(now = NOW) {
  const accounts = fakeAccounts()
  const repo = fakeRepository()
  const mail = fakeMailer()
  const service = createRegistrationService({
    accounts: accounts.store,
    repository: repo.repository,
    mail: mail.mailer,
    hashPassword: fakeHash,
    now: () => now
  })
  return { service, accounts, repo, mail }
}

describe('registration service', () => {
  it('stores a pending registration and emails a six digit code', async () => {
    const { service, repo, mail } = setup()

    await service.register(request)

    const [pending] = [...repo.pending.values()]
    expect(pending).toMatchObject({ email: request.email, name: 'Mateo', passwordHash: 'hashed:longenough' })
    expect(pending?.code).toMatch(/^\d{6}$/)
    expect(pending?.expiresAt.getTime()).toBe(NOW + VERIFICATION_CODE_TTL_MS)
    expect(mail.sent).toHaveLength(1)
    expect(mail.sent[0]).toMatchObject({ to: request.email, subject: 'Verify your NexusTimer account' })
    expect(mail.sent[0]?.html).toContain(pending?.code)
  })

  it('refuses an email that already has a password', async () => {
    const { service, accounts, mail } = setup()
    accounts.add({ email: request.email, name: 'Other', emailVerified: true, passwordHash: 'x' })

    await expect(service.register(request)).rejects.toMatchObject({ code: 'email-in-use', status: 409 })
    expect(mail.sent).toHaveLength(0)
  })

  it('lets an oauth only account add a password', async () => {
    const { service, accounts } = setup()
    accounts.add({ email: request.email, name: 'Mateo', emailVerified: true })

    await expect(service.register(request)).resolves.toBeUndefined()
  })

  it('replaces the pending code and emails it again when the user registers again', async () => {
    const { service, repo, mail } = setup()

    await service.register(request)
    await service.register(request)

    expect(repo.pending.size).toBe(1)
    expect(mail.sent).toHaveLength(2)
    expect(mail.sent[1]?.html).toContain([...repo.pending.values()][0]?.code)
  })

  it('creates the user with a credential and clears the pending registration', async () => {
    const { service, accounts, repo } = setup()
    await service.register(request)
    const { code } = [...repo.pending.values()][0]!

    await service.confirm({ email: request.email, code })

    const created = await accounts.store.findByEmail(request.email)
    expect(created).toMatchObject({ user: { name: 'Mateo', emailVerified: true }, hasCredential: true })
    expect(repo.pending.size).toBe(0)
  })

  it('links the credential to an existing oauth user and verifies the email', async () => {
    const { service, accounts, repo } = setup()
    const existing = accounts.add({ email: request.email, name: 'Mateo G', emailVerified: false })
    await service.register(request)
    const { code } = [...repo.pending.values()][0]!

    await service.confirm({ email: request.email, code })

    expect(accounts.users.size).toBe(1)
    expect(accounts.users.get(existing.id)).toMatchObject({
      user: { emailVerified: true },
      passwordHash: 'hashed:longenough'
    })
  })

  it('rejects a wrong code', async () => {
    const { service } = setup()
    await service.register(request)

    const error = await service.confirm({ email: request.email, code: '000000' }).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(AuthError)
    expect(error).toMatchObject({ code: 'invalid-or-expired-code', status: 400 })
  })

  it('locks the code after five wrong attempts, even for the right code', async () => {
    const { service, accounts, repo } = setup()
    accounts.add({ email: request.email, name: 'Mateo', emailVerified: true })
    await service.register(request)
    const { code } = [...repo.pending.values()][0]!
    const wrong = code === '000000' ? '111111' : '000000'

    const failures = []
    for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) {
      failures.push(await service.confirm({ email: request.email, code: wrong }).catch((e: unknown) => e))
    }

    expect(failures.slice(0, -1)).toEqual(
      Array(MAX_CODE_ATTEMPTS - 1).fill(expect.objectContaining({ code: 'invalid-or-expired-code' }))
    )
    expect(failures.at(-1)).toMatchObject({ code: 'too-many-attempts', status: 429 })
    await expect(service.confirm({ email: request.email, code })).rejects.toMatchObject({ code: 'too-many-attempts' })
    expect((await accounts.store.findByEmail(request.email))?.hasCredential).toBe(false)
  })

  it('gives a fresh code and fresh attempts when the user registers again after a lockout', async () => {
    const { service, accounts, repo } = setup()
    await service.register(request)
    for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) {
      await service.confirm({ email: request.email, code: 'nope00' }).catch(() => {})
    }

    await service.register(request)
    const { code, attempts } = [...repo.pending.values()][0]!
    expect(attempts).toBe(0)
    await service.confirm({ email: request.email, code })

    expect(await accounts.store.findByEmail(request.email)).toMatchObject({ hasCredential: true })
  })

  it('rejects and forgets an expired code', async () => {
    const early = setup()
    await early.service.register(request)
    const late = createRegistrationService({
      accounts: early.accounts.store,
      repository: early.repo.repository,
      mail: early.mail.mailer,
      hashPassword: fakeHash,
      now: () => NOW + VERIFICATION_CODE_TTL_MS + 1
    })
    const { code } = [...early.repo.pending.values()][0]!

    await expect(late.confirm({ email: request.email, code })).rejects.toMatchObject({ code: 'code-expired' })
    expect(early.repo.pending.size).toBe(0)
  })

  it('removes a half created user when linking the credential fails', async () => {
    const { service, accounts, repo } = setup()
    await service.register(request)
    const { code } = [...repo.pending.values()][0]!
    accounts.store.linkCredential = () => Promise.reject(new Error('write failed'))

    await expect(service.confirm({ email: request.email, code })).rejects.toThrow('write failed')
    expect(accounts.users.size).toBe(0)
    expect(repo.pending.size).toBe(0)
  })
})
