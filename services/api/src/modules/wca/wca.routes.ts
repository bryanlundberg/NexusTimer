import type { WcaLinkStatus } from '@nexustimer/contracts'
import { Hono, type MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { serialize } from 'hono/utils/cookie'
import type { UserEnv, ViewerEnv } from '../../http/require-user'
import { noContent, serverError } from '../../http/responses'
import type { AppEnv } from '../../http/types'
import { logger, serializeError } from '../../lib/logger'
import type { WcaService } from './wca.service'

const STATE_COOKIE = 'wca_state'
const STATE_MAX_AGE_SECONDS = 600

const redirect = (location: string) => new Response(null, { status: 307, headers: { location } })

export function wcaRoutes(
  wca: WcaService,
  { secureCookies }: { secureCookies: boolean },
  signedIn: MiddlewareHandler<UserEnv>,
  viewer: MiddlewareHandler<ViewerEnv>
) {
  function finish(status: WcaLinkStatus) {
    const res = redirect(wca.resultUrl(status))
    res.headers.append('set-cookie', serialize(STATE_COOKIE, '', { path: '/', maxAge: 0 }))
    return res
  }

  return new Hono<AppEnv>()
    .get('/authorize', viewer, (c) => {
      const started = c.var.viewerId ? wca.start() : null
      if (!started) return redirect(wca.resultUrl('error'))

      const res = redirect(started.url)
      const cookie = serialize(STATE_COOKIE, started.state, {
        httpOnly: true,
        secure: secureCookies,
        sameSite: 'Lax',
        path: '/',
        maxAge: STATE_MAX_AGE_SECONDS
      })
      res.headers.append('set-cookie', cookie)
      return res
    })
    .get('/callback', viewer, async (c) => {
      try {
        const userId = c.var.viewerId
        if (!userId) return finish('error')

        const code = c.req.query('code')
        const state = c.req.query('state')
        const storedState = getCookie(c, STATE_COOKIE)
        if (!code || !state || !storedState || state !== storedState) return finish('error')

        return finish(await wca.link(userId, code))
      } catch (error) {
        logger.error('wca callback failed', { error: serializeError(error) })
        return finish('error')
      }
    })
    .delete('/', signedIn, async (c) => {
      try {
        await wca.unlink(c.var.userId)
        return noContent()
      } catch (error) {
        return serverError('wca:DELETE', error)
      }
    })
}
