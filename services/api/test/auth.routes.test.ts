import { describe, expect, it, vi } from 'vitest'
import { AuthError } from '../src/modules/auth/auth.errors'
import { buildTestApp, testAuthServices } from './helpers'

const json = (body: unknown) => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body)
})

const validRegistration = { name: '  Mateo  ', email: ' Mateo@Example.com ', password: 'longenough' }

function appWith(overrides: Parameters<typeof testAuthServices>[0]) {
  return buildTestApp({ auth: testAuthServices(overrides) })
}

describe('better-auth handler', () => {
  it('receives every /api/auth request untouched', async () => {
    const handler = vi.fn((_request: Request) => Promise.resolve(Response.json(null)))
    const app = appWith({ handler })

    await app.request('/api/auth/get-session', { headers: { cookie: 'a=1' } })
    await app.request('/api/auth/sign-in/social', json({ provider: 'google' }))

    const [first, second] = handler.mock.calls.map(([request]) => request)
    expect(new URL(first!.url).pathname).toBe('/api/auth/get-session')
    expect(first!.headers.get('cookie')).toBe('a=1')
    expect(second!.method).toBe('POST')
    expect(await second!.json()).toEqual({ provider: 'google' })
  })
})

describe('POST /api/v1/auth/register', () => {
  it('normalizes the payload and answers 201', async () => {
    const register = vi.fn(() => Promise.resolve())
    const app = appWith({ registration: { ...testAuthServices().registration, register } })

    const res = await app.request('/api/v1/auth/register', json(validRegistration))

    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ ok: true })
    expect(register).toHaveBeenCalledWith({ name: 'Mateo', email: 'mateo@example.com', password: 'longenough' })
  })

  it('rejects an invalid payload with the v1 issues shape', async () => {
    const res = await appWith({}).request('/api/v1/auth/register', json({ ...validRegistration, password: 'short' }))
    const body = (await res.json()) as { message: string; issues: { path: string[] }[] }

    expect(res.status).toBe(400)
    expect(body.message).toBe('Invalid request')
    expect(body.issues[0]?.path).toEqual(['password'])
  })

  it('maps auth errors to their status and message', async () => {
    const register = () => Promise.reject(new AuthError('email-in-use', 'Email already in use'))
    const app = appWith({ registration: { ...testAuthServices().registration, register } })

    const res = await app.request('/api/v1/auth/register', json(validRegistration))

    expect(res.status).toBe(409)
    expect(await res.json()).toEqual({ message: 'Email already in use' })
  })

  it('hides unexpected failures behind a 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const register = () => Promise.reject(new Error('mail provider down'))
    const app = appWith({ registration: { ...testAuthServices().registration, register } })

    const res = await app.request('/api/v1/auth/register', json(validRegistration))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})

