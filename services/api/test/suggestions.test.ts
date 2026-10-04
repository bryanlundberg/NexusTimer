import { createVerify, generateKeyPairSync } from 'node:crypto'
import type { AlgorithmSuggestionInput } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import { createGithub } from '../src/infra/github'
import { createSuggestionLimits } from '../src/modules/algorithms/suggestions.limits'
import { createSuggestionsService, type SuggestionsService } from '../src/modules/algorithms/suggestions.service'
import { fakeRedis } from './fake-redis'
import { buildTestApp } from './helpers'

const NOW = Date.UTC(2026, 9, 4, 10, 0, 0)

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' }
})

type Call = { url: string; init: RequestInit }

function fakeGithubApi() {
  const calls: Call[] = []
  let tokens = 0
  const request = async (url: string | URL | Request, init: RequestInit = {}) => {
    calls.push({ url: String(url), init })
    if (String(url).endsWith('/access_tokens')) {
      tokens++
      return Response.json({ token: `token-${tokens}`, expires_at: new Date(NOW + 60 * 60 * 1000).toISOString() })
    }
    return Response.json(
      { html_url: 'https://github.com/bryanlundberg/NexusTimer/issues/7', number: 7 },
      { status: 201 }
    )
  }
  return { calls, request: request as typeof fetch }
}

const header = (call: Call, name: string) => new Headers(call.init.headers).get(name)

describe('github client', () => {
  it('signs an app JWT, caches the installation token and creates issues in the repo', async () => {
    const api = fakeGithubApi()
    let now = NOW
    const github = createGithub({
      appId: '12345',
      privateKey: privateKey.replace(/\n/g, '\\n'),
      installationId: '678',
      repo: 'bryanlundberg/NexusTimer',
      fetch: api.request,
      now: () => now
    })

    await github.createIssue({ title: 'one', body: 'first' })
    now += 30 * 60 * 1000
    const issue = await github.createIssue({ title: 'two', body: 'second' })

    expect(issue).toEqual({ html_url: 'https://github.com/bryanlundberg/NexusTimer/issues/7', number: 7 })
    expect(api.calls.map((call) => call.url)).toEqual([
      'https://api.github.com/app/installations/678/access_tokens',
      'https://api.github.com/repos/bryanlundberg/NexusTimer/issues',
      'https://api.github.com/repos/bryanlundberg/NexusTimer/issues'
    ])
    expect(header(api.calls[2]!, 'authorization')).toBe('Bearer token-1')
    expect(JSON.parse(String(api.calls[2]!.init.body))).toEqual({ title: 'two', body: 'second' })

    const jwt = header(api.calls[0]!, 'authorization')!.replace('Bearer ', '')
    const [head, payload, signature] = jwt.split('.')
    expect(JSON.parse(Buffer.from(head!, 'base64url').toString())).toEqual({ alg: 'RS256', typ: 'JWT' })
    expect(JSON.parse(Buffer.from(payload!, 'base64url').toString())).toEqual({
      iat: NOW / 1000 - 60,
      exp: NOW / 1000 + 9 * 60,
      iss: '12345'
    })
    const verifier = createVerify('RSA-SHA256').update(`${head}.${payload}`)
    expect(verifier.verify(publicKey, Buffer.from(signature!, 'base64url'))).toBe(true)
  })

  it('asks for a new token shortly before the cached one expires', async () => {
    const api = fakeGithubApi()
    let now = NOW
    const github = createGithub({
      appId: '1',
      privateKey,
      installationId: '2',
      repo: 'o/r',
      fetch: api.request,
      now: () => now
    })

    await github.createIssue({ title: 'a', body: 'a' })
    now += 59 * 60 * 1000 + 1
    await github.createIssue({ title: 'b', body: 'b' })

    expect(api.calls.filter((call) => call.url.endsWith('/access_tokens'))).toHaveLength(2)
  })

  it('fails the call, not the boot, when the app is not configured, and surfaces GitHub errors', async () => {
    const unconfigured = createGithub({ repo: 'o/r', fetch: fakeGithubApi().request })
    await expect(unconfigured.createIssue({ title: 'a', body: 'a' })).rejects.toThrow(/not configured/)

    const rejecting = createGithub({
      appId: '1',
      privateKey,
      installationId: '2',
      repo: 'o/r',
      fetch: (async () => new Response('Bad credentials', { status: 401 })) as typeof fetch
    })
    await expect(rejecting.createIssue({ title: 'a', body: 'a' })).rejects.toThrow(
      /installation token: 401 Bad credentials/
    )
  })
})

const suggestion: AlgorithmSuggestionInput = {
  methodSlug: 'pll',
  caseName: 'Aa',
  algorithm: "x R' U R' D2 R U' R' D2 R2 x'",
  comment: 'Faster for me'
}

