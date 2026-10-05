import { EDGE_SECRET_HEADER } from '@nexustimer/contracts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import headersFile from '../../../public/_headers?raw'
import type { Env } from '../src/env'
import worker from '../src/index'
import { SECURITY_HEADERS } from '../src/security-headers'
import { sharedSolveMeta } from '../src/shared-solve-meta'

const SLUG = 'AbCdEf1234'

type Handler = {
  element?: (element: unknown) => void
}

let rewriters: FakeRewriter[] = []

class FakeRewriter {
  handlers: [string, Handler][] = []
  on(selector: string, handler: Handler) {
    this.handlers.push([selector, handler])
    return this
  }
  transform(response: Response) {
    rewriters.push(this)
    return response
  }
}

function fakeElement() {
  const element = {
    attributes: {} as Record<string, string>,
    content: '',
    appended: '',
    setAttribute(name: string, value: string) {
      element.attributes[name] = value
    },
    setInnerContent(value: string) {
      element.content = value
    },
    onEndTag(callback: (end: { before: (html: string) => void }) => void) {
      callback({ before: (html) => (element.appended = html) })
    }
  }
  return element
}

function setup(api: (request: Request) => Promise<Response> = async () => new Response('api')) {
  const assets = vi.fn(async (request: Request) => new Response(`asset:${new URL(request.url).pathname}`))
  const env: Env = {
    API_ORIGIN: 'https://api.example.com',
    EDGE_SECRET: 'edge-secret-0123456789abcdef0123',
    ASSETS: { fetch: assets } as unknown as Fetcher
  }
  const fetchMock = vi.fn(async (input: Request | URL | string, init?: RequestInit) =>
    api(input instanceof Request ? input : new Request(input, init))
  )
  vi.stubGlobal('fetch', fetchMock)
  const call = (path: string, headers: Record<string, string> = {}) =>
    worker.fetch(new Request(`https://beta.nexustimer.com${path}`, { headers }), env)
  const assetPaths = () => assets.mock.calls.map(([request]) => new URL(request.url).pathname)
  return { call, assetPaths, fetchMock }
}

