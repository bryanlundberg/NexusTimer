import type { Env } from './env'
import { proxyToApi } from './proxy'
import { isApiPath } from './routes'

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (isApiPath(pathname)) return proxyToApi(request, env)
    return new Response('Not found', { status: 404 })
  }
} satisfies ExportedHandler<Env>
