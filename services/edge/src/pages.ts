import { DEFAULT_LOCALE } from '@nexustimer/contracts'
import type { Env } from './env'
import { negotiateLocale } from './locale'
import { resolvePage } from './routes'
import { sharedSolvePage } from './shared-solve-meta'

const redirect = (location: URL) => new Response(null, { status: 307, headers: { location: location.toString() } })

export async function handlePage(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const route = resolvePage(url.pathname)

  switch (route.kind) {
    case 'negotiate': {
      const locale = negotiateLocale(request)
      if (locale === DEFAULT_LOCALE) return env.ASSETS.fetch(request)
      return redirect(new URL(`/${locale}${url.search}`, url))
    }
    case 'redirect':
      return redirect(new URL(`${route.location}${url.search}`, url))
    case 'dynamic': {
      const shell = await env.ASSETS.fetch(new Request(new URL(route.assetPath, url), request))
      if (route.base === '/s' && route.isDocument && shell.ok) return sharedSolvePage(shell, route.id, env)
      return shell
    }
    case 'asset':
      return env.ASSETS.fetch(request)
  }
}
