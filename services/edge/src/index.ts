import type { Env } from './env'
import { handlePage } from './pages'
import { proxyToApi } from './proxy'
import { isApiPath } from './routes'
import { withSecurityHeaders } from './security-headers'

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)
    if (isApiPath(pathname)) return proxyToApi(request, env)
    return withSecurityHeaders(await handlePage(request, env))
  }
} satisfies ExportedHandler<Env>
