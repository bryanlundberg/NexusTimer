import { describe, expect, it, vi } from 'vitest'
import { buildTestApp } from './helpers'

describe('health', () => {
  it('reports liveness without touching dependencies', async () => {
    const mongo = vi.fn(() => Promise.resolve())
    const app = buildTestApp({ checks: { mongo } })

    const res = await app.request('/api/health')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
    expect(mongo).not.toHaveBeenCalled()
  })

  it('reports ready when every dependency answers', async () => {
    const app = buildTestApp()

    const res = await app.request('/api/health/ready')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok', checks: { mongo: 'ok', redis: 'ok' } })
  })

  it('reports degraded with 503 when a dependency fails', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const app = buildTestApp({
      checks: { mongo: () => Promise.resolve(), redis: () => Promise.reject(new Error('down')) }
    })

    const res = await app.request('/api/health/ready')

    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ status: 'degraded', checks: { mongo: 'ok', redis: 'fail' } })
  })
})