describe('POST /api/v1/auth/verify-code', () => {
  it('confirms the registration', async () => {
    const confirm = vi.fn(() => Promise.resolve())
    const app = appWith({ registration: { ...testAuthServices().registration, confirm } })

    const res = await app.request('/api/v1/auth/verify-code', json({ email: 'a@b.co', code: '123456' }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(confirm).toHaveBeenCalledWith({ email: 'a@b.co', code: '123456' })
  })

  it('answers 400 for an expired code', async () => {
    const confirm = () => Promise.reject(new AuthError('code-expired', 'Code expired, request a new one'))
    const app = appWith({ registration: { ...testAuthServices().registration, confirm } })

    const res = await app.request('/api/v1/auth/verify-code', json({ email: 'a@b.co', code: '123456' }))

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Code expired, request a new one' })
  })
})

describe('POST /api/v1/auth/forgot-password', () => {
  it('always answers ok so accounts cannot be enumerated', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const request = () => Promise.reject(new Error('mail provider down'))
    const app = appWith({ passwordReset: { ...testAuthServices().passwordReset, request } })

    const res = await app.request('/api/v1/auth/forgot-password', json({ email: 'a@b.co' }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })
})

describe('auth rate limits', () => {
  const denied = () => Promise.resolve(false)
  const fromIp = (body: unknown) => {
    const init = json(body)
    return { ...init, headers: { ...init.headers, 'x-forwarded-for': '203.0.113.7' } }
  }

  it('checks the email and client ip before sending a code', async () => {
    const sendCode = vi.fn(() => Promise.resolve(true))
    const register = vi.fn(() => Promise.resolve())
    const app = appWith({
      registration: { ...testAuthServices().registration, register },
      limits: { ...testAuthServices().limits, sendCode }
    })

    await app.request('/api/v1/auth/register', fromIp(validRegistration))

    expect(sendCode).toHaveBeenCalledWith('mateo@example.com', '203.0.113.7')
    expect(register).toHaveBeenCalled()
  })

  it('answers 429 without emailing once the code limit is reached', async () => {
    const register = vi.fn(() => Promise.resolve())
    const app = appWith({
      registration: { ...testAuthServices().registration, register },
      limits: { ...testAuthServices().limits, sendCode: denied }
    })

    const res = await app.request('/api/v1/auth/register', json(validRegistration))

    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ message: 'Too many requests, please try again later' })
    expect(register).not.toHaveBeenCalled()
  })

  it('answers 429 without checking the code once the ip limit is reached', async () => {
    const checkCode = vi.fn(denied)
    const confirm = vi.fn(() => Promise.resolve())
    const app = appWith({
      registration: { ...testAuthServices().registration, confirm },
      limits: { ...testAuthServices().limits, checkCode }
    })

    const res = await app.request('/api/v1/auth/verify-code', fromIp({ email: 'a@b.co', code: '123456' }))

    expect(res.status).toBe(429)
    expect(checkCode).toHaveBeenCalledWith('203.0.113.7')
    expect(confirm).not.toHaveBeenCalled()
  })

  it('answers 429 without emailing once the reset limit is reached', async () => {
    const sendReset = vi.fn(denied)
    const request = vi.fn(() => Promise.resolve())
    const app = appWith({
      passwordReset: { ...testAuthServices().passwordReset, request },
      limits: { ...testAuthServices().limits, sendReset }
    })

    const res = await app.request('/api/v1/auth/forgot-password', fromIp({ email: 'A@b.co' }))

    expect(res.status).toBe(429)
    expect(sendReset).toHaveBeenCalledWith('a@b.co', '203.0.113.7')
    expect(request).not.toHaveBeenCalled()
  })

  it('maps too many wrong codes to 429', async () => {
    const confirm = () => Promise.reject(new AuthError('too-many-attempts', 'Too many attempts, request a new code'))
    const app = appWith({ registration: { ...testAuthServices().registration, confirm } })

    const res = await app.request('/api/v1/auth/verify-code', json({ email: 'a@b.co', code: '123456' }))

    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ message: 'Too many attempts, request a new code' })
  })
})

describe('/api/v1/auth/reset-password', () => {
  it('requires a token on GET', async () => {
    const res = await appWith({}).request('/api/v1/auth/reset-password')

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Missing token' })
  })

  it('returns the email of a valid token', async () => {
    const validate = vi.fn(() => Promise.resolve({ email: 'a@b.co' }))
    const app = appWith({ passwordReset: { ...testAuthServices().passwordReset, validate } })

    const res = await app.request('/api/v1/auth/reset-password?oobCode=abc')

    expect(await res.json()).toEqual({ ok: true, email: 'a@b.co' })
    expect(validate).toHaveBeenCalledWith('abc')
  })

  it('maps an invalid token to 400', async () => {
    const validate = () => Promise.reject(new AuthError('invalid-or-expired-token', 'Invalid or expired reset link'))
    const app = appWith({ passwordReset: { ...testAuthServices().passwordReset, validate } })

    const res = await app.request('/api/v1/auth/reset-password?oobCode=abc')

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Invalid or expired reset link' })
  })

  it('resets the password on POST', async () => {
    const reset = vi.fn(() => Promise.resolve({ email: 'a@b.co' }))
    const app = appWith({ passwordReset: { ...testAuthServices().passwordReset, reset } })

    const res = await app.request('/api/v1/auth/reset-password', json({ oobCode: 'abc', password: 'longenough' }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, email: 'a@b.co' })
    expect(reset).toHaveBeenCalledWith({ oobCode: 'abc', password: 'longenough' })
  })
})
