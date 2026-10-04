import { describe, expect, it, vi } from 'vitest'
import type { Env } from '../src/env'
import worker from '../src/index'

const env: Env = { API_ORIGIN: 'https://api.example.com', EDGE_SECRET: 'edge-secret-0123456789abcdef0123' }

function stubFetch() {
  const fetchMock = vi.fn(async (_input: Request) => new Response('ok'))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('edge worker', () => {
  it('sends every api route to the api origin', async () => {
    const fetchMock = stubFetch()

    await worker.fetch(new Request('https://beta.nexustimer.com/api/health'), env)
    await worker.fetch(new Request('https://beta.nexustimer.com/api/auth/get-session'), env)

    expect(fetchMock.mock.calls.map(([req]) => req.url)).toEqual([
      'https://api.example.com/api/health',
      'https://api.example.com/api/auth/get-session'
    ])
  })

  it('answers 404 for anything else without calling out', async () => {
    const fetchMock = stubFetch()

    const res = await worker.fetch(new Request('https://beta.nexustimer.com/es/app'), env)

    expect(res.status).toBe(404)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
