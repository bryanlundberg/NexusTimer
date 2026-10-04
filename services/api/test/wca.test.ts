import { describe, expect, it, vi } from 'vitest'
import { createWcaClient, type WcaClient } from '../src/infra/wca'
import { createProfileCache, createStatsCache } from '../src/modules/users/users.cache'
import type { UsersRepository } from '../src/modules/users/users.repository'
import { createUsersService, type UsersService } from '../src/modules/users/users.service'
import { createWcaService, type WcaService } from '../src/modules/wca/wca.service'
import { fakeRedis } from './fake-redis'
import { buildTestApp, testEnv, testSessions } from './helpers'

const USER = '64b7f0c2a1b2c3d4e5f60718'
const APP = 'https://beta.nexustimer.com'

type Call = { url: string; init: RequestInit }

function fakeWcaApi({
  token = 'access-1',
  wcaId = '2019LUND01' as string | null,
  failToken = false,
  failMe = false
} = {}) {
  const calls: Call[] = []
  const request = (async (url: string, init: RequestInit = {}) => {
    calls.push({ url, init })
    if (url.endsWith('/oauth/token')) {
      return failToken ? new Response('bad code', { status: 401 }) : Response.json({ access_token: token })
    }
    return failMe ? new Response('nope', { status: 500 }) : Response.json({ me: { wca_id: wcaId } })
  }) as unknown as typeof fetch
  return { calls, request }
}

describe('wca client', () => {
  it('builds the authorize url and only counts as configured with both credentials', () => {
    const client = createWcaClient({ clientId: 'id-1', clientSecret: 'secret-1' })
    const url = new URL(client.authorizeUrl(`${APP}/api/v1/wca/callback`, 'state-1'))

    expect(client.configured).toBe(true)
    expect(createWcaClient({ clientId: 'id-1' }).configured).toBe(false)
    expect(url.origin + url.pathname).toBe('https://www.worldcubeassociation.org/oauth/authorize')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      client_id: 'id-1',
      redirect_uri: `${APP}/api/v1/wca/callback`,
      response_type: 'code',
      scope: 'public',
      state: 'state-1'
    })
  })

  it('exchanges the code with the app credentials and reads the WCA ID', async () => {
    const api = fakeWcaApi()
    const client = createWcaClient({ clientId: 'id-1', clientSecret: 'secret-1', fetch: api.request })

    expect(await client.exchangeCode('code-1', `${APP}/api/v1/wca/callback`)).toBe('access-1')
    expect(await client.profile('access-1')).toEqual({ wcaId: '2019LUND01' })
    expect(JSON.parse(String(api.calls[0]!.init.body))).toEqual({
      grant_type: 'authorization_code',
      client_id: 'id-1',
      client_secret: 'secret-1',
      code: 'code-1',
      redirect_uri: `${APP}/api/v1/wca/callback`
    })
    expect(new Headers(api.calls[1]!.init.headers).get('authorization')).toBe('Bearer access-1')
  })

  it('answers null for a refused code or an unreadable profile, and no ID for accounts without one', async () => {
    const refused = createWcaClient({
      clientId: 'a',
      clientSecret: 'b',
      fetch: fakeWcaApi({ failToken: true }).request
    })
    const empty = createWcaClient({ clientId: 'a', clientSecret: 'b', fetch: fakeWcaApi({ token: '' }).request })
    const down = createWcaClient({ clientId: 'a', clientSecret: 'b', fetch: fakeWcaApi({ failMe: true }).request })
    const noId = createWcaClient({ clientId: 'a', clientSecret: 'b', fetch: fakeWcaApi({ wcaId: null }).request })

    expect(await refused.exchangeCode('c', 'r')).toBeNull()
    expect(await empty.exchangeCode('c', 'r')).toBeNull()
    expect(await down.profile('t')).toBeNull()
    expect(await noId.profile('t')).toEqual({ wcaId: null })
  })
})

describe('wca service', () => {
  function setup(client: Partial<WcaClient>, setWca = vi.fn<UsersService['setWca']>(async () => 'saved')) {
    const wca: WcaClient = {
      configured: true,
      authorizeUrl: (redirectUri, state) => `https://wca.test/authorize?redirect_uri=${redirectUri}&state=${state}`,
      exchangeCode: async () => 'token',
      profile: async () => ({ wcaId: '2019LUND01' }),
      ...client
    }
    const service = createWcaService({
      wca,
      users: { setWca },
      appUrl: APP,
      now: () => 1234,
      newState: () => 'state-1'
    })
    return { service, setWca }
  }

  it('starts the flow with the callback on the site origin', () => {
    expect(setup({}).service.start()).toEqual({
      url: `https://wca.test/authorize?redirect_uri=${APP}/api/v1/wca/callback&state=state-1`,
      state: 'state-1'
    })
    expect(setup({ configured: false }).service.start()).toBeNull()
  })

  it('links the WCA ID with the verification time', async () => {
    const { service, setWca } = setup({})

    expect(await service.link(USER, 'code')).toBe('success')
    expect(setWca).toHaveBeenCalledWith(USER, { wcaId: '2019LUND01', verifiedAt: 1234 })
  })

  it('names every way linking can end', async () => {
    expect(await setup({ exchangeCode: async () => null }).service.link(USER, 'code')).toBe('error')
    expect(await setup({ profile: async () => null }).service.link(USER, 'code')).toBe('error')
    expect(await setup({ profile: async () => ({ wcaId: null }) }).service.link(USER, 'code')).toBe('no-id')
    expect(
      await setup(
        {},
        vi.fn<UsersService['setWca']>(async () => 'taken')
      ).service.link(USER, 'code')
    ).toBe('taken')
  })

  it('unlinks and points results at the account page', async () => {
    const { service, setWca } = setup({})

    await service.unlink(USER)

    expect(setWca).toHaveBeenCalledWith(USER, null)
    expect(service.resultUrl('taken')).toBe(`${APP}/account?tab=account&wca=taken`)
  })
})

