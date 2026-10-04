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
  it('sends migrated routes to the api origin', async () => {
    const fetchMock = stubFetch()

    await worker.fetch(new Request('https://nexustimer.com/api/health'), env)

    expect(fetchMock.mock.calls[0]?.[0].url).toBe('https://api.example.com/api/health')
  })

  it('lets everything else reach the current origin unchanged', async () => {
    const fetchMock = stubFetch()
    const request = new Request('https://nexustimer.com/api/v1/chats') as Parameters<typeof worker.fetch>[0]

    await worker.fetch(request, env)

    expect(fetchMock).toHaveBeenCalledWith(request)
  })
})
