import { CLIENT_IP_HEADER, EDGE_SECRET_HEADER } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import { buildTestApp, TEST_EDGE_SECRET, testEnv } from './helpers'

function appWithIpProbe(secret?: string) {
  const app = buildTestApp({ env: testEnv({ EDGE_SECRET: secret }) })
  app.get('/probe', (c) => Response.json({ clientIp: c.var.clientIp }))
  return app
}

describe('edge guard', () => {
  it('rejects requests without the edge secret when one is configured', async () => {
    const res = await appWithIpProbe(TEST_EDGE_SECRET).request('/api/probe')

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'Unauthorized' })
  })

  it('rejects a wrong edge secret', async () => {
    const res = await appWithIpProbe(TEST_EDGE_SECRET).request('/api/probe', {
      headers: { [EDGE_SECRET_HEADER]: 'wrong-secret-wrong-secret-wrong-secret' }
    })

    expect(res.status).toBe(401)
  })

  it('trusts the client ip forwarded by the edge when the secret matches', async () => {
    const res = await appWithIpProbe(TEST_EDGE_SECRET).request('/api/probe', {
      headers: {
        [EDGE_SECRET_HEADER]: TEST_EDGE_SECRET,
        [CLIENT_IP_HEADER]: '203.0.113.7',
        'x-forwarded-for': '10.0.0.1'
      }
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ clientIp: '203.0.113.7' })
  })

  it('falls back to x-forwarded-for when no secret is configured', async () => {
    const res = await appWithIpProbe().request('/api/probe', {
      headers: { [CLIENT_IP_HEADER]: '203.0.113.7', 'x-forwarded-for': '198.51.100.4, 10.0.0.1' }
    })

    expect(await res.json()).toEqual({ clientIp: '198.51.100.4' })
  })
})
