import { REQUEST_ID_HEADER } from '@nexustimer/contracts'
import { describe, expect, it, vi } from 'vitest'
import { buildTestApp, TEST_EDGE_SECRET, testEnv } from './helpers'

describe('error handling', () => {
  it('answers unknown routes with the v1 not found shape', async () => {
    const res = await buildTestApp().request('/api/v1/does-not-exist')

    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ message: 'Not found' })
  })

  it('hides unexpected errors behind a generic 500 and logs them', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const app = buildTestApp()
    app.get('/boom', () => {
      throw new Error('kaboom')
    })

    const res = await app.request('/api/boom')

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Internal server error' })
    expect(consoleError).toHaveBeenCalledOnce()
    expect(String(consoleError.mock.calls[0]?.[0])).toContain('kaboom')
  })

  it('keeps the request id forwarded by the edge', async () => {
    const res = await buildTestApp().request('/api/health', { headers: { [REQUEST_ID_HEADER]: 'ray-123' } })

    expect(res.headers.get(REQUEST_ID_HEADER)).toBe('ray-123')
  })

  it('generates a request id when none is forwarded', async () => {
    const res = await buildTestApp().request('/api/health')

    expect(res.headers.get(REQUEST_ID_HEADER)).toBeTruthy()
  })

  it('replaces a malformed request id', async () => {
    const res = await buildTestApp().request('/api/health', { headers: { [REQUEST_ID_HEADER]: 'bad id <script>' } })

    expect(res.headers.get(REQUEST_ID_HEADER)).not.toBe('bad id <script>')
  })

  it('adds the request id to rejected and failed responses', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const guarded = buildTestApp({ env: testEnv({ EDGE_SECRET: TEST_EDGE_SECRET }) })
    const failing = buildTestApp()
    failing.get('/boom', () => {
      throw new Error('kaboom')
    })

    const rejected = await guarded.request('/api/health', { headers: { [REQUEST_ID_HEADER]: 'ray-401' } })
    const failed = await failing.request('/api/boom', { headers: { [REQUEST_ID_HEADER]: 'ray-500' } })

    expect(rejected.status).toBe(401)
    expect(rejected.headers.get(REQUEST_ID_HEADER)).toBe('ray-401')
    expect(failed.status).toBe(500)
    expect(failed.headers.get(REQUEST_ID_HEADER)).toBe('ray-500')
  })
})
