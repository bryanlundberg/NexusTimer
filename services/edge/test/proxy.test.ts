import { CLIENT_IP_HEADER, EDGE_SECRET_HEADER, REQUEST_ID_HEADER } from '@nexustimer/contracts'
import { describe, expect, it } from 'vitest'
import type { Env } from '../src/env'
import { buildApiRequest } from '../src/proxy'

const env: Env = { API_ORIGIN: 'https://api.example.com', EDGE_SECRET: 'edge-secret-0123456789abcdef0123' }

describe('buildApiRequest', () => {
  it('targets the api origin keeping path and query', () => {
    const req = buildApiRequest(new Request('https://nexustimer.com/api/health/ready?verbose=1'), env)

    expect(req.url).toBe('https://api.example.com/api/health/ready?verbose=1')
    expect(req.headers.get('x-forwarded-host')).toBe('nexustimer.com')
  })

  it('signs the request and forwards the real client ip and ray id', () => {
    const req = buildApiRequest(
      new Request('https://nexustimer.com/api/health', {
        headers: { 'cf-connecting-ip': '203.0.113.7', 'cf-ray': 'ray-abc', cookie: 'session=1' }
      }),
      env
    )

    expect(req.headers.get(EDGE_SECRET_HEADER)).toBe(env.EDGE_SECRET)
    expect(req.headers.get(CLIENT_IP_HEADER)).toBe('203.0.113.7')
    expect(req.headers.get(REQUEST_ID_HEADER)).toBe('ray-abc')
    expect(req.headers.get('cookie')).toBe('session=1')
  })

  it('never trusts edge headers sent by the browser', () => {
    const req = buildApiRequest(
      new Request('https://nexustimer.com/api/health', {
        headers: { [EDGE_SECRET_HEADER]: 'forged', [CLIENT_IP_HEADER]: '6.6.6.6' }
      }),
      env
    )

    expect(req.headers.get(EDGE_SECRET_HEADER)).toBe(env.EDGE_SECRET)
    expect(req.headers.get(CLIENT_IP_HEADER)).toBeNull()
  })

  it('passes method, body and redirects through untouched', async () => {
    const req = buildApiRequest(
      new Request('https://nexustimer.com/api/health', { method: 'POST', body: '{"a":1}' }),
      env
    )

    expect(req.method).toBe('POST')
    expect(req.redirect).toBe('manual')
    expect(await req.text()).toBe('{"a":1}')
  })
})