describe('users setWca', () => {
  it('drops the cached profile only when the WCA ID was saved', async () => {
    const redis = fakeRedis()
    let result: 'saved' | 'taken' = 'taken'
    const users = createUsersService({
      repository: { setWca: async () => result } as unknown as UsersRepository,
      profileCache: createProfileCache(redis.provider),
      statsCache: createStatsCache(redis.provider),
      achievements: { grantedKeys: async () => [] }
    })
    redis.strings.set(`user:profile:${USER}`, '{}')

    expect(await users.setWca(USER, { wcaId: 'X', verifiedAt: 1 })).toBe('taken')
    expect(redis.strings.has(`user:profile:${USER}`)).toBe(true)

    result = 'saved'
    expect(await users.setWca(USER, null)).toBe('saved')
    expect(redis.strings.has(`user:profile:${USER}`)).toBe(false)
  })
})

describe('wca routes', () => {
  const service: WcaService = {
    start: () => ({ url: 'https://www.worldcubeassociation.org/oauth/authorize?state=state-1', state: 'state-1' }),
    link: async () => 'success',
    unlink: async () => {},
    resultUrl: (status) => `${APP}/account?tab=account&wca=${status}`
  }

  function appWith(overrides: Partial<WcaService>, userId: string | null = USER, production = false) {
    return buildTestApp({
      env: testEnv(production ? { NODE_ENV: 'production' } : {}),
      sessions: testSessions(userId),
      wca: { ...service, ...overrides }
    })
  }

  it('sends signed-out users and an unconfigured app back with an error', async () => {
    const signedOut = await appWith({}, null).request('/api/v1/wca/authorize')
    const unconfigured = await appWith({ start: () => null }).request('/api/v1/wca/authorize')

    for (const res of [signedOut, unconfigured]) {
      expect(res.status).toBe(307)
      expect(res.headers.get('location')).toBe(`${APP}/account?tab=account&wca=error`)
      expect(res.headers.get('set-cookie')).toBeNull()
    }
  })

  it('redirects to WCA with a short-lived state cookie, secure in production', async () => {
    const dev = await appWith({}).request('/api/v1/wca/authorize')
    const prod = await appWith({}, USER, true).request('/api/v1/wca/authorize')

    expect(dev.status).toBe(307)
    expect(dev.headers.get('location')).toBe('https://www.worldcubeassociation.org/oauth/authorize?state=state-1')
    expect(dev.headers.get('set-cookie')).toBe('wca_state=state-1; Max-Age=600; Path=/; HttpOnly; SameSite=Lax')
    expect(prod.headers.get('set-cookie')).toBe(
      'wca_state=state-1; Max-Age=600; Path=/; HttpOnly; Secure; SameSite=Lax'
    )
  })

  it('links only when the state matches the cookie, and always clears it', async () => {
    const link = vi.fn<WcaService['link']>(async () => 'taken')
    const app = appWith({ link })
    const callback = (query: string, cookie?: string) =>
      app.request(`/api/v1/wca/callback?${query}`, cookie ? { headers: { cookie } } : {})

    const missingCookie = await callback('code=c1&state=state-1')
    const mismatch = await callback('code=c1&state=other', 'wca_state=state-1')
    const missingCode = await callback('state=state-1', 'wca_state=state-1')
    const linked = await callback('code=c1&state=state-1', 'wca_state=state-1')

    for (const res of [missingCookie, mismatch, missingCode]) {
      expect(res.headers.get('location')).toBe(`${APP}/account?tab=account&wca=error`)
    }
    expect(linked.status).toBe(307)
    expect(linked.headers.get('location')).toBe(`${APP}/account?tab=account&wca=taken`)
    expect(linked.headers.get('set-cookie')).toBe('wca_state=; Max-Age=0; Path=/')
    expect(link.mock.calls).toEqual([[USER, 'c1']])
  })

  it('turns a failed exchange into the error result and needs a session for the callback', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const failing = await appWith({ link: () => Promise.reject(new Error('WCA down')) }).request(
      '/api/v1/wca/callback?code=c1&state=state-1',
      { headers: { cookie: 'wca_state=state-1' } }
    )
    const signedOut = await appWith({}, null).request('/api/v1/wca/callback?code=c1&state=state-1', {
      headers: { cookie: 'wca_state=state-1' }
    })

    expect(failing.headers.get('location')).toBe(`${APP}/account?tab=account&wca=error`)
    expect(signedOut.headers.get('location')).toBe(`${APP}/account?tab=account&wca=error`)
  })

  it('unlinks with a session and answers 204', async () => {
    const unlink = vi.fn<WcaService['unlink']>(async () => {})

    const anonymous = await appWith({ unlink }, null).request('/api/v1/wca', { method: 'DELETE' })
    const done = await appWith({ unlink }).request('/api/v1/wca', { method: 'DELETE' })

    expect(anonymous.status).toBe(401)
    expect(done.status).toBe(204)
    expect(unlink.mock.calls).toEqual([[USER]])
  })
})