beforeEach(() => {
  rewriters = []
  vi.stubGlobal('HTMLRewriter', FakeRewriter)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('edge worker', () => {
  it('sends every api route to the api origin', async () => {
    const { call, fetchMock, assetPaths } = setup()

    await call('/api/health')
    await call('/api/auth/get-session')

    expect(fetchMock.mock.calls.map(([req]) => (req as Request).url)).toEqual([
      'https://api.example.com/api/health',
      'https://api.example.com/api/auth/get-session'
    ])
    expect(assetPaths()).toEqual([])
  })

  it('leaves the language to the page, whatever the locale cookie says', async () => {
    const { call, assetPaths } = setup()
    const russian = { cookie: 'NEXT_LOCALE=ru', 'accept-language': 'es' }

    await call('/', russian)
    await call('/ja/people/64b7f0c2a1b2c3d4e5f60718', russian)
    await call('/ja/sign-up', russian)

    expect(assetPaths()).toEqual(['/', '/ja/people/_', '/ja/sign-up'])
  })

  it('serves dynamic pages from their prerendered shell', async () => {
    const { call, assetPaths } = setup()

    await call('/people/64b7f0c2a1b2c3d4e5f60718')
    await call('/es/free-play/123456.txt')
    await call('/app')

    expect(assetPaths()).toEqual(['/people/_', '/es/free-play/_.txt', '/app'])
  })

  it('redirects on the session cookie before serving the auth pages and the pages that need a session', async () => {
    const { call, assetPaths } = setup()
    const secure = { cookie: 'NEXT_LOCALE=es; __Secure-better-auth.session_token=abc.def%3D' }
    const local = { cookie: 'better-auth.session_token=abc.def' }

    const signedInAuth = await call('/es/sign-in?error=x', secure)
    const signedOutMember = await call('/friends')
    const emptyCookie = await call('/messages', { cookie: 'better-auth.session_token=' })

    await call('/sign-up')
    await call('/es/messages', local)

    expect(signedInAuth.status).toBe(307)
    expect(signedInAuth.headers.get('location')).toBe('https://beta.nexustimer.com/es/app')
    expect(signedOutMember.headers.get('location')).toBe('https://beta.nexustimer.com/sign-in')
    expect(emptyCookie.headers.get('location')).toBe('https://beta.nexustimer.com/sign-in')
    expect(assetPaths()).toEqual(['/sign-up', '/es/messages'])
  })

  it('adds the site headers from _headers to every page it answers', async () => {
    const lines = headersFile.split(/\r?\n/)
    const start = lines.indexOf('/*') + 1
    const siteHeaders = Object.fromEntries(
      lines.slice(start, lines.indexOf('', start)).map((line) =>
        line
          .trim()
          .split(/:\s(.*)/)
          .slice(0, 2)
      )
    )
    const { call } = setup()

    const responses = [await call('/'), await call('/friends'), await call('/people/64b7f0c2a1b2c3d4e5f60718')]

    expect(SECURITY_HEADERS).toEqual(siteHeaders)
    for (const res of responses) {
      expect(Object.fromEntries(Object.keys(siteHeaders).map((name) => [name, res.headers.get(name)]))).toEqual(
        siteHeaders
      )
    }
  })

  it('fills the meta tags of a shared solve from the api', async () => {
    const solve = {
      slug: SLUG,
      puzzle: '3x3',
      time: 9431,
      plus2: true,
      dnf: false,
      scramble: "R U R' U'",
      author: { _id: 'u1', name: 'Ana', image: '' }
    }
    const { call, fetchMock } = setup(async () => Response.json(solve))

    const res = await call(`/s/${SLUG}`)

    expect(res.status).toBe(200)
    const [input, init] = fetchMock.mock.calls[0]!
    const request = new Request(input as URL, init)
    expect(request.url).toBe(`https://api.example.com/api/v1/shared-solves/${SLUG}`)
    expect(request.headers.get(EDGE_SECRET_HEADER)).toBe('edge-secret-0123456789abcdef0123')

    const run = (skip: string[] = []) =>
      Object.fromEntries(
        rewriters[0]!.handlers
          .filter(([selector]) => !skip.includes(selector))
          .map(([selector, handler]) => {
            const element = fakeElement()
            handler.element?.(element)
            return [selector, element]
          })
      )
    const elements = run(['link[rel="canonical"]'])
    expect(elements['title']!.content).toBe('9.43+ 3x3 · Ana')
    expect(elements['meta[name="description"]']!.attributes.content).toBe("R U R' U'")
    expect(elements['meta[property="og:type"]']!.attributes.content).toBe('article')
    expect(elements['head']!.appended).toBe(`<link rel="canonical" href="https://nexustimer.com/s/${SLUG}"/>`)

    const withCanonical = run()
    expect(withCanonical['link[rel="canonical"]']!.attributes.href).toBe(`https://nexustimer.com/s/${SLUG}`)
    expect(withCanonical['head']!.appended).toBe('')
  })

  it('answers 404 with the shell for a missing or malformed shared solve, and the plain shell when the api fails', async () => {
    const missing = setup(async () => new Response('{}', { status: 404 }))
    const notFound = await missing.call(`/s/${SLUG}`)
    const malformed = await missing.call('/s/nope')

    const failing = setup(async () => new Response('boom', { status: 500 }))
    const degraded = await failing.call(`/s/${SLUG}`)

    expect(notFound.status).toBe(404)
    expect(await notFound.text()).toBe('asset:/s/_')
    expect(malformed.status).toBe(404)
    expect(missing.fetchMock).toHaveBeenCalledTimes(1)
    expect(degraded.status).toBe(200)
    expect(rewriters).toEqual([])
  })
})

describe('sharedSolveMeta', () => {
  it('writes DNF instead of a time', () => {
    expect(
      sharedSolveMeta({
        slug: SLUG,
        puzzle: '2x2',
        time: 61234,
        plus2: false,
        dnf: true,
        scramble: 'R U',
        solvedAt: 0,
        hasReplay: false,
        sharedAt: '',
        author: { _id: 'u1', name: 'Ben', image: '' },
        isOwner: false
      })
    ).toEqual({ title: 'DNF 2x2 · Ben', description: 'R U', canonical: `https://nexustimer.com/s/${SLUG}` })
  })
})
