import { CLIENT_IP_HEADER, EDGE_SECRET_HEADER, REQUEST_ID_HEADER } from '@nexustimer/contracts'
import type { Env } from './env'

type ProxyInit = RequestInit & { duplex?: 'half' }

export function buildApiRequest(request: Request, env: Env): Request {
  const source = new URL(request.url)
  const target = new URL(`${source.pathname}${source.search}`, env.API_ORIGIN)

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.set(EDGE_SECRET_HEADER, env.EDGE_SECRET)
  headers.set('x-forwarded-host', source.host)

  const clientIp = request.headers.get('cf-connecting-ip')
  if (clientIp) headers.set(CLIENT_IP_HEADER, clientIp)
  else headers.delete(CLIENT_IP_HEADER)

  const ray = request.headers.get('cf-ray')
  if (ray) headers.set(REQUEST_ID_HEADER, ray)

  const init: ProxyInit = { method: request.method, headers, redirect: 'manual' }
  if (request.body) {
    init.body = request.body
    init.duplex = 'half'
  }
  return new Request(target, init)
}

export function proxyToApi(request: Request, env: Env) {
  return fetch(buildApiRequest(request, env))
}
