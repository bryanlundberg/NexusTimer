import type { Env } from './env'
import { proxyToApi } from './proxy'
import { isMigratedApiPath } from './routes'

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (isMigratedApiPath(pathname)) return proxyToApi(request, env)
    return fetch(request)
  }
} satisfies ExportedHandler<Env>