describe('suggestions service', () => {
  it('opens an issue that names the set, the case and the data file', async () => {
    const createIssue = vi.fn(async () => ({ html_url: 'https://github.com/o/r/issues/1', number: 1 }))
    const service = createSuggestionsService({ github: { createIssue }, limits: { consume: async () => true } })

    expect(await service.suggest(suggestion)).toEqual({ url: 'https://github.com/o/r/issues/1' })

    const [{ title, body }] = createIssue.mock.calls[0] as unknown as [{ title: string; body: string }]
    expect(title).toBe('[Algorithm suggestion] PLL - Aa')
    expect(body).toContain('**Set:** PLL (`pll`)')
    expect(body).toContain('**Puzzle:** 3x3x3')
    expect(body).toContain("x R' U R' D2 R U' R' D2 R2 x'")
    expect(body).toContain('**Comment:**\nFaster for me')
    expect(body).toMatch(/\*\*File:\*\* `packages\/algorithms\/src\/data\/[a-z0-9-]+\.ts`/)
  })

  it('refuses a set outside the catalog without calling GitHub', async () => {
    const createIssue = vi.fn()
    const service = createSuggestionsService({ github: { createIssue }, limits: { consume: async () => true } })

    expect(await service.suggest({ ...suggestion, methodSlug: 'made-up' })).toEqual({ error: 'unknown-set' })
    expect(createIssue).not.toHaveBeenCalled()
  })

  it('allows five suggestions per hour per IP and fails open without Redis', async () => {
    const redis = fakeRedis()
    const limits = createSuggestionLimits(redis.provider)

    const results = []
    for (let i = 0; i < 6; i++) results.push(await limits.consume('1.2.3.4'))

    expect(results).toEqual([true, true, true, true, true, false])
    expect(await limits.consume('5.6.7.8')).toBe(true)
    expect(redis.ttls.get('rate-limit:algorithm-suggestions:1.2.3.4')).toBe(3600)

    vi.spyOn(console, 'log').mockImplementation(() => {})
    redis.state.down = true
    expect(await limits.consume('1.2.3.4')).toBe(true)
  })
})

describe('suggestions route', () => {
  const post = (body: unknown, headers: Record<string, string> = {}) => ({
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body)
  })

  function appWith(overrides: Partial<SuggestionsService>) {
    const unused = () => Promise.reject(new Error('not used'))
    return buildTestApp({ suggestions: { allow: unused, suggest: unused, ...overrides } })
  }

  it('needs no session and counts the client IP before reading the body', async () => {
    const allow = vi.fn<SuggestionsService['allow']>(async () => false)
    const suggest = vi.fn<SuggestionsService['suggest']>()

    const res = await appWith({ allow, suggest }).request(
      '/api/v1/algorithms/suggestions',
      post({ nope: true }, { 'x-forwarded-for': '9.9.9.9, 10.0.0.1' })
    )

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Too many suggestions, please try again later' })
    expect(allow).toHaveBeenCalledWith('9.9.9.9')
    expect(suggest).not.toHaveBeenCalled()
  })

  it('validates notation and the honeypot', async () => {
    const suggest = vi.fn<SuggestionsService['suggest']>()
    const app = appWith({ allow: async () => true, suggest })

    for (const body of [
      { ...suggestion, algorithm: 'hello world!' },
      { ...suggestion, algorithm: '123' },
      { ...suggestion, website: 'https://spam.test' },
      { ...suggestion, caseName: '   ' }
    ]) {
      expect((await app.request('/api/v1/algorithms/suggestions', post(body))).status).toBe(400)
    }
    expect(suggest).not.toHaveBeenCalled()
  })

  it('answers 201 with the issue url, or 400 for an unknown set', async () => {
    const suggest = vi.fn<SuggestionsService['suggest']>(async (input) =>
      input.methodSlug === 'pll' ? { url: 'https://github.com/o/r/issues/1' } : { error: 'unknown-set' }
    )
    const app = appWith({ allow: async () => true, suggest })

    const ok = await app.request('/api/v1/algorithms/suggestions', post(suggestion))
    const unknown = await app.request('/api/v1/algorithms/suggestions', post({ ...suggestion, methodSlug: 'nope' }))

    expect(ok.status).toBe(201)
    expect(await ok.json()).toEqual({ url: 'https://github.com/o/r/issues/1' })
    expect(unknown.status).toBe(400)
    expect(await unknown.json()).toEqual({ message: 'Unknown algorithm set' })
  })

  it('answers 500 when GitHub fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const app = appWith({ allow: async () => true, suggest: () => Promise.reject(new Error('GitHub down')) })

    const res = await app.request('/api/v1/algorithms/suggestions', post(suggestion))

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
  })
})
